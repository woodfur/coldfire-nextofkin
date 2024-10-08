import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, Idl, ProgramAccount, BN } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import idl from '../../../anchor/target/idl/dead_mans_switch.json';
import { DeadMansSwitch } from '../../../anchor/target/types/dead_mans_switch';
import { sendAndConfirmTransaction } from '@solana/web3.js';
import {getBasicProgram} from "@coldfire/anchor"

import {Plan, PlanType } from '../types/plan';
import { program } from '@coral-xyz/anchor/dist/cjs/native/system';
import { fetchTokenMetadata } from '@/components/hooks/useTokenMetadata';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';


export function useDeadMansSwitch() {
  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  const getProgram = () => {
    if (!publicKey || !signTransaction || !signAllTransactions) {
      throw new Error('Wallet not connected');
    }
    
    const provider = new AnchorProvider(
      connection,
      { publicKey, signTransaction, signAllTransactions },
      { commitment: 'processed' }
    );
    
    const program = getBasicProgram(provider);
    
    // Add this line to log the program ID
    console.log("Program ID from IDL:", program.programId.toBase58());
    
    return program;
  };

  const initializeSwitch = async (switchDelay: BN, beneficiary: PublicKey) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }
  
    const program = getProgram();
    const switchAccount = web3.Keypair.generate();
  
    await program.methods
      .executeSwitch()
      .accounts({
        switch: switchAccount.publicKey,
        owner: publicKey,
      })
      .signers([switchAccount])
      .rpc();
  
    return switchAccount.publicKey;
  };

  const createPlan = async (planData: {
    name: string;
    description: string;
    planType: PlanType;
    beneficiary: PublicKey;
    allocation: BN,
    asset: PublicKey;
    inactivityPeriod: BN; 
  }) => {
    if (!publicKey || !signTransaction) {
      throw new Error('Wallet not connected or signTransaction not available');
    }
  
    const program = getProgram();
    const planAccount = web3.Keypair.generate();
    const switchAccount = web3.Keypair.generate();

    console.log('planAccount', planAccount.publicKey.toBase58());
    console.log('switchAccount', switchAccount.publicKey.toBase58());

    
  
    const retryCount = 3;
    for (let i = 0; i < retryCount; i++) {
      try {
        const latestBlockhash = await connection.getLatestBlockhash();

  
        const tx = await program.methods
          .createPlan(
            planData.name,
            planData.description,
            planData.planType,
            planData.beneficiary,
            planData.asset,
            planData.allocation,
            planData.inactivityPeriod 
          )
          .accounts({
            plan: planAccount.publicKey,
            owner: publicKey,
            switch: switchAccount.publicKey,
          })
          .signers([planAccount])
          .transaction();
  
        tx.recentBlockhash = latestBlockhash.blockhash;
        tx.feePayer = publicKey;
        tx.partialSign(planAccount, switchAccount);
  
        const signedTx = await signTransaction(tx);
        const txId = await connection.sendRawTransaction(signedTx.serialize(), {
            skipPreflight: true,
        });
        console.log('txId', txId);
        // await connection.confirmTransaction({
        //   signature: txId,
        //   blockhash: latestBlockhash.blockhash,
        //   lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        // });

        await connection.confirmTransaction(txId, 'processed');
  
        console.log('Plan created successfully');
        return planAccount.publicKey;
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        if (i === retryCount - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  
    throw new Error('Failed to create plan after multiple attempts');
  };



  const getPlans = async (): Promise<Plan[]> => {
    if (!publicKey) {
      console.log('No wallet connected');
      throw new Error('Wallet not connected');
    }
  
    console.log('Fetching plans for public key:', publicKey.toBase58());
  
    const program = getProgram() as Program<DeadMansSwitch>;
    
    try {
      console.log('Fetching all plan accounts...');
      const plans = await program.account.plan.all([
        {
          memcmp: {
            offset: 8, // Discriminator
            bytes: publicKey.toBase58(),
          },
        },
      ]);
  
      console.log('Raw plans data:', plans);
  
      const processedPlans = plans.map((planAccount: ProgramAccount<any>): Plan => {
        console.log('Processing plan account:', planAccount.publicKey.toBase58());
        
        return {
          publicKey: planAccount.publicKey.toString(),
          owner: new PublicKey(planAccount.account.owner),
          name: planAccount.account.name,
          description: planAccount.account.description,
          planType: planAccount.account.planType.inheritance ? {inheritance: {}} : 
                    planAccount.account.planType.emergency ? {emergency: {}} : {business: {}},
          beneficiary: new PublicKey(planAccount.account.beneficiary),
          asset: {
            pubkey: new PublicKey(planAccount.account.asset),
            tokenName: 'Unknown', // You might want to fetch this separately
            tokenType: 'UNK', // You might want to fetch this separately
          },
          allocation: new BN(planAccount.account.allocation),
          createdAt: new BN(planAccount.account.createdAt),
          switch: new PublicKey(planAccount.account.switch),
        };
      });
  
      console.log('Processed plans:', processedPlans);
      return processedPlans;
    } catch (error) {
      console.error('Error in getPlans:', error);
      throw error;
    }
  };

  return { initializeSwitch, createPlan, getPlans };
}
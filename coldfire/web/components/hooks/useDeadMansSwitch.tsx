import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, Idl, ProgramAccount, BN } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import idl from '../../../anchor/target/idl/dead_mans_switch.json';
import { DeadMansSwitch } from '../../../anchor/target/types/dead_mans_switch';
import { sendAndConfirmTransaction } from '@solana/web3.js';

import {Plan } from '../types/plan';
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
    return new Program(idl as any, provider);
  };

  const initializeSwitch = async (switchDelay: BN, beneficiary: PublicKey) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }
  
    const program = getProgram();
    const switchAccount = web3.Keypair.generate();
  
    await program.methods
      .initialize(switchDelay)
      .accounts({
        switch: switchAccount.publicKey,
        owner: publicKey,
        beneficiary: beneficiary,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([switchAccount])
      .rpc();
  
    return switchAccount.publicKey;
  };

  const createPlan = async (planData: {
    name: string;
    description: string;
    planType: 'Inheritance' | 'Emergency' | 'Business';
    beneficiary: PublicKey;
    allocation: BN,
    assets: PublicKey;
    switchAccount: PublicKey;
    inactivityPeriod: BN; 
  }) => {
    if (!publicKey || !signTransaction) {
      throw new Error('Wallet not connected or signTransaction not available');
    }
  
    const program = getProgram();
    const planAccount = web3.Keypair.generate();

    console.log('planAccount', planAccount.publicKey.toBase58());

    
  
    const retryCount = 3;
    for (let i = 0; i < retryCount; i++) {
      try {
        const latestBlockhash = await connection.getLatestBlockhash();

        // const selectedBeneficiaries = planData.beneficiaries.map(b => new PublicKey(b));

      //   if (selectedBeneficiaries.length === 0) {
      //     throw new Error('No beneficiaries selected. Please select at least one beneficiary.');
      // }
      // console.log('Selected Beneficiary:', selectedBeneficiaries[0].toBase58());
  
        const tx = await program.methods
          .createPlan(
            planData.name,
            planData.description,
            { [planData.planType.toLowerCase()]: {} },
            planData.beneficiary,
            planData.allocation,
            planData.assets,
            planData.inactivityPeriod 
           
            
          )
          .accounts({
            plan: planAccount.publicKey,
            owner: publicKey,
            switch: planData.switchAccount,
            beneficiary: planData.beneficiary,
            systemProgram: web3.SystemProgram.programId,
          })
          .signers([planAccount])
          .transaction();
  
        tx.recentBlockhash = latestBlockhash.blockhash;
        tx.feePayer = publicKey;
        tx.partialSign(planAccount);
  
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

  const fetchTokenInfo = async (mintAddress: string, connection: Connection) => {
    try {
      const mintPublicKey = new PublicKey(mintAddress);
      const token = new Token(connection, mintPublicKey, TOKEN_PROGRAM_ID, null as any);
      const mintInfo = await token.getMintInfo();
      
      // Fetch token accounts to get the total supply
      const tokenAccounts = await connection.getTokenLargestAccounts(mintPublicKey);
      const totalSupply = tokenAccounts.value.reduce((acc, account) => acc + account.amount, BigInt(0));

      return {
        name: `Token ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
        symbol: 'CUSTOM',
        decimals: mintInfo.decimals,
        totalSupply: totalSupply.toString(),
      };
    } catch (error) {
      console.error(`Error fetching token info for ${mintAddress}:`, error);
      return {
        name: 'Unknown Token',
        symbol: 'UNK',
        decimals: 0,
        totalSupply: '0',
      };
    }
  };



  const deletePlan = async (planPublicKey: PublicKey) => {
    if (!publicKey || !signTransaction) {
      throw new Error('Wallet not connected or signTransaction not available');
    }
  
    const program = getProgram();
  
    await program.methods
      .deletePlan() // Assuming you have a deletePlan method in your Anchor program
      .accounts({
        plan: planPublicKey,
        owner: publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
  };
  

  const getPlans = async () => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }
  
    const program = getProgram() as Program<DeadMansSwitch>;
    const plans = await program.account.plan.all([
      {
        memcmp: {
          offset: 8, // Discriminator
          bytes: publicKey.toBase58(),
        },
      },
    ]);

    const plansWithTokenInfo = await Promise.all(plans.map(async (planAccount: ProgramAccount<any>) => {
      const assetInfo = await Promise.all(planAccount.account.assets.map(async (asset: string) => {
        try {
          const assetPubkey = new PublicKey(asset);
          const tokenMetadata = await fetchTokenMetadata(asset);
          return {
            pubkey: assetPubkey,
            tokenName: tokenMetadata.name,
            tokenType: tokenMetadata.symbol,
          };
        } catch (error) {
          console.error(`Error fetching metadata for asset ${asset}:`, error);
          return {
            pubkey: new PublicKey(asset),
            tokenName: 'Unknown Token',
            tokenType: 'UNK',
          };
        }
      }));

      return {
        publicKey: planAccount.publicKey.toString(),
        owner: new PublicKey(planAccount.account.owner),
        name: planAccount.account.name,
        description: planAccount.account.description,
        planType: planAccount.account.planType,
        beneficiaries: planAccount.account.beneficiaries.map((b: string) => new PublicKey(b)),
        assets: assetInfo,
        distributionRules: planAccount.account.distributionRules,
        activationConditions: planAccount.account.activationConditions,
        createdAt: planAccount.account.createdAt,
      };
    }));
  
    return plansWithTokenInfo;
  };

  return { initializeSwitch, createPlan, getPlans, deletePlan };
}
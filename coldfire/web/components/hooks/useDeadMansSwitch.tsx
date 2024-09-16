import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, Idl, ProgramAccount } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '../../../anchor/target/idl/dead_mans_switch.json';
import { DeadMansSwitch } from '../../../anchor/target/types/dead_mans_switch';

import {Plan } from '../types/plan';
import { program } from '@coral-xyz/anchor/dist/cjs/native/system';


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

  const initializeSwitch = async (switchDelay: number) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }
  
    const program = getProgram();
    const switchAccount = web3.Keypair.generate();
  
    await program.methods
      .initializeSwitch(switchDelay)
      .accounts({
        switch: switchAccount.publicKey,
        owner: publicKey,
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
    beneficiaries: string[];
    assets: string[];
    distributionRules: string;
    activationConditions: string;
  }) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }
  
    const program = getProgram();
    const planAccount = web3.Keypair.generate();
  
    await program.methods
      .createPlan(
        planData.name,
        planData.description,
        { [planData.planType.toLowerCase()]: {} },
        planData.beneficiaries.map(b => new PublicKey(b)),
        planData.assets.map(a => new PublicKey(a)),
        planData.distributionRules,
        planData.activationConditions
      )
      .accounts({
        plan: planAccount.publicKey,
        owner: publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([planAccount])
      .rpc();
  
    return planAccount.publicKey;
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
  
    return plans.map((planAccount: ProgramAccount<any>) => ({
      publicKey: planAccount.publicKey.toString(),
      owner: new PublicKey(planAccount.account.owner),
      name: planAccount.account.name,
      description: planAccount.account.description,
      planType: planAccount.account.planType,
      beneficiaries: planAccount.account.beneficiaries.map((b: string) => new PublicKey(b)),
      assets: planAccount.account.assets.map((a: string) => new PublicKey(a)),
      distributionRules: planAccount.account.distributionRules,
      activationConditions: planAccount.account.activationConditions,
      createdAt: planAccount.account.createdAt,
    }));
  };

  return { initializeSwitch, createPlan, getPlans };
}
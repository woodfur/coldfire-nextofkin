import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';


export type PlanType = {inheritance: {}} | {emergency:{}} | {business:{}};


export interface Plan {
  publicKey: string;
  owner: PublicKey;
  name: string;
  description: string;
  planType: PlanType;
  beneficiary: PublicKey;
  asset: {
    pubkey: PublicKey;
    tokenName: string;
    tokenType: string;
  };
  allocation: BN;
  createdAt: number;
  switch: PublicKey;
}
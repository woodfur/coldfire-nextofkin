import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

export interface Plan {
  publicKey: string;
  owner: PublicKey;
  name: string;
  description: string;
  planType: string;
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
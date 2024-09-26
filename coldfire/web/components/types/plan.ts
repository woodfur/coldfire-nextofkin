import { PublicKey } from '@solana/web3.js';

export interface Asset {
  pubkey: PublicKey;
  tokenName: string;
  tokenType: string;
}

export interface Plan {
  publicKey: string;
  owner: PublicKey;
  name: string;
  description: string;
  planType: 'Inheritance' | 'Emergency' | 'Business';
  beneficiaries: PublicKey[];
  assets: String;
  distributionRules: string;
  activationConditions: string;
  createdAt: number;
}
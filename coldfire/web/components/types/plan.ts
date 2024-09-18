import { PublicKey } from '@solana/web3.js';

export interface Plan {
  publicKey: string;
  owner: PublicKey;
  name: string;
  description: string;
  planType: 'Inheritance' | 'Emergency' | 'Business';
  beneficiaries: PublicKey[];
  assets: PublicKey[];
  distributionRules: string;
  activationConditions: string;
  createdAt: number;
}
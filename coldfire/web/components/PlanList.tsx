import React from 'react';
import { Plan } from '@/components/types/plan';
import { PublicKey } from '@solana/web3.js';

interface PlanListProps {
  plans: Plan[];
  onPlanDeleted: (publicKey: string) => void;
}

const PlanList: React.FC<PlanListProps> = ({ plans, onPlanDeleted }) => {

  if (plans.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-4">
          No plans yet. Click "Add Plan" to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-dark text-gray-200 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Plan Name</th>
            <th className="py-3 px-6 text-left">Beneficiary</th>
            <th className="py-3 px-6 text-left">Asset</th>
            <th className="py-3 px-6 text-left">Allocation</th>
            <th className="py-3 px-6 text-left">Created At</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-white-600 text-sm font-light">
          {plans.map((plan) => (
            <tr key={plan.publicKey} className="border-b border-gray-200">
              <td className="py-3 px-6 text-left whitespace-nowrap">{plan.name}</td>
              <td className="py-3 px-6 text-left">{plan.beneficiary.toBase58()}</td>
              <td className="py-3 px-6 text-left">{plan.asset.pubkey.toBase58()}</td>
              <td className="py-3 px-6 text-left">{plan.allocation.toString()}</td>
              <td className="py-3 px-6 text-left">
                
              </td>
              <td className="py-3 px-6 text-left">
                <button 
                  onClick={() => onPlanDeleted(plan.publicKey)} 
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanList;
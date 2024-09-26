import React from 'react';
import { Plan } from '@/components/types/plan';
import { useTokenMetadata } from '@/components/hooks/useTokenMetadata';
import { useDeadMansSwitch } from '@/components/hooks/useDeadMansSwitch';
import { PublicKey } from '@solana/web3.js'; // Add this import



interface PlanListProps {
  plans: Plan[];
  onPlanDeleted: (publicKey: string) => void; 
}

const PlanList: React.FC<PlanListProps> = ({ plans, onPlanDeleted }) => {
  const { deletePlan } = useDeadMansSwitch(); // Get deletePlan from the hook

  const handleDelete = async (publicKey: string) => {
    try {
      await deletePlan(new PublicKey(publicKey)); // Convert the public key string to PublicKey
      onPlanDeleted(publicKey); // Notify parent component
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-dark text-gray-200 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Plan Name</th>
            <th className="py-3 px-6 text-left">Wallet Address</th>
            <th className="py-3 px-6 text-left">Assets</th>
            <th className="py-3 px-6 text-left">Value</th>
            <th className="py-3 px-6 text-left">Status</th>
          </tr>
        </thead>
        <tbody className="text-white-600 text-sm font-light">
          {plans.map((plan) => (
            <tr key={plan.publicKey} className="border-b border-gray-200">
              <td className="py-3 px-6 text-left whitespace-nowrap">{plan.name}</td>
              <td className="py-3 px-6 text-left">
                {plan.beneficiaries.map((beneficiary, index) => (
                  <div key={index}>{beneficiary.toString()}</div>
                ))}
              </td>              
              <td className="py-3 px-6 text-left"> {plan.assets.map((asset, index) => (
                  <div key={index}>
                    {asset.tokenName || 'Unknown Token'} ({asset.tokenType || 'UNK'})
                  </div>
                ))}
                </td>
              <td className="py-3 px-6 text-left">TBD</td>
              <td className="py-3 px-6 text-left">Active</td>
              <td className="py-3 px-6 text-left">
                <button 
                  onClick={() => handleDelete(plan.publicKey)} 
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
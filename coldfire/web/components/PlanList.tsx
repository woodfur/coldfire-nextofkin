import React from 'react';
import { Plan } from '@/components/types/plan';

interface PlanListProps {
  plans: Plan[];
}

const PlanList: React.FC<PlanListProps> = ({ plans }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-dark text-gray-200 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Plan Name</th>
            <th className="py-3 px-6 text-left">Beneficiaries</th>
            <th className="py-3 px-6 text-left">Assets</th>
            <th className="py-3 px-6 text-left">Value</th>
            <th className="py-3 px-6 text-left">Status</th>
          </tr>
        </thead>
        <tbody className="text-white-600 text-sm font-light">
          {plans.map((plan) => (
            <tr key={plan.publicKey} className="border-b border-gray-200">
              <td className="py-3 px-6 text-left whitespace-nowrap">{plan.name}</td>
              <td className="py-3 px-6 text-left">{plan.beneficiaries.length}</td>
              <td className="py-3 px-6 text-left">{plan.assets.length}</td>
              <td className="py-3 px-6 text-left">TBD</td>
              <td className="py-3 px-6 text-left">Active</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanList;
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGetTokenAccounts } from '@/components/account/account-data-access';
import { PublicKey } from '@solana/web3.js';
import { useDeadMansSwitch } from '@/components/hooks/useDeadMansSwitch';

interface CreatePlanFormProps {
  onSubmit: (planData: any) => void;
  onCancel: () => void;
}

const CreatePlanForm: React.FC<CreatePlanFormProps> = ({ onSubmit, onCancel }) => {
  const { publicKey } = useWallet();
  const { data: tokenAccounts } = useGetTokenAccounts({ address: publicKey as PublicKey });
  const { createPlan } = useDeadMansSwitch();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    planType: 'Inheritance',
    beneficiaries: [],
    assets: [],
    distributionRules: '',
    activationConditions: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAssets = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prevState => ({ ...prevState, assets: selectedAssets }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (publicKey) {
      try {
        const planPublicKey = await createPlan({
          ...formData,
          planType: formData.planType as "Inheritance" | "Emergency" | "Business",
          beneficiaries: formData.beneficiaries as string[],
          assets: formData.assets as string[]
        });
        onSubmit({ ...formData, planPublicKey: planPublicKey.toString() });
      } catch (error) {
        console.error('Error creating plan:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>
    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={3}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      ></textarea>
    </div>
    <div>
      <label htmlFor="planType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Plan Type</label>
      <select
        id="planType"
        name="planType"
        value={formData.planType}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="inheritance">Inheritance</option>
        <option value="emergency">Emergency</option>
        <option value="business">Business Continuity</option>
      </select>
    </div>
    <div>
      <label htmlFor="assets" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assets</label>
      <select
        id="assets"
        name="assets"
        multiple
        value={formData.assets}
        onChange={handleAssetChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        {tokenAccounts?.map((account) => (
          <option key={account.pubkey.toString()} value={account.pubkey.toString()}>
            {account.account.data.parsed.info.mint} - {account.account.data.parsed.info.tokenAmount.uiAmount}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label htmlFor="distributionRules" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Distribution Rules</label>
      <textarea
        id="distributionRules"
        name="distributionRules"
        value={formData.distributionRules}
        onChange={handleChange}
        rows={3}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      ></textarea>
    </div>
    <div>
      <label htmlFor="activationConditions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Activation Conditions</label>
      <textarea
        id="activationConditions"
        name="activationConditions"
        value={formData.activationConditions}
        onChange={handleChange}
        rows={3}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      ></textarea>
    </div>
    <div>
      <label htmlFor="switchDelay" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Switch Delay (days)</label>
      <input
        type="number"
        id="switchDelay"
        name="switchDelay"
        value={formData.switchDelay}
        onChange={handleChange}
        min="1"
        required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>
    <div className="flex justify-end space-x-2">
      <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
      <button type="submit" className="btn btn-primary">Create Plan</button>
    </div>
  </form>
  );

  // ... (keep the rest of the component's JSX)
};

export default CreatePlanForm;
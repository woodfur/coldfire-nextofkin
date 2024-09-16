import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGetTokenAccounts } from '@/components/account/account-data-access';
import { PublicKey } from '@solana/web3.js';

interface CreatePlanFormProps {
  onSubmit: (planData: any) => void;
  onCancel: () => void;
}

interface FormData {
    name: string;
    description: string;
    beneficiaries: { address: string; allocation: number }[];
    assets: string[];
    inactivityPeriod: number;
  }

const CreatePlanForm: React.FC<CreatePlanFormProps> = ({ onSubmit, onCancel }) => {
  const { publicKey } = useWallet();
  const { data: tokenAccounts } = useGetTokenAccounts({ address: publicKey as PublicKey });

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    beneficiaries: [{ address: '', allocation: 0 }],
    assets: [],
    inactivityPeriod: 30,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleBeneficiaryChange = (index: number, field: string, value: string) => {
    const newBeneficiaries = [...formData.beneficiaries];
    newBeneficiaries[index] = { ...newBeneficiaries[index], [field]: value };
    setFormData(prevState => ({ ...prevState, beneficiaries: newBeneficiaries }));
  };

  const addBeneficiary = () => {
    setFormData(prevState => ({
      ...prevState,
      beneficiaries: [...prevState.beneficiaries, { address: '', allocation: 0 }],
    }));
  };

  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAssets = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prevState => ({ ...prevState, assets: selectedAssets }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Plan Name</label>
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
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description/Note</label>
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Beneficiaries</label>
        {formData.beneficiaries.map((beneficiary, index) => (
          <div key={index} className="flex space-x-2 mt-2">
            <input
              type="text"
              placeholder="Wallet Address"
              value={beneficiary.address}
              onChange={(e) => handleBeneficiaryChange(index, 'address', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <input
              type="number"
              placeholder="Allocation %"
              value={beneficiary.allocation}
              onChange={(e) => handleBeneficiaryChange(index, 'allocation', e.target.value)}
              className="mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        ))}
        <button type="button" onClick={addBeneficiary} className="mt-2 btn btn-secondary">Add Beneficiary</button>
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
        <label htmlFor="inactivityPeriod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Inactivity Period (days)</label>
        <input
          type="number"
          id="inactivityPeriod"
          name="inactivityPeriod"
          value={formData.inactivityPeriod}
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
};

export default CreatePlanForm;
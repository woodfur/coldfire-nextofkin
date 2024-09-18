import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDeadMansSwitch } from '@/components/hooks/useDeadMansSwitch';
import { useGetTokenAccounts } from '@/components/account/account-data-access';
import { PublicKey } from '@solana/web3.js';
import { useBeneficiaries } from './hooks/useBeneficiaries';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated: () => void;
}

const CreatePlanModal: React.FC<CreatePlanModalProps> = ({ isOpen, onClose, onPlanCreated }) => {
  const { publicKey } = useWallet();
  const { createPlan } = useDeadMansSwitch();
  const { data: tokenAccounts } = useGetTokenAccounts({ address: publicKey as PublicKey });
  const { beneficiaries, loading, error } = useBeneficiaries(publicKey?.toBase58());

  

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedBeneficiaries: [] as string[],
    assets: [] as string[],
    inactivityPeriod: 30,
  });

 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBeneficiarySelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAddresses = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, selectedBeneficiaries: selectedAddresses }));
  };

  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAssets = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, assets: selectedAssets }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      alert('Please connect your wallet first.');
      return;
    }
    if (formData.selectedBeneficiaries.length === 0) {
      alert('Please select at least one beneficiary.');
      return;
    }
    
    try {
      console.log('Creating plan with data:', formData);
      const planPublicKey = await createPlan({
        name: formData.name,
        description: formData.description,
        planType: 'Inheritance',
        beneficiaries: formData.selectedBeneficiaries,
        assets: formData.assets,
        distributionRules: JSON.stringify(formData.selectedBeneficiaries.map(address => ({ address, allocation: 100 / formData.selectedBeneficiaries.length }))),
        activationConditions: `Inactivity period: ${formData.inactivityPeriod} days`,
      });
      console.log('Plan created successfully with public key:', planPublicKey.toString());
      onPlanCreated();
      onClose();
    } catch (error) {
      console.error('Error creating plan:', error);
      if (error instanceof Error) {
        alert(`Failed to create plan: ${error.message}`);
      } else {
        alert('Failed to create plan. Please try again.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-gray-dark dark:bg-boxdark rounded-lg shadow-lg max-w-2xl w-full">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">Create New Inheritance Plan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">Plan Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              rows={3}
            />
          </div>
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">Assets</label>
            <select
              multiple
              name="assets"
              value={formData.assets}
              onChange={handleAssetChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              {tokenAccounts?.map((account) => (
                <option key={account.pubkey.toString()} value={account.pubkey.toString()}>
                  {account.account.data.parsed.info.mint} - Balance: {account.account.data.parsed.info.tokenAmount.uiAmount}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">Beneficiaries</label>
            {loading ? (
                <p className="text-gray-500 dark:text-gray-400">Loading beneficiaries...</p>
              ) : error ? (
                <p className="text-red-500">Error loading beneficiaries: {error.message}</p>
              ) : beneficiaries.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No beneficiaries found.</p>
              ) : (
                <select
                  multiple
                  name="beneficiaries"
                  value={formData.selectedBeneficiaries}
                  onChange={handleBeneficiarySelection}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  {beneficiaries.map((beneficiary) => (
                    <option key={beneficiary.id} value={beneficiary.walletAddress}>
                      {beneficiary.name} ({beneficiary.walletAddress})
                    </option>
                  ))}
                </select>
              )}
          </div>
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">Inactivity Period (days)</label>
            <input
              type="number"
              name="inactivityPeriod"
              value={formData.inactivityPeriod}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button 
  type="submit" 
  className="btn btn-primary text-white"
  disabled={loading || beneficiaries.length === 0 || formData.selectedBeneficiaries.length === 0}
>
  Create Plan
</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default CreatePlanModal;
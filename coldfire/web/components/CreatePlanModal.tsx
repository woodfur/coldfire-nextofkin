import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDeadMansSwitch } from '@/components/hooks/useDeadMansSwitch';
import { useGetTokenAccounts } from '@/components/account/account-data-access';
import { PublicKey } from '@solana/web3.js';
import { useBeneficiaries } from './hooks/useBeneficiaries';
import { BN } from '@coral-xyz/anchor';

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
    selectedBeneficiary: null as PublicKey | null,
    allocation: 0,
    selectedAsset: '' as string,
    inactivityPeriod: 30,
  });

  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    if (tokenAccounts && formData.selectedAsset) {
      const selectedAccount = tokenAccounts.find(account => account.pubkey.toString() === formData.selectedAsset);
      if (selectedAccount) {
        setTotalBalance(selectedAccount.account.data.parsed.info.tokenAmount.uiAmount);
      }
    }
  }, [tokenAccounts, formData.selectedAsset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBeneficiarySelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAddress = e.target.value;
    setFormData(prev => ({ ...prev, selectedBeneficiary: selectedAddress ? new PublicKey(selectedAddress) : null }));
  };

  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAsset = e.target.value;
    setFormData(prev => ({ ...prev, selectedAsset }));
  };

  const handleAllocationChange = (value: number) => {
    const newAllocation = Math.max(0, value);
    if (newAllocation > totalBalance) {
      alert(`Cannot allocate more than your total balance of ${totalBalance} for the selected asset.`);
      return;
    }
    setFormData(prev => ({ ...prev, allocation: newAllocation }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      alert('Please connect your wallet first.');
      return;
    }

    if (!formData.name.trim() || !formData.description.trim() || !formData.selectedBeneficiary || !formData.selectedAsset) {
      alert('Please fill in all required fields.');
      return;
    }
    
    try {
      console.log('Creating plan with data:', formData);

      const planPublicKey = await createPlan({
        name: formData.name,
        description: formData.description,
        planType: {inheritance: {}},
        beneficiary: formData.selectedBeneficiary,
        asset: new PublicKey(formData.selectedAsset),
        allocation: new BN(formData.allocation),
        inactivityPeriod: new BN(formData.inactivityPeriod * 24 * 60 * 60), // Convert days to seconds
      });

      console.log('Plan created successfully with public key:', planPublicKey.toString());

      setFormData({
        name: '',
        description: '',
        selectedBeneficiary: null,
        allocation: 0,
        selectedAsset: '',
        inactivityPeriod: 30,
      });

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
                placeholder="Give it a name"
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
                placeholder='Write a passionate note about the plan'
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                rows={3}
              />
            </div>
            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">Assets</label>
              <select
                name="selectedAsset"
                value={formData.selectedAsset}
                onChange={handleAssetChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Select an asset</option>
                {tokenAccounts?.map((account) => (
                  <option key={account.pubkey.toString()} value={account.pubkey.toString()}>
                    {account.account.data.parsed.info.mint} - Balance: {account.account.data.parsed.info.tokenAmount.uiAmount}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">Beneficiary</label>
              {loading ? (
                <p className="text-gray-500 dark:text-gray-400">Loading beneficiaries...</p>
              ) : error ? (
                <p className="text-red-500">Error loading beneficiaries: {error.message}</p>
              ) : beneficiaries.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No beneficiaries found.</p>
              ) : (
                <select 
                  onChange={handleBeneficiarySelection} 
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value="">Select a beneficiary</option>
                  {beneficiaries.map((beneficiary) => (
                    <option key={beneficiary.id} value={beneficiary.walletAddress}>
                      {beneficiary.name} ({beneficiary.walletAddress})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">Allocation</label>
              <input
                type="number"
                min="0"
                placeholder="Amount"
                value={formData.allocation}
                onChange={(e) => handleAllocationChange(Number(e.target.value))}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">Inactivity Period (days)</label>
              <input
                type="number"
                name="inactivityPeriod"
                value={formData.inactivityPeriod}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary appearance-none"
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
                disabled={loading || beneficiaries.length === 0}
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
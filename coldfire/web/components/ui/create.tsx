import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDeadMansSwitch } from '@/components/hooks/useDeadMansSwitch';
import { useGetTokenAccounts } from '@/components/account/account-data-access';
import { PublicKey } from '@solana/web3.js';
import { useBeneficiaries } from '../hooks/useBeneficiaries';
import { BN } from '@coral-xyz/anchor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBeneficiarySelection = (value: string) => {
    setFormData(prev => ({ ...prev, selectedBeneficiary: value ? new PublicKey(value) : null }));
  };

  const handleAssetChange = (value: string) => {
    setFormData(prev => ({ ...prev, selectedAsset: value }));
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Inheritance Plan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Give it a name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Write a passionate note about the plan"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="selectedAsset">Assets</Label>
            <Select onValueChange={handleAssetChange} value={formData.selectedAsset}>
              <SelectTrigger>
                <SelectValue placeholder="Select an asset" />
              </SelectTrigger>
              <SelectContent>
                {tokenAccounts?.map((account) => (
                  <SelectItem key={account.pubkey.toString()} value={account.pubkey.toString()}>
                    {account.account.data.parsed.info.mint} - Balance: {account.account.data.parsed.info.tokenAmount.uiAmount}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="selectedBeneficiary">Beneficiary</Label>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading beneficiaries...</p>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Error loading beneficiaries: {error.message}</AlertDescription>
              </Alert>
            ) : beneficiaries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No beneficiaries found.</p>
            ) : (
              <Select onValueChange={handleBeneficiarySelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a beneficiary" />
                </SelectTrigger>
                <SelectContent>
                  {beneficiaries.map((beneficiary) => (
                    <SelectItem key={beneficiary.id} value={beneficiary.walletAddress}>
                      {beneficiary.name} ({beneficiary.walletAddress})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="allocation">Allocation</Label>
            <Input
              id="allocation"
              type="number"
              min="0"
              placeholder="Amount"
              value={formData.allocation}
              onChange={(e) => handleAllocationChange(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inactivityPeriod">Inactivity Period (days)</Label>
            <Input
              id="inactivityPeriod"
              name="inactivityPeriod"
              type="number"
              value={formData.inactivityPeriod}
              onChange={handleChange}
              required
            />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={loading || beneficiaries.length === 0}
          >
            Create Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlanModal;
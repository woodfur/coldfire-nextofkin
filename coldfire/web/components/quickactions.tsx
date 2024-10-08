'use client'
import React from 'react'
import { UserPlusIcon, ClockIcon } from 'lucide-react'


import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '@/components/solana/solana-provider';

import { useDeadMansSwitch } from '@/components/hooks/useDeadMansSwitch';
import CreatePlanModal from './ui/create'
import { Plan } from '@/components/types/plan';
import PlanList from './planlist_'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { addBeneficiary, getBeneficiaries } from './../beneficiary-operations';
import { useBeneficiaries } from '@/components/hooks/useBeneficiaries';


import { useGetTokenAccounts } from '@/components/account/account-data-access';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';


interface Beneficiary {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
}

export default function QuickActions() {

  const [beneficiaryModalOpen, setBeneficiaryModalOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [open, setOpen] = useState(false);

      const { publicKey } = useWallet();
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [walletAddress, setWalletAddress] = useState('');
      

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



      const BeneficiaryhandleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!publicKey) {
          alert('Please connect your wallet first.');
          return;
        }
        setIsLoading(true);
        try {
          await addBeneficiary(publicKey.toString(), { name, email, walletAddress });
          setOpen(false);
          setName('');
          setEmail('');
          setWalletAddress('');
          setShowSuccessPopup(true);
          setTimeout(() => setShowSuccessPopup(false), 3000); 
        } catch (error) {
          console.error('Error adding beneficiary:', error);
          alert('Failed to add beneficiary. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };



      
  

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

      setPlanModalOpen(false)
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
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Dialog open={beneficiaryModalOpen} onOpenChange={setBeneficiaryModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full"><UserPlusIcon className="mr-2 h-4 w-4" /> Add Beneficiary</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Beneficiary</DialogTitle>
              <DialogDescription>Add a new beneficiary to your plan. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <form onSubmit={BeneficiaryhandleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <Input
                  id="walletAddress"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setBeneficiaryModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Beneficiary'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={planModalOpen} onOpenChange={setPlanModalOpen}>
        <DialogTrigger asChild>
            <Button className="w-full"><PlusIcon className="mr-2 h-4 w-4" /> Create New Plan</Button>
          </DialogTrigger>
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
          <Button variant="outline" onClick={() => setPlanModalOpen(false)}>
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
      </CardContent>
    </Card>
  )
}
'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from 'lucide-react'

import Image from "next/image";
import { Product } from "@/components/types/product";
import { Chat } from "@/components/types/chat";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from '@solana/wallet-adapter-react';
import { addBeneficiary, getBeneficiaries } from './../beneficiary-operations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,  DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";


interface Beneficiary {
    id: string;
    name: string;
    email: string;
    walletAddress: string;
  }

export default function Beneficiaries() {
 
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
      const { publicKey } = useWallet();
      const [showModal, setShowModal] = useState(false);
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [walletAddress, setWalletAddress] = useState('');
      const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
      const [open, setOpen] = useState(false)

      useEffect(() => {
        if (publicKey) {
          fetchBeneficiaries();
        } else {
          setBeneficiaries([]);
        }
      }, [publicKey]);
    
      const fetchBeneficiaries = async () => {
        if (publicKey) {
          const fetchedBeneficiaries = await getBeneficiaries(publicKey.toString());
          setBeneficiaries(fetchedBeneficiaries as Beneficiary[]);
        }
      };

      const handleSubmit = async (e: React.FormEvent) => {
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
    
      const handleAddBeneficiary = () => {
        if (!publicKey) {
          alert('Please connect your wallet first.');
        } else {
          setShowModal(true);
        }
      };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Beneficiaries</CardTitle>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-2">
          {beneficiaries.map((beneficiary, index) => (
            <li key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span>{beneficiary.name}</span>
              <span className="text-sm text-muted-foreground">{beneficiary.walletAddress}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
      { publicKey ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><PlusIcon className="mr-2 h-4 w-4" /> Add Beneficiary</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Beneficiary</DialogTitle>
              <DialogDescription>Add a new beneficiary to your plan. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Beneficiary'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      ) : (
          <p className="text-sm text-muted-foreground">Connect your wallet to add beneficiaries</p>
        )}
      </CardFooter>

      {showSuccessPopup && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50">
          Beneficiary added successfully!
        </div>
      )}

      
    </Card>
  )
}
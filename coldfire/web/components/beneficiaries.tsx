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
          setBeneficiaries(fetchedBeneficiaries);
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
          setShowModal(false);
          setName('');
          setEmail('');
          setWalletAddress('');
          setShowSuccessPopup(true);
          setTimeout(() => setShowSuccessPopup(false), 3000); // Hide popup after 3 seconds
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
        <Button onClick={handleAddBeneficiary}><PlusIcon className="mr-2 h-4 w-4" /> Add Beneficiary</Button>
      </CardFooter>
    </Card>
  )
}
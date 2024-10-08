'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from 'lucide-react'

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '@/components/solana/solana-provider';
import { useDeadMansSwitch } from '@/components/hooks/useDeadMansSwitch';

import CreatePlanModal from './ui/create'


import { Plan } from '@/components/types/plan';

import PlanList from './planlist_'



export default function InheritancePlans() {
  
    const { publicKey } = useWallet();
 const { getPlans } = useDeadMansSwitch();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey) {
      fetchPlans();
    } else {
      setPlans([]);
    }
  }, [publicKey]);

  const fetchPlans = async () => {
    if (publicKey) {
      setLoading(true);
      setError(null);
      try {
        const fetchedPlans = await getPlans();
        setPlans(fetchedPlans);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to fetch plans. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePlanCreated = () => {
    fetchPlans();
  };


  const handlePlanDeleted = (publicKey: string) => {
    setPlans((prevPlans) => prevPlans.filter(plan => plan.publicKey !== publicKey));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Inheritance Plans</CardTitle>
      </CardHeader>
      <CardContent>
      <PlanList plans={plans} onPlanDeleted={handlePlanDeleted} />
      </CardContent>
      <CardFooter>
      {publicKey ? (
        <>
        
      <Button onClick={openModal}><PlusIcon className="mr-2 h-4 w-4" /> Create New Plan</Button>
      <CreatePlanModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onPlanCreated={handlePlanCreated}
            />

        </>  
    ) : (
        <p className="text-sm text-muted-foreground">Connect your wallet to create and manage inheritance plans</p>
      )}
      </CardFooter>
    </Card>
  )
}
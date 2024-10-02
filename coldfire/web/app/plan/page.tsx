'use client'
import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '@/components/solana/solana-provider';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useDeadMansSwitch } from '@/components/hooks/useDeadMansSwitch';
import CreatePlanModal from '@/components/CreatePlanModal';


import { Plan } from '@/components/types/plan';
import PlanList from '@/components/PlanList';

const ViewPlans: React.FC = () => {
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

  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="View Plans" />
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
        <h2 className="mb-5 text-2xl font-bold text-dark dark:text-white"></h2>
        {!publicKey ? (
          <div className="text-center py-10">
            <p className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-4">
              Connect your wallet to view and create plans
            </p>
            
          </div>
        ) : (
          <>
           <PlanList plans={plans} onPlanDeleted={handlePlanDeleted} />
           <button
              onClick={() => setIsModalOpen(true)}
              className="ml-5 mt-4 btn btn-primary text-white"
            >
              Add Plan
            </button>
            <CreatePlanModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onPlanCreated={handlePlanCreated}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ViewPlans;
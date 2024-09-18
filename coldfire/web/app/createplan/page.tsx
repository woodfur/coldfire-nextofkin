'use client'
import React, { useState, useEffect } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '@/components/solana/solana-provider';
import CreatePlanForm from '@/components/CreatePlanForm';
// import { useDeadMansSwitch } from '@/components/hooks/useDeadMansSwitch';

const CreatePlan: React.FC = () => {

  // const { publicKey } = useWallet();
  // const [showForm, setShowForm] = useState(false);
  // const { createPlan } = useDeadMansSwitch();

  // const handleCreatePlan = async (planData: { name: string; description: string; planType: "Inheritance" | "Emergency" | "Business"; beneficiaries: string[]; assets: string[]; distributionRules: string; activationConditions: string; }) => {
  //   if (publicKey) {
  //     try {
  //       const planPublicKey = await createPlan(planData);
  //       console.log('Plan created with public key:', planPublicKey.toString());
  //       setShowForm(false);
  //       // You might want to add some success message or redirect the user
  //     } catch (error) {
  //       console.error('Error creating plan:', error);
  //       // Handle error (e.g., show error message to user)
  //     }
  //   }
  // };

  return (
    <div className="mx-auto w-full max-w-[970px]">
    <Breadcrumb pageName="Create Plan" />
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
      <h2 className="mb-5 text-2xl font-bold text-dark dark:text-white">Create Your Plan</h2>
      {!publicKey ? (
        <div className="text-center py-10">
          <p className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-4">
            Connect your wallet to create a plan
          </p>
          <WalletButton />
        </div>
      ) : (
        <>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Create New Plan
            </button>
          )}
          {showForm && (
            <CreatePlanForm onSubmit={handleCreatePlan} onCancel={() => setShowForm(false)} />
          )}
        </>
      )}
    </div>
  </div>
  );
};

export default CreatePlan;

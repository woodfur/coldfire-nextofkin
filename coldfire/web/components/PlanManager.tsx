import React, { useEffect, useState } from 'react';
import { useDeadMansSwitch } from '@/components/hooks/useDeadMansSwitch';
import PlanList from './PlanList';
import { Plan } from '@/components/types/plan';
import { PublicKey } from '@solana/web3.js';

const PlanManager: React.FC = () => {
  const { getPlans } = useDeadMansSwitch();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      console.log('Fetching plans...');
      const fetchedPlans = await getPlans();
      console.log('Fetched plans:', fetchedPlans);
      setPlans(fetchedPlans);
      setError(null);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Failed to fetch plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanDeleted = (publicKey: string) => {
  
  };

  if (loading) return <div>Loading plans...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log('Rendering PlanList with plans:', plans);

  return <PlanList plans={plans} onPlanDeleted={handlePlanDeleted} />;
};

export default PlanManager;
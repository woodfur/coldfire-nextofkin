import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase-config';

interface Beneficiary {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  walletPublicKey: string;
}

function isBeneficiary(data: any): data is Beneficiary {
  return (
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.email === 'string' &&
    typeof data.walletAddress === 'string' &&
    typeof data.walletPublicKey === 'string'
  );
}

export function useBeneficiaries(walletPublicKey: string | undefined) {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;

    if (walletPublicKey) {
      const beneficiariesRef = collection(db, 'beneficiaries');
      const q = query(beneficiariesRef, where('walletPublicKey', '==', walletPublicKey));

      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedBeneficiaries: Beneficiary[] = [];
        querySnapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() };
          if (isBeneficiary(data)) {
            fetchedBeneficiaries.push(data);
          } else {
            console.warn(`Invalid beneficiary data for document ${doc.id}`, data);
          }
        });
        setBeneficiaries(fetchedBeneficiaries);
        setLoading(false);
      }, (error) => {
        setError(error instanceof Error ? error : new Error('An unknown error occurred'));
        setLoading(false);
      });
    } else {
      setBeneficiaries([]);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [walletPublicKey]);

  return { beneficiaries, loading, error };
}
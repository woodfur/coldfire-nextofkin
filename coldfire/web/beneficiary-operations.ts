import { db } from './firebase-config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export async function addBeneficiary(publicKey: string, beneficiaryData: any) {
  try {
    await addDoc(collection(db, 'beneficiaries'), {
      ...beneficiaryData,
      walletPublicKey: publicKey,
    });
  } catch (error) {
    console.error('Error adding beneficiary: ', error);
  }
}

export async function getBeneficiaries(publicKey: string) {
  const beneficiaries: { id: string; }[] = [];
  const q = query(collection(db, 'beneficiaries'), where('walletPublicKey', '==', publicKey));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    beneficiaries.push({ id: doc.id, ...doc.data() });
  });
  return beneficiaries;
}
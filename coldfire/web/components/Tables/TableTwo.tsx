'use client'
import Image from "next/image";
import { Product } from "@/components/types/product";
import { Chat } from "@/components/types/chat";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { addBeneficiary, getBeneficiaries } from '../../beneficiary-operations';

const chatData: Chat[] = [
  {
    active: true,
    avatar: "/images/user/user-01.png",
    name: "Devid Heilo",
    text: "Hello, how are you?",
    time: "12 min",
    textCount: 3,
    dot: 3,
  },
  {
    active: true,
    avatar: "/images/user/user-02.png",
    name: "Henry Fisher",
    text: "I am waiting for you",
    time: "5:54 PM",
    textCount: 0,
    dot: 1,
  },
  {
    active: null,
    avatar: "/images/user/user-04.png",
    name: "Wilium Smith",
    text: "Where are you now?",
    time: "10:12 PM",
    textCount: 0,
    dot: 3,
  },
  {
    active: true,
    seen: true,
    avatar: "/images/user/user-05.png",
    name: "Henry Deco",
    text: "Thank you so much!",
    time: "Sun",
    textCount: 2,
    dot: 6,
  },
  {
    active: false,
    avatar: "/images/user/user-06.png",
    name: "Jubin Jack",
    text: "Hello, how are you?",
    time: "Oct 23",
    textCount: 0,
    dot: 3,
  },
];

interface Beneficiary {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
}

const TableTwo = () => {
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

    <div>

      
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      

      <div className="rounded-[10px] grid grid-cols-6 border-t px-4 py-4.5 dark:border-dark-3 sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <p className="font-medium">Name</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Email</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Wallet Address</p>
        </div>
       
       
      </div>


      {!publicKey ? (
    <div className="text-center py-10">
      <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
        Connect your wallet to view/add beneficiaries
      </p>
    </div>
  ) : beneficiaries.length === 0 ? (
    <div className="text-center py-10">
      <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
        No beneficiaries added yet
      </p>
    </div>
  ) : (
    beneficiaries.map((beneficiary, key) => (
      <div
        className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-dark-3 sm:grid-cols-8 md:px-6 2xl:px-.5"
        key={key}
      >
        <div className="col-span-3 flex items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="h-12.5 w-15 rounded-md mt-2 mb-2">
              <Image
                src="/images/person.png"
                width={60}
                height={50}
                alt="Beneficiary"
              />
            </div>
            <p className="text-body-sm font-medium text-dark dark:text-dark-6">
              {beneficiary.name}
            </p>
          </div>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="text-body-sm font-medium text-dark dark:text-dark-6">
            {beneficiary.email}
          </p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-body-sm font-medium text-dark dark:text-dark-6">
            {beneficiary.walletAddress}
          </p>
        </div>
      </div>
    ))
  )}

            
    
    </div>

    <div className="flex justify-center mt-6">
    <button 
          className="rounded-[5px] px-10 py-3.5 bg-dark text-white font-medium rounded-full hover:bg-blue-600 transition-colors duration-300"
          onClick={handleAddBeneficiary}
        >
          Add Beneficiary
        </button>
    </div>


    {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-dark p-8 rounded-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-white">Add Beneficiary</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-300">Wallet Address</label>
          <input
            type="text"
            id="walletAddress"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            required
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-300 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Add Beneficiary'
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{showSuccessPopup && (
  <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50">
    Beneficiary added successfully!
  </div>
)}
    </div>

  );

  
};

export default TableTwo;

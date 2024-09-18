import Link from "next/link";
import Image from "next/image";
import { Chat } from "@/components/types/chat";

import { useWallet } from "@solana/wallet-adapter-react";
import { getBeneficiaries } from "@/beneficiary-operations";
import { useEffect, useState } from "react";

const ChatCard = () => {

  const { publicKey } = useWallet();
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


  return (
    <div className="col-span-12 rounded-[10px] bg-white py-6 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-4">
      <h4 className="mb-5.5 px-7.5 text-body-2xlg font-bold text-dark dark:text-white">
        Beneficiaries
      </h4>

      <div>
      {!publicKey ? (
    <div className="text-center py-10">
      <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
        Connect your wallet to view beneficiaries
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
        className="grid grid-cols-2 border-t border-stroke px-2 py-4.5 dark:border-dark-3 sm:grid-cols-4 md:px-6 2xl:px-.5 hover:bg-gray-1 dark:hover:bg-dark-2"
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
      
        
      </div>
    ))
  )}
      </div>
    </div>
  );
};

export default ChatCard;

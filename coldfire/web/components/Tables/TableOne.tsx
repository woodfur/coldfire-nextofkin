import { BRAND } from "@/components/types/brand";
import Image from "next/image";


import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { IconRefresh } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ExplorerLink } from '../cluster/cluster-ui';
import { useGetBalance, useGetTokenAccounts } from '../account/account-data-access';
import { ellipsify } from '../ui/ui-layout';



const brandData: BRAND[] = [
  {
    logo: "/images/brand/brand-01.svg",
    name: "Google",
    visitors: 3.5,
    revenues: "5,768",
    sales: 590,
    conversion: 4.8,
  },
  {
    logo: "/images/brand/brand-02.svg",
    name: "X.com",
    visitors: 2.2,
    revenues: "4,635",
    sales: 467,
    conversion: 4.3,
  },
  {
    logo: "/images/brand/brand-03.svg",
    name: "Github",
    visitors: 2.1,
    revenues: "4,290",
    sales: 420,
    conversion: 3.7,
  },
  {
    logo: "/images/brand/brand-04.svg",
    name: "Vimeo",
    visitors: 1.5,
    revenues: "3,580",
    sales: 389,
    conversion: 2.5,
  },
  {
    logo: "/images/brand/brand-05.svg",
    name: "Facebook",
    visitors: 1.2,
    revenues: "2,740",
    sales: 230,
    conversion: 1.9,
  },
];

const TableOne = () => {

  const { publicKey } = useWallet();
  const [showAll, setShowAll] = useState(false);
  const query = useGetTokenAccounts({ address: publicKey as PublicKey });
  const balanceQuery = useGetBalance({ address: publicKey as PublicKey });
  const client = useQueryClient();

  const items = useMemo(() => {
    if (showAll) return query.data;
    return query.data?.slice(0, 5);
  }, [query.data, showAll]);
  
  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
        Assets
      </h4>

      <div className="flex flex-col">


        <div className="grid grid-cols-3 sm:grid-cols-4">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Name
            </h5>
          </div>

          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Amount
            </h5>
          </div>

          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Value(USD)
            </h5>
          </div>

          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              1h%
            </h5>
          </div>
         
        </div>


        {items?.map(({ account, pubkey }, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-4 ${
              key === (items.length || 0) - 1
                ? ""
                : "border-b border-stroke dark:border-dark-3"
            }`}
            key={pubkey.toString()}
          >
            <div className="flex items-center gap-3.5 px-2 py-4">
              <div className="flex-shrink-0">
                <Image src="/images/placeholder-token.svg" alt="Token" width={48} height={48} />
              </div>
              {/* <p className="hidden font-medium text-dark dark:text-white sm:block">
                {ellipsify(account.data.parsed.info.mint)}
              </p> */}
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {account.data.parsed.info.tokenAmount.uiAmount}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-green-light-1">
                $0.00
              </p>
            </div>

            <div className="hidden items-center justify-center px-2 py-4 sm:flex">
              {/* <p className="font-medium text-dark dark:text-white">
                <ExplorerLink
                  label={ellipsify(pubkey.toString())}
                  path={`account/${pubkey.toString()}`}
                />
              </p> */}
            </div>
          </div>
        ))}

{(query.data?.length ?? 0) > 5 && (
          <div className="text-center mt-4">
            <button
              className="btn btn-xs btn-outline"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : 'Show All'}
            </button>
          </div>
        )}


      </div>


    </div>
  );
};

export default TableOne;

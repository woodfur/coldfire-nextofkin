'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletIcon } from 'lucide-react'


import Link from "next/link";
import Image from "next/image";
import { WalletButton } from './solana/solana-provider';
import { ReactNode, Suspense, useEffect, useRef } from 'react';


import { usePathname } from 'next/navigation';

import { AccountChecker } from './account/account-ui';
import {
  ClusterChecker,
  ClusterUiSelect,
  ExplorerLink,
} from './cluster/cluster-ui';
import toast, { Toaster } from 'react-hot-toast';






import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { IconRefresh } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useGetBalance, useGetTokenAccounts } from './account/account-data-access';
import { ellipsify } from './ui/ui-layout';
import axios from 'axios';

export default function ConnectWallet() {




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
    <Card>
      <CardHeader>
        <CardTitle>Your Assets</CardTitle>
        
      </CardHeader>
      <CardContent>

      <ul className="flex items-center gap-2 2xsm:gap-4">
        
        <WalletButton />
          
        </ul>


        <ul>
        {items?.map(({ account, pubkey }, key) => (
          <li
            className={`flex justify-between items-center py-2 border-b last:border-b-0 ${
              key === (items.length || 0) - 1
                
            }`}
            key={pubkey.toString()}
          >
            <span>
            {ellipsify(account.data.parsed.info.mint)}
            </span>
            <span>
            {account.data.parsed.info.tokenAmount.uiAmount}
            </span>
           
            
          </li>
        ))}
        </ul>

       

       
      </CardContent>
    </Card>
  )
}
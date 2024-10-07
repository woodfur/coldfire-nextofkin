'use client';

import { WalletButton } from '../solana/solana-provider';
import * as React from 'react';
import { ReactNode, Suspense, useEffect, useRef } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AccountChecker } from '../account/account-ui';
import {
  ClusterChecker,
  ClusterUiSelect,
  ExplorerLink,
} from '../cluster/cluster-ui';
import toast, { Toaster } from 'react-hot-toast';

import  Sidebar  from '@/components/Sidebar';
import  Header  from '@/components/Header';
import { useState } from 'react';


//New UI imports 



import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ConnectWallet from '../../components/connectwallet'
import QuickActions from '../../components/quickactions'
import Beneficiaries from '../../components/beneficiaries'
import InheritancePlans from '../../components/inheritanceplans'





export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="container mx-auto p-4">



<>
<h1 className="text-2xl font-bold mb-4">Inheritance Plan Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 md:col-span-2">
          <ConnectWallet />
        </div>
        <div className="col-span-1">
          <QuickActions />
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Manage Your Inheritance Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="beneficiaries">
            <TabsList className="mb-4">
              <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
              <TabsTrigger value="plans">Inheritance Plans</TabsTrigger>
            </TabsList>
            <TabsContent value="beneficiaries">
              <Beneficiaries />
            </TabsContent>
            <TabsContent value="plans">
              <InheritancePlans />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>


    
    </div>
  );
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show, dialogRef]);

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button
                className="btn btn-xs lg:btn-md btn-primary"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? (
            <h1 className="text-5xl font-bold">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === 'string' ? (
            <p className="py-6">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return (
      str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
    );
  }
  return str;
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={'text-center'}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label={'View Transaction'}
          className="btn btn-xs btn-primary"
        />
      </div>
    );
  };
}

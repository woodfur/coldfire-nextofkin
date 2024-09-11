'use client';

import { AppHero } from '../ui/ui-layout';
import DataStatsOne from '../DataStats/DataStatsOne';
import ChartOne from '../Charts/ChartOne';
import ChartTwo from '../Charts/ChartTwo';
import ChartThree from '../Charts/ChartThree';

const links: { label: string; href: string }[] = [
  { label: 'Solana Docs', href: 'https://docs.solana.com/' },
  { label: 'Solana Faucet', href: 'https://faucet.solana.com/' },
  { label: 'Solana Cookbook', href: 'https://solanacookbook.com/' },
  { label: 'Solana Stack Overflow', href: 'https://solana.stackexchange.com/' },
  {
    label: 'Solana Developers GitHub',
    href: 'https://github.com/solana-developers/',
  },
];

export default function DashboardFeature() {
  return (
    <>
    <DataStatsOne />

    <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
       
        <ChartThree />
      <div className="col-span-12 xl:col-span-8">
        
      </div>
      
    </div>
  </>
  );
}

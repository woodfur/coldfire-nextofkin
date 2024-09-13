import React from 'react';

interface WalletOverviewProps {
  totalBalance: string;
  lastUpdated: string;
  numberOfAssets: string;
}

const WalletOverview: React.FC<WalletOverviewProps> = ({ totalBalance, lastUpdated, numberOfAssets }) => {
  return (
    <section className="flex flex-col grow shrink px-3 py-5 bg-white rounded-lg shadow-sm min-w-[240px] text-zinc-800 w-[304px]">
      <h2 className="flex-1 shrink self-stretch px-2 py-4 w-full text-lg font-bold">
        Wallet Overview
      </h2>
      <div className="flex gap-10 justify-between items-center mt-11 w-full max-md:mt-10">
        <div className="flex flex-col justify-center self-stretch px-2 my-auto">
          <div className="gap-1 self-stretch text-base">Total Balance</div>
          <div className="gap-1 self-start mt-2 text-lg font-medium whitespace-nowrap">
            {totalBalance}
          </div>
        </div>
        <div className="flex flex-col justify-center self-stretch px-2 my-auto w-[178px]">
          <div className="gap-1 self-stretch w-full text-base">Last Updated</div>
          <div className="gap-1 self-stretch mt-2 text-lg font-medium">
            {lastUpdated}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-start px-2 mt-11 w-full max-md:mt-10">
        <div className="gap-1 self-stretch text-base">Number of Asset</div>
        <div className="gap-1 self-stretch mt-2 text-lg font-medium whitespace-nowrap">
          {numberOfAssets}
        </div>
      </div>
    </section>
  );
};

export default WalletOverview;
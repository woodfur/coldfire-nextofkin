import React from 'react';
import { Plan } from '@/components/types/plan';
import { PublicKey } from '@solana/web3.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { TrashIcon } from 'lucide-react'
import { ellipsify } from './ui/ui-layout';

interface PlanListProps {
  plans: Plan[];
  onPlanDeleted: (publicKey: string) => void;
}

const PlanList: React.FC<PlanListProps> = ({ plans, onPlanDeleted }) => {
  // if (plans.length === 0) {
  //   return (
  //     <div className="text-center py-4">
  //       <p className="text-xl font-medium text-muted-foreground mb-4">
  //         No plans yet. Click connect wallet and click "Add Plan" to create one.
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Plan Name</TableHead>
          <TableHead>Beneficiary</TableHead>
          <TableHead>Asset</TableHead>
          <TableHead>Allocation</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans.map((plan) => (
          <TableRow key={plan.publicKey}>
            <TableCell>{plan.name}</TableCell>
            <TableCell>{plan.beneficiary.toBase58()}</TableCell>
            <TableCell>{ellipsify(plan.asset.pubkey.toBase58())}</TableCell>
            <TableCell>{plan.allocation.toString()}</TableCell>
            <TableCell>{/* Add created at date if available */}</TableCell>
            <TableCell>
              <Button 
                size="sm"
                onClick={() => onPlanDeleted(plan.publicKey)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PlanList;
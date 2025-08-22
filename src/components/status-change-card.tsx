'use client';

import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { ProblemStatus, StatusChange } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, Ban, Hourglass, ShieldQuestion, ArrowRightCircle } from 'lucide-react';

const statusInfo: Record<ProblemStatus, { icon: React.ElementType; text: string; className: string }> = {
  'Unsolved': { icon: Clock, text: 'Complaint Submitted', className: 'text-slate-600' },
  'Approved and Under Investigation': { icon: ArrowRightCircle, text: 'Status changed to Under Investigation', className: 'text-blue-600' },
  'Pending Verification': { icon: ShieldQuestion, text: 'Status changed to Pending Verification', className: 'text-yellow-700' },
  'Solved': { icon: CheckCircle, text: 'Complaint Resolved', className: 'text-green-600' },
  'Rejected': { icon: Ban, text: 'Complaint Rejected', className: 'text-red-600' },
};

interface StatusChangeCardProps {
  statusChange: StatusChange;
}

export function StatusChangeCard({ statusChange }: StatusChangeCardProps) {
  const info = statusInfo[statusChange.status];
  const Icon = info.icon;

  return (
    <div className="flex items-center gap-4 my-4">
      <div className="flex-shrink-0">
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-full bg-muted", info.className)}>
            <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="flex-1">
        <p className={cn("text-sm font-semibold", info.className)}>{info.text}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(statusChange.timestamp), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}

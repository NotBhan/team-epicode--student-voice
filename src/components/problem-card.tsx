'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flame, MessageSquare, User, CornerDownLeft, ShieldQuestion } from 'lucide-react';
import type { Problem, ProblemStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusStyles: Record<ProblemStatus, { badge: string; text: string, bg: string }> = {
  'Unsolved': { badge: 'bg-slate-200 text-slate-700', text: 'text-slate-600', bg: 'bg-slate-50' },
  'Approved and Under Investigation': { badge: 'bg-blue-100 text-blue-700', text: 'text-blue-600', bg: 'bg-blue-50' },
  'Solved': { badge: 'bg-green-100 text-green-700', text: 'text-green-600', bg: 'bg-green-50' },
  'Rejected': { badge: 'bg-red-100 text-red-700', text: 'text-red-600', bg: 'bg-red-50' },
  'Pending Verification': { badge: 'bg-yellow-100 text-yellow-800', text: 'text-yellow-700', bg: 'bg-yellow-50' },
};

export function ProblemCard({ problem }: { problem: Problem }) {
  const statusStyle = statusStyles[problem.status];
  const replyCount = problem.replies?.length || 0;

  return (
    <Card className={cn("overflow-hidden transition-shadow duration-300 hover:shadow-lg", statusStyle.bg)}>
      <div className="flex">
        <div className="flex flex-col items-center justify-start gap-2 bg-muted/30 p-4">
          <div className="flex flex-col items-center text-primary"
            aria-label={`${problem.priorityPoints} priority points invested`}
          >
            <Flame className="h-6 w-6" />
            <span className="font-bold text-lg mt-1">
              {problem.priorityPoints}
            </span>
            <span className="text-xs -mt-1">Points</span>
          </div>
          <Link href={`/problem/${problem.id}`} className="flex flex-col items-center text-muted-foreground hover:text-primary pt-2">
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm font-bold mt-1">{replyCount}</span>
          </Link>
        </div>
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
             <Link href={`/problem/${problem.id}`} className="hover:underline">
              <h3 className="font-headline text-lg font-semibold leading-tight">{problem.title}</h3>
             </Link>
            <Badge className={cn("text-xs font-semibold whitespace-nowrap flex items-center gap-1", statusStyle.badge)}>
              {problem.status === 'Pending Verification' && <ShieldQuestion className="h-3 w-3" />}
              {problem.status}
            </Badge>
          </div>

           <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
            <Avatar className="h-5 w-5">
              {problem.author.avatarUrl && <AvatarImage src={problem.author.avatarUrl} alt="Student" />}
              <AvatarFallback className="text-xs">
                <User className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <span>{problem.author.name}</span>
            <span className="text-xs">&bull;</span>
            <time dateTime={problem.createdAt}>
              {formatDistanceToNow(new Date(problem.createdAt), { addSuffix: true })}
            </time>
             <span className="text-xs">&bull;</span>
            <span>{problem.id}</span>
          </div>

          <p className="mt-3 text-sm text-foreground/80 line-clamp-2">{problem.description}</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {problem.hashtags.map((tag) => (
              <Badge key={tag} variant="outline" className="font-normal text-xs border">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
             <Button asChild variant="link" size="sm" className="p-0 h-auto">
                 <Link href={`/problem/${problem.id}`}>
                    <CornerDownLeft className="h-4 w-4 mr-2" />
                    View & Invest Points
                 </Link>
             </Button>
              <Button asChild variant="link" size="sm" className="p-0 h-auto text-muted-foreground">
                 <Link href={`/problem/${problem.id}#reply`}>
                    Reply
                 </Link>
             </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

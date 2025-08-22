
'use client';

import { useMemo } from 'react';
import { ProblemList } from '@/components/problem-list';
import { useComplaints } from '@/hooks/use-complaints';

export default function AllComplaintsPage() {
  const { problems } = useComplaints();

  const sortedProblems = useMemo(() => {
    return [...problems].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [problems]);

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <ProblemList
          problems={sortedProblems}
          title="All Complaints"
          description="A chronological feed of all submitted complaints, with the most recent at the top."
          sortBy="date"
        />
      </div>
    </section>
  );
}

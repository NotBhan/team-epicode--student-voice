'use client';

import { useComplaints } from '@/hooks/use-complaints';
import { ProblemDetails } from '@/components/problem-details';
import { notFound } from 'next/navigation';
import React, { use } from 'react';

export default function ProblemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { problems } = useComplaints();
  const problem = problems.find((p) => p.id === id);

  if (!problem) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
        <ProblemDetails problem={problem} />
    </div>
  );
}

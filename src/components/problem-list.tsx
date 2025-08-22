
'use client';

import { useState, useMemo } from 'react';
import type { Problem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { ProblemCard } from '@/components/problem-card';
import { Search } from 'lucide-react';

interface ProblemListProps {
    problems: Problem[];
    title?: string;
    description?: string;
    sortBy?: 'points' | 'date';
}

export function ProblemList({ 
    problems, 
    title = 'Complaint Scoreboard',
    description = 'Invest your Priority Points in problems that matter to you. The most-funded items get addressed first. Search by ID, keyword, or #hashtag.',
    sortBy = 'points'
}: ProblemListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProblems = useMemo(() => {
    let sortedProblems = [...problems];
    if (sortBy === 'points') {
      sortedProblems.sort((a, b) => b.priorityPoints - a.priorityPoints);
    } else {
      // The parent component should pass pre-sorted data for date sorting
    }

    if (!searchTerm) {
      return sortedProblems;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return sortedProblems.filter(
      (problem) =>
        problem.title.toLowerCase().includes(lowercasedTerm) ||
        problem.description.toLowerCase().includes(lowercasedTerm) ||
        problem.id.toLowerCase().includes(lowercasedTerm) ||
        problem.hashtags.some((tag) => tag.toLowerCase().includes(lowercasedTerm))
    );
  }, [problems, searchTerm, sortBy]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {description}
        </p>
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search complaints..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search problems"
          />
        </div>
      </div>
      {filteredProblems.length > 0 ? (
        <div className="grid gap-6">
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <h3 className="font-headline text-xl font-semibold">No complaints found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
}

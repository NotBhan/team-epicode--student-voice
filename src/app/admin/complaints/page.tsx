
'use client';

import { useState, useMemo } from 'react';
import withAuth from '@/components/auth/with-auth';
import { useComplaints } from '@/hooks/use-complaints';
import { Complaint, ProblemStatus } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Search, Flame, ArrowUpDown, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const statusVariantMap: Record<ProblemStatus, 'default' | 'secondary' | 'destructive' | 'success'> = {
  'Unsolved': 'secondary',
  'Approved and Under Investigation': 'default',
  'Solved': 'success',
  'Rejected': 'destructive',
  'Pending Verification': 'default', 
};

const ITEMS_PER_PAGE = 10;

function AdminComplaintsPage() {
  const { problems } = useComplaints();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProblemStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'points'>('date');
  const [currentPage, setCurrentPage] = useState(0);

  const filteredAndSortedComplaints = useMemo(() => {
    let filtered = [...problems];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (problem) =>
          problem.title.toLowerCase().includes(lowercasedTerm) ||
          problem.id.toLowerCase().includes(lowercasedTerm) ||
          problem.hashtags.some((tag) => tag.toLowerCase().includes(lowercasedTerm))
      );
    }

    // Sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else { // points
      filtered.sort((a, b) => b.priorityPoints - a.priorityPoints);
    }

    return filtered;
  }, [problems, statusFilter, searchTerm, sortBy]);
  
  const totalPages = Math.ceil(filteredAndSortedComplaints.length / ITEMS_PER_PAGE);
  const paginatedComplaints = filteredAndSortedComplaints.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  const handleSortChange = (newSortBy: 'date' | 'points') => {
    setSortBy(newSortBy);
    setCurrentPage(0);
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-foreground">All Complaints</h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by keyword, ID, #hashtag..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value as ProblemStatus | 'all');
              setCurrentPage(0);
            }}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Unsolved">Unsolved</SelectItem>
                <SelectItem value="Approved and Under Investigation">Under Investigation</SelectItem>
                <SelectItem value="Pending Verification">Pending Verification</SelectItem>
                <SelectItem value="Solved">Solved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <Button variant={sortBy === 'date' ? 'secondary' : 'ghost'} size="sm" onClick={() => handleSortChange('date')}>
                Most Recent
            </Button>
            <Button variant={sortBy === 'points' ? 'secondary' : 'ghost'} size="sm" onClick={() => handleSortChange('points')}>
                <Flame className="mr-2 h-4 w-4" />
                Most Funded
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Complaint</TableHead>
                <TableHead className="text-center">Priority</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedComplaints.map(problem => (
                <TableRow key={problem.id}>
                  <TableCell>
                      <div className="font-medium">{problem.title}</div>
                      <div className="text-xs text-muted-foreground">{problem.id}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1 font-semibold text-primary">
                      <Flame className="h-4 w-4" />
                      {problem.priorityPoints.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={statusVariantMap[problem.status]} className="w-[180px] justify-center">
                      {problem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(problem.createdAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/problem/${problem.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {paginatedComplaints.length === 0 && (
             <div className="text-center p-8 text-muted-foreground">No complaints found.</div>
           )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
            <span className="text-sm text-muted-foreground">Page {currentPage + 1} of {totalPages}</span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
            >
                <ChevronLeft className="h-4 w-4" />
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                disabled={currentPage >= totalPages - 1}
            >
                Next
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      )}
    </div>
  );
}

export default withAuth(AdminComplaintsPage, ['admin']);

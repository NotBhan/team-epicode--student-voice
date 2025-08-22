
'use client';

import withAuth from '@/components/auth/with-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useComplaints } from '@/hooks/use-complaints';
import { Complaint, Activity, ProblemStatus } from '@/lib/types';
import { ArrowDown, ArrowUp, CheckCircle, FileText, XCircle, Clock, Plus, Download, Upload, ShieldQuestion, Flame, ArrowRight, Hourglass, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { ComplaintStatusChart } from '@/components/charts/complaint-status-chart';
import { ComplaintsOverviewChart } from '@/components/charts/complaints-overview-chart';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const statusVariantMap: Record<ProblemStatus, 'default' | 'secondary' | 'destructive' | 'success'> = {
  'Unsolved': 'secondary',
  'Approved and Under Investigation': 'default',
  'Solved': 'success',
  'Rejected': 'destructive',
  'Pending Verification': 'default', 
};

const ITEMS_PER_PAGE = 10;

function AdminDashboardPage() {
  const { problems } = useComplaints();
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [pendingPage, setPendingPage] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [closedPage, setClosedPage] = useState(0);


  const totalComplaints = problems.length;
  const resolved = problems.filter(p => p.status === 'Solved').length;
  const pending = problems.filter(p => p.status !== 'Solved' && p.status !== 'Rejected').length;
  const rejected = problems.filter(p => p.status === 'Rejected').length;

  const pendingComplaints = problems.filter(p => p.status === 'Unsolved');
  const activeComplaints = problems.filter(p => p.status === 'Approved and Under Investigation' || p.status === 'Pending Verification');
  const closedComplaints = problems.filter(p => p.status === 'Solved' || p.status === 'Rejected');

  const paginatedPending = pendingComplaints.slice(pendingPage * ITEMS_PER_PAGE, (pendingPage + 1) * ITEMS_PER_PAGE);
  const paginatedActive = activeComplaints.slice(activePage * ITEMS_PER_PAGE, (activePage + 1) * ITEMS_PER_PAGE);
  const paginatedClosed = closedComplaints.slice(closedPage * ITEMS_PER_PAGE, (closedPage + 1) * ITEMS_PER_PAGE);

  const totalPendingPages = Math.ceil(pendingComplaints.length / ITEMS_PER_PAGE);
  const totalActivePages = Math.ceil(activeComplaints.length / ITEMS_PER_PAGE);
  const totalClosedPages = Math.ceil(closedComplaints.length / ITEMS_PER_PAGE);

  const topFundedProblems = useMemo(() => {
    return [...problems]
      .sort((a, b) => b.priorityPoints - a.priorityPoints)
      .slice(0, 5);
  }, [problems]);

  const handleExport = () => {
    const headers = ['ID', 'Title', 'Description', 'Status', 'Priority Points', 'Created At', 'Hashtags'];
    const csvRows = [headers.join(',')];

    problems.forEach(p => {
      const row = [
        p.id,
        `"${p.title.replace(/"/g, '""')}"`,
        `"${p.description.replace(/"/g, '""')}"`,
        p.status,
        p.priorityPoints,
        p.createdAt,
        `"${p.hashtags.join(', ')}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'complaints.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Export Successful',
      description: 'The complaints data has been downloaded as a CSV file.',
    });
  };

  return (
    <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Complaints</p>
                            <p className="text-2xl font-bold">{totalComplaints}</p>
                        </div>
                    </div>
                     <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <ArrowUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">12%</span> from last week
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                            <p className="text-2xl font-bold">{resolved}</p>
                        </div>
                    </div>
                     <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <ArrowUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">8%</span> from last week
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pending</p>
                            <p className="text-2xl font-bold">{pending}</p>
                        </div>
                    </div>
                     <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <ArrowDown className="h-4 w-4 text-red-500" />
                        <span className="text-red-500">3%</span> from last week
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-100 p-3 rounded-full">
                            <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                            <p className="text-2xl font-bold">{rejected}</p>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        No change
                    </p>
                </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Complaints</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="pending">
                    <TabsList>
                        <TabsTrigger value="pending">Pending ({pendingComplaints.length})</TabsTrigger>
                        <TabsTrigger value="active">Active ({activeComplaints.length})</TabsTrigger>
                        <TabsTrigger value="closed">Closed ({closedComplaints.length})</TabsTrigger>
                    </TabsList>
                     <TabsContent value="pending" className="mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Complaint</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedPending.map(problem => (
                                    <TableRow key={problem.id}>
                                        <TableCell className="font-medium">{problem.id}</TableCell>
                                        <TableCell>{problem.title}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 font-semibold text-primary">
                                                <Flame className="h-4 w-4" />
                                                {problem.priorityPoints.toLocaleString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={statusVariantMap[problem.status]} className="inline-flex justify-center w-full max-w-xs items-center gap-1">
                                                <Hourglass className="h-3 w-3" />
                                                {problem.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(problem.createdAt), 'MMM dd, yyyy')}</TableCell>
                                        <TableCell>
                                            <Button variant="link" size="sm" asChild className="p-0 h-auto">
                                                <Link href={`/problem/${problem.id}`}>View</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         <div className="flex items-center justify-end space-x-2 py-4">
                            <span className="text-sm text-muted-foreground">Page {pendingPage + 1} of {totalPendingPages}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPendingPage(prev => Math.max(prev - 1, 0))}
                                disabled={pendingPage === 0}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPendingPage(prev => Math.min(prev + 1, totalPendingPages - 1))}
                                disabled={pendingPage >= totalPendingPages - 1}
                            >
                                Next
                                <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="active" className="mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Complaint</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedActive.map(problem => (
                                    <TableRow key={problem.id}>
                                        <TableCell className="font-medium">{problem.id}</TableCell>
                                        <TableCell>{problem.title}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 font-semibold text-primary">
                                                <Flame className="h-4 w-4" />
                                                {problem.priorityPoints.toLocaleString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={statusVariantMap[problem.status]} className="inline-flex justify-center w-full max-w-xs items-center gap-1">
                                                {problem.status === 'Pending Verification' && <ShieldQuestion className="h-3 w-3" />}
                                                {problem.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(problem.createdAt), 'MMM dd, yyyy')}</TableCell>
                                        <TableCell>
                                            <Button variant="link" size="sm" asChild className="p-0 h-auto">
                                                <Link href={`/problem/${problem.id}`}>View</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <span className="text-sm text-muted-foreground">Page {activePage + 1} of {totalActivePages}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActivePage(prev => Math.max(prev - 1, 0))}
                                disabled={activePage === 0}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActivePage(prev => Math.min(prev + 1, totalActivePages - 1))}
                                disabled={activePage >= totalActivePages - 1}
                            >
                                Next
                                <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="closed" className="mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Complaint</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedClosed.map(problem => (
                                    <TableRow key={problem.id}>
                                        <TableCell className="font-medium">{problem.id}</TableCell>
                                        <TableCell>{problem.title}</TableCell>
                                        <TableCell>
                                             <div className="flex items-center gap-1 font-semibold text-muted-foreground">
                                                <Flame className="h-4 w-4" />
                                                {problem.priorityPoints.toLocaleString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={statusVariantMap[problem.status]} className="inline-flex justify-center w-full max-w-xs">{problem.status}</Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(problem.createdAt), 'MMM dd, yyyy')}</TableCell>
                                        <TableCell>
                                             <Button variant="link" size="sm" asChild className="p-0 h-auto">
                                                <Link href={`/problem/${problem.id}`}>View</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         <div className="flex items-center justify-end space-x-2 py-4">
                            <span className="text-sm text-muted-foreground">Page {closedPage + 1} of {totalClosedPages}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setClosedPage(prev => Math.max(prev - 1, 0))}
                                disabled={closedPage === 0}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setClosedPage(prev => Math.min(prev + 1, totalClosedPages - 1))}
                                disabled={closedPage >= totalClosedPages - 1}
                            >
                                Next
                                <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    <Button asChild>
                      <Link href="/report-problem">
                        <Plus className="mr-2 h-4 w-4" /> Add New Complaint
                      </Link>
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                        <Upload className="mr-2 h-4 w-4" /> Export Data
                    </Button>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Top Funded Problems</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {topFundedProblems.map((problem) => (
                            <li key={problem.id} className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <Link href={`/problem/${problem.id}`} className="font-semibold hover:underline">
                                        {problem.title}
                                    </Link>
                                    <div className="flex items-center gap-1.5 text-sm text-primary font-medium">
                                        <Flame className="h-4 w-4" />
                                        <span>{problem.priorityPoints.toLocaleString()} points</span>
                                    </div>
                                </div>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={`/problem/${problem.id}`}>
                                        View <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

export default withAuth(AdminDashboardPage, ['admin']);

    
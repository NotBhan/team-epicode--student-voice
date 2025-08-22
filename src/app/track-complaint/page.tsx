
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Search, PlusCircle } from 'lucide-react';
import type { Problem } from '@/lib/types';
import { useComplaints } from '@/hooks/use-complaints';

type ComplaintStatus = {
  id: string;
  category: string;
  submittedOn: string;
  lastUpdate: string;
  progress: number;
  latestUpdate: string;
  status: Problem['status'];
};

export default function TrackComplaintPage() {
  const [complaintId, setComplaintId] = useState('');
  const [complaintStatus, setComplaintStatus] = useState<ComplaintStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { problems } = useComplaints();

  const handleTrackComplaint = () => {
    setIsLoading(true);
    setError(null);
    setComplaintStatus(null);
    
    // Simulating API call
    setTimeout(() => {
        const foundProblem = problems.find(p => p.id.toLowerCase() === complaintId.toLowerCase());

        if (foundProblem) {
            setComplaintStatus({
                id: foundProblem.id,
                category: foundProblem.hashtags[0]?.replace('#', '') || 'General',
                submittedOn: new Date(foundProblem.createdAt).toLocaleDateString(),
                lastUpdate: new Date().toLocaleString(),
                progress: foundProblem.status === 'Solved' ? 100 : foundProblem.status === 'Approved and Under Investigation' ? 50 : 10,
                latestUpdate: foundProblem.status === 'Solved' ? 'Your complaint has been resolved. Please confirm everything is satisfactory.' : 'We are currently reviewing your complaint.',
                status: foundProblem.status,
            });
        } else {
            setError('No complaint found with that ID. Please check the ID and try again.');
        }
        setIsLoading(false);
    }, 1000);
  };

  return (
    <>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
            <h1 className="font-headline text-4xl font-bold md:text-5xl">Track Your Complaint</h1>
            <p className="mt-4 text-lg text-indigo-100">
            Enter your complaint ID below to check the current status and updates.
            </p>
        </div>
        </section>

        {/* Tracking Section */}
        <section className="py-12">
        <div className="container mx-auto max-w-2xl px-4">
            <Card>
            <CardHeader>
                <CardTitle className="text-center font-headline">Enter Complaint Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="complaintId">Complaint ID</Label>
                <Input
                    id="complaintId"
                    placeholder="e.g., PRB-001"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">Found in your submission confirmation.</p>
                </div>
                <Button onClick={handleTrackComplaint} disabled={isLoading || !complaintId} className="w-full">
                <Search className="mr-2 h-4 w-4" />
                {isLoading ? 'Tracking...' : 'Track Complaint'}
                </Button>
            </CardContent>
            </Card>

            {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            
            {complaintStatus && (
            <Card className="mt-8">
                <CardHeader>
                <CardTitle className="font-headline">Complaint Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Complaint ID: <span className="font-medium text-foreground">{complaintStatus.id}</span></p>
                    <Badge variant={complaintStatus.status === 'Solved' ? 'success' : 'default'}>{complaintStatus.status}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Category</p>
                        <p className="font-medium capitalize text-foreground">{complaintStatus.category}</p>
                    </div>
                        <div>
                        <p className="text-muted-foreground">Submitted On</p>
                        <p className="font-medium text-foreground">{complaintStatus.submittedOn}</p>
                    </div>
                        <div>
                        <p className="text-muted-foreground">Last Update</p>
                        <p className="font-medium text-foreground">{complaintStatus.lastUpdate}</p>
                    </div>
                </div>

                <div>
                    <Label htmlFor="progress">Progress</Label>
                    <Progress value={complaintStatus.progress} className="mt-2" />
                    <p className="text-right text-sm text-muted-foreground mt-1">{complaintStatus.progress}% complete</p>
                </div>

                    <div>
                    <p className="text-sm font-semibold text-foreground">Latest Update</p>
                    <p className="mt-1 text-sm text-muted-foreground">{complaintStatus.latestUpdate}</p>
                    </div>

                <div className="text-center pt-4">
                    <Button variant="link" asChild>
                        <Link href="/report-problem">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Raise a new complaint
                        </Link>
                    </Button>
                </div>
                </CardContent>
            </Card>
            )}
        </div>
        </section>
    </>
  );
}

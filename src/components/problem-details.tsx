
'use client';

import { useState, useRef, useMemo } from 'react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ReplyCard } from '@/components/reply-card';
import { StatusChangeCard } from '@/components/status-change-card';
import { Flame, User, MessageSquare, ShieldCheck, Wallet, ShieldQuestion, ThumbsUp, XCircle, CheckCircle, Ban, BadgeCheck, GraduationCap } from 'lucide-react';
import type { Problem, ProblemStatus, Reply } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useComplaints } from '@/hooks/use-complaints';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const statusStyles: Record<ProblemStatus, string> = {
  'Unsolved': 'border-slate-300 bg-slate-100 text-slate-800',
  'Approved and Under Investigation': 'border-blue-300 bg-blue-100 text-blue-800',
  'Solved': 'border-green-300 bg-green-100 text-green-800',
  'Rejected': 'border-red-300 bg-red-100 text-red-800',
  'Pending Verification': 'border-yellow-300 bg-yellow-100 text-yellow-800',
};

export function ProblemDetails({ problem: initialProblem }: { problem: Problem }) {
  const [problem, setProblem] = useState(initialProblem);
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [newReply, setNewReply] = useState('');
  const [hasVerified, setHasVerified] = useState(false);
  const { toast } = useToast();
  const { userProfile, updatePriorityPoints } = useAuth();
  const { updateProblemPoints, updateProblemStatus } = useComplaints();
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInvestPoints = () => {
    if (!userProfile || userProfile.role !== 'student') {
      toast({ variant: 'destructive', title: 'Only students can invest points.'});
      return;
    }

    const pointsToInvest = Number(investmentAmount);
    if (isNaN(pointsToInvest) || pointsToInvest <= 0) {
      toast({ variant: 'destructive', title: 'Invalid amount', description: 'Please enter a positive number of points to invest.'});
      return;
    }
    
    if (pointsToInvest > (userProfile.priorityPoints ?? 0)) {
        toast({ variant: 'destructive', title: 'Not enough points', description: `You only have ${userProfile.priorityPoints} points remaining.` });
        return;
    }

    const newTotalPoints = problem.priorityPoints + pointsToInvest;
    const remainingUserPoints = (userProfile.priorityPoints ?? 0) - pointsToInvest;

    setProblem(prev => ({ ...prev, priorityPoints: newTotalPoints }));
    updateProblemPoints(problem.id, newTotalPoints);
    updatePriorityPoints(remainingUserPoints);

    toast({ title: 'Investment Successful!', description: `You invested ${pointsToInvest} points in this problem.`});
    setInvestmentAmount(0);
  };
  
  const handlePostReply = () => {
    if (newReply.trim().length < 10) {
        toast({
            variant: 'destructive',
            title: 'Reply is too short',
            description: 'Please provide a more detailed reply.',
        });
        return;
    }

    const author = (userProfile?.role === 'admin')
        ? { name: userProfile.fullName || 'Admin', isOP: false, post: userProfile.post || 'Official' }
        : { name: 'Anonymous', isOP: false };

    const reply: Reply = {
        id: `REP-${Date.now()}`,
        author,
        content: newReply,
        createdAt: new Date().toISOString(),
        upvotes: 0,
    };

    setProblem(prev => ({
        ...prev,
        replies: [...(prev.replies || []), reply]
    }))
    setNewReply('');
    toast({
        title: 'Reply Posted',
        description: 'Your reply has been added to the thread.',
    });
  }

  const handleReplyToAction = (replyId: string) => {
    const reply = problem.replies?.find(r => r.id === replyId);
    if (reply && replyTextareaRef.current) {
        setNewReply(prev => `@${reply.author.name} ${prev}`);
        replyTextareaRef.current.focus();
    }
  }

  const handleVerification = (isConfirmed: boolean) => {
    if(isConfirmed) {
      updateProblemStatus(problem.id, 'Solved');
      setProblem(prev => ({ ...prev, status: 'Solved' }));
      toast({ title: 'Verification Submitted', description: 'You have confirmed the solution. This problem is now officially solved.'});
    } else {
      updateProblemStatus(problem.id, 'Unsolved');
      setProblem(prev => ({ ...prev, status: 'Unsolved' }));
      toast({ variant: 'destructive', title: 'Verification Submitted', description: 'You have re-opened the issue. The administration will be notified.'});
    }
    setHasVerified(true);
  }

  const handleApproval = (approved: boolean) => {
    if (approved) {
      updateProblemStatus(problem.id, 'Approved and Under Investigation');
      setProblem(prev => ({ ...prev, status: 'Approved and Under Investigation' }));
      toast({ title: 'Problem Approved', description: 'The status has been updated to "Approved and Under Investigation".' });
    } else {
      updateProblemStatus(problem.id, 'Rejected');
      setProblem(prev => ({ ...prev, status: 'Rejected' }));
      toast({ title: 'Problem Rejected', description: 'The complaint has been rejected and is now closed.' });
    }
  };

  const handleMarkAsSolved = () => {
    updateProblemStatus(problem.id, 'Pending Verification');
    setProblem(prev => ({ ...prev, status: 'Pending Verification' }));
    toast({
      title: 'Problem Marked for Verification',
      description: 'The status has been updated to "Pending Verification" and is now open for student confirmation.',
    });
  };

  const statusStyle = statusStyles[problem.status];
  
  const discussionThread = useMemo(() => {
    const replies = problem.replies?.map(r => ({ ...r, type: 'reply', date: new Date(r.createdAt) })) || [];
    const statusChanges = problem.statusHistory?.map(s => ({ ...s, type: 'status', date: new Date(s.timestamp) })) || [];
    
    // @ts-ignore
    return [...replies, ...statusChanges].sort((a, b) => a.date - b.date);
  }, [problem.replies, problem.statusHistory]);


  return (
    <div className="space-y-8">
        {/* Main Problem Card */}
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="p-6">
                    <div className="flex justify-between items-start gap-4">
                        <Badge className={cn("text-sm", statusStyle)}>{problem.status}</Badge>
                        <div className="text-right text-sm text-muted-foreground">
                            <p>Posted on {format(new Date(problem.createdAt), 'PPP')}</p>
                            <p>ID: {problem.id}</p>
                        </div>
                    </div>
                    <h1 className="font-headline text-3xl font-bold mt-4">{problem.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                {problem.author.avatarUrl && <AvatarImage src={problem.author.avatarUrl} alt={problem.author.name} />}
                                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <span>{problem.author.name}</span>
                        </div>
                        {problem.author.year && problem.author.branch && (
                           <div className="flex items-center gap-2 text-xs border-l pl-4">
                                <GraduationCap className="h-4 w-4" />
                                <span>{problem.author.year} Year, {problem.author.branch}</span>
                           </div>
                        )}
                    </div>
                    <p className="mt-4 text-base text-foreground/90 whitespace-pre-wrap">{problem.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {problem.hashtags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </div>
                <div className="bg-muted/50 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Flame className="h-6 w-6" />
                      <span className="text-xl font-bold">{problem.priorityPoints.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">Points Invested</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MessageSquare className="h-5 w-5" />
                        <span>{problem.replies?.length || 0} Replies</span>
                    </div>
                </div>
            </CardContent>
        </Card>

        {userProfile?.role === 'admin' && problem.status === 'Unsolved' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck />
                Admin Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <p className="text-sm text-muted-foreground">Review this complaint and decide on the next step.</p>
                <div className="flex gap-4">
                  <Button className="flex-1" onClick={() => handleApproval(true)}>
                    <CheckCircle className="mr-2" />
                    Approve
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => handleApproval(false)}>
                    <Ban className="mr-2" />
                    Reject
                  </Button>
                </div>
            </CardContent>
          </Card>
        )}

        {userProfile?.role === 'admin' && problem.status === 'Approved and Under Investigation' && (
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck />
                Admin Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <p className="text-sm text-muted-foreground">Once the issue is resolved, mark it as solved to begin the student verification process.</p>
                <div className="flex gap-4">
                  <Button onClick={handleMarkAsSolved}>
                    <BadgeCheck className="mr-2" />
                    Mark as Solved
                  </Button>
                </div>
            </CardContent>
          </Card>
        )}

        {problem.status === 'Pending Verification' && (
          <Card className="border-yellow-400 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-900">
                <ShieldQuestion />
                Solution Verification Needed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-yellow-800">
                An administrator has marked this problem as solved. If you have been affected by this issue, please help confirm whether the solution is satisfactory.
              </p>
              {hasVerified ? (
                <Alert className="bg-white">
                  <ThumbsUp className="h-4 w-4" />
                  <AlertTitle>Thank you!</AlertTitle>
                  <AlertDescription>Your feedback has been recorded.</AlertDescription>
                </Alert>
              ) : (
                <div className="flex gap-4">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleVerification(true)}>
                    <ThumbsUp className="mr-2" />
                    Confirm, It's Fixed
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => handleVerification(false)}>
                    <XCircle className="mr-2" />
                    Re-open, Still an Issue
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {userProfile?.role === 'student' && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Invest Your Priority Points
              </h3>
              <p className="text-sm text-muted-foreground">
                You have <span className="font-bold text-primary">{userProfile.priorityPoints?.toLocaleString() || 0}</span> points remaining this semester. Show how much this issue matters to you.
              </p>
              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor="investment-amount">Points to Invest</Label>
                  <Input 
                    id="investment-amount"
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    placeholder="e.g., 100"
                    min="0"
                    max={userProfile.priorityPoints || 0}
                  />
                </div>
                <Button onClick={handleInvestPoints}>
                  <Flame className="mr-2 h-4 w-4" />
                  Invest
                </Button>
              </div>
            </CardContent>
          </Card>
        )}


        {/* Replies Section */}
        <div className="space-y-6" id="reply">
            <h2 className="font-headline text-2xl font-bold border-b pb-2">Discussion Thread</h2>
            
            {/* List of Replies and Status Changes */}
            {discussionThread.length > 0 ? (
                <div className="space-y-4">
                    {discussionThread.map(item =>
                        item.type === 'reply' ? (
                            <ReplyCard key={item.id} reply={item} onReply={handleReplyToAction} />
                        ) : (
                            <StatusChangeCard key={`${item.status}-${item.timestamp}`} statusChange={item} />
                        )
                    )}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>No activity yet.</p>
                    <p className="text-sm">Be the first to join the discussion!</p>
                </div>
            )}

            <Separator />

            {/* Add Reply Card */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                       {userProfile?.role === 'admin' && <ShieldCheck className="h-5 w-5 text-primary" />}
                       {userProfile?.role === 'admin' ? `Replying as ${userProfile.fullName}` : 'Join the discussion'}
                    </h3>
                    <Textarea 
                        ref={replyTextareaRef}
                        placeholder="Add your reply..." 
                        className="min-h-[100px]"
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <Button onClick={handlePostReply} disabled={!newReply.trim()}>Post Reply</Button>
                    </div>
                </CardContent>
            </Card>

        </div>
    </div>
  );
}

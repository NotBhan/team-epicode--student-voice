
'use client';

import { ProblemList } from '@/components/problem-list';
import { ShieldCheck, UserCog, MessageSquareQuote, BookOpen, Building, ShieldAlert, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useComplaints } from '@/hooks/use-complaints';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const { problems } = useComplaints();

  const resolvedComplaints = problems.filter(p => p.status === 'Solved').length;
  const underInvestigation = problems.filter(p => p.status === 'Approved and Under Investigation').length;

  return (
    <>
      <section className="relative bg-background pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Your Voice for a Better Campus
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            StudentVoice is a secure, anonymous platform for you to report issues, share feedback,
            and help improve our college experience together.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/report-problem">Report an Issue</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted/60 py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground">
              A simple, transparent process to make sure your voice is heard.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background mx-auto shadow-sm">
                <span className="font-headline text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-headline text-xl font-bold">Submit Anonymously</h3>
              <p className="mt-2 text-foreground/80">Raise a complaint or provide feedback with complete anonymity. No accounts or personal data needed.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background mx-auto shadow-sm">
                <span className="font-headline text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-headline text-xl font-bold">Invest Priority Points</h3>
              <p className="mt-2 text-foreground/80">Use your seasonal point budget to fund issues that matter. The most-funded complaints get prioritized.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background mx-auto shadow-sm">
                <span className="font-headline text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-headline text-xl font-bold">Track Resolution</h3>
              <p className="mt-2 text-foreground/80">Follow the status of any complaint with a unique tracking ID, from submission to resolution.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-5xl px-4">
           <ProblemList problems={problems} sortBy="points" />
        </div>
      </section>

      <section className="bg-muted/60 py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
               <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Common Complaint Categories
              </h2>
              <p className="mt-4 text-lg text-foreground">
                Find the right place for your concern. We categorize every submission to ensure it reaches the correct department quickly and efficiently.
              </p>
               <Button asChild variant="link" className="mt-4 px-0 text-lg">
                  <Link href="/report-problem">Report a Problem <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 text-center hover:bg-card-hover transition-colors">
                   <Building className="h-8 w-8 text-primary mx-auto mb-3" />
                   <h3 className="font-headline font-semibold">Facilities</h3>
                </Card>
                 <Card className="p-6 text-center hover:bg-card-hover transition-colors">
                   <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
                   <h3 className="font-headline font-semibold">Academics</h3>
                </Card>
                 <Card className="p-6 text-center hover:bg-card-hover transition-colors">
                   <ShieldAlert className="h-8 w-8 text-primary mx-auto mb-3" />
                   <h3 className="font-headline font-semibold">Safety</h3>
                </Card>
                 <Card className="p-6 text-center hover:bg-card-hover transition-colors">
                   <MessageSquareQuote className="h-8 w-8 text-primary mx-auto mb-3" />
                   <h3 className="font-headline font-semibold">Other</h3>
                </Card>
            </div>
          </div>
        </div>
      </section>

       <section className="bg-primary/90 text-primary-foreground py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            <div>
              <p className="font-headline text-5xl font-bold">{problems.length}</p>
              <p className="text-sm uppercase tracking-wider text-primary-foreground/80 mt-1">Total Complaints</p>
            </div>
            <div>
              <p className="font-headline text-5xl font-bold">{resolvedComplaints}</p>
              <p className="text-sm uppercase tracking-wider text-primary-foreground/80 mt-1">Solved</p>
            </div>
            <div>
              <p className="font-headline text-5xl font-bold">{underInvestigation}</p>
              <p className="text-sm uppercase tracking-wider text-primary-foreground/80 mt-1">Under Investigation</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { ShieldCheck, Users, LineChart, Shield, Lock, Search, ShieldAlert, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h1 className="font-headline text-4xl font-bold md:text-5xl">About StudentVoice</h1>
            <p className="mt-4 text-lg text-blue-100">
              Creating a safer, more responsive campus environment through anonymous complaints and feedback.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="mb-4 text-center font-headline text-3xl font-bold">Our Mission</h2>
            <p className="text-center text-lg text-muted-foreground">
              StudentVoice was created to bridge the communication gap between students and college administration by providing a secure, anonymous platform for raising concerns. We believe every student deserves to be heard without fear of repercussions, and every institution deserves honest feedback to foster improvement.
            </p>
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="mb-12 text-center font-headline text-3xl font-bold">Key Features</h2>
            <div className="grid gap-8 md:grid-cols-4">
              <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-headline text-xl font-bold">Complete Anonymity</h3>
                <p className="text-foreground/80">No IP tracking, no user accounts – just pure anonymous communication.</p>
              </div>
              <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-headline text-xl font-bold">Community Upvoting</h3>
                <p className="text-foreground/80">Students can upvote complaints that matter most, helping administration prioritize.</p>
              </div>
              <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                   <FileText className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-headline text-xl font-bold">Transparent Tracking</h3>
                <p className="text-foreground/80">Track the status of your complaint from submission to resolution.</p>
              </div>
              <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <LineChart className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-headline text-xl font-bold">AI-Powered Assistance</h3>
                <p className="text-foreground/80">AI helps generate relevant hashtags and verifies image authenticity to ensure reliable submissions.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
            <div className="container mx-auto max-w-4xl px-4">
                <h2 className="mb-12 text-center font-headline text-3xl font-bold">How We Protect Your Privacy</h2>
                <div className="grid gap-8 sm:grid-cols-2">
                    <div className="flex items-start">
                        <div className="mr-4 flex-shrink-0">
                           <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                             <Shield className="h-4 w-4" />
                           </div>
                        </div>
                        <div>
                            <h3 className="font-headline text-lg font-semibold">Anonymous by Design</h3>
                            <p className="mt-1 text-muted-foreground">We don't ask for or store any identifying information about complaint submitters. All posts are anonymous.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="mr-4 flex-shrink-0">
                           <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                             <Lock className="h-4 w-4" />
                           </div>
                        </div>
                        <div>
                            <h3 className="font-headline text-lg font-semibold">Secure Communication</h3>
                            <p className="mt-1 text-muted-foreground">All data is encrypted in transit and at rest, ensuring submissions are secure from end to end.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="mr-4 flex-shrink-0">
                           <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                             <Search className="h-4 w-4" />
                           </div>
                        </div>
                        <div>
                            <h3 className="font-headline text-lg font-semibold">No Tracking</h3>
                            <p className="mt-1 text-muted-foreground">We don't use cookies or any tracking technologies that could be used to identify users.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="mr-4 flex-shrink-0">
                           <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                             <ShieldAlert className="h-4 w-4" />
                           </div>
                        </div>
                        <div>
                            <h3 className="font-headline text-lg font-semibold">Authenticity Checks</h3>
                            <p className="mt-1 text-muted-foreground">AI is used to detect and flag AI-generated images to maintain the integrity of submissions.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="font-headline text-3xl font-bold">Ready to Make Your Voice Heard?</h2>
            <p className="mt-4 text-lg text-foreground/80">
              Join your fellow students in improving the campus experience through anonymous, impactful complaints.
            </p>
            <div className="mt-8">
                <Button asChild size="lg">
                    <Link href="/report-problem">Submit a Complaint</Link>
                </Button>
            </div>
          </div>
        </section>
    </>
  );
}

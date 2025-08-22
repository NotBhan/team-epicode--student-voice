
'use client';

import Link from 'next/link';
import { Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import React, { useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { NotificationBell } from '../notification-bell';
import { MOCK_STUDENT_NOTIFICATIONS, MOCK_ADMIN_NOTIFICATIONS } from '@/lib/mock-data';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/all-complaints', label: 'All Complaints' },
  { href: '/report-problem', label: 'Raise a Complaint' },
  { href: '/give-feedback', label: 'Give Feedback' },
  { href: '/track-complaint', label: 'Track your complaint' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = React.useState(false);
  const { user, userProfile, logOut } = useAuth();

  const notifications = useMemo(() => {
    if (!userProfile) return [];

    if (userProfile.role === 'admin') {
      return MOCK_ADMIN_NOTIFICATIONS.filter(n => {
        if (n.text.includes('high-priority')) return true;
        if (n.text.includes('tagged')) {
          return n.href?.includes('PRB-001'); 
        }
        return true;
      });
    }
    
    return MOCK_STUDENT_NOTIFICATIONS;
  }, [userProfile]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/nav-brand.png" alt="StudentVoice brand icon" width={24} height={24} />
          <span className="font-headline text-lg font-bold">StudentVoice</span>
        </Link>
        <nav className="hidden items-center space-x-4 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
             <>
               <NotificationBell notifications={notifications} />
               <Button onClick={logOut} variant="ghost" size="icon" aria-label="Sign out">
                 <LogOut className="h-5 w-5" />
               </Button>
             </>
          ) : (
            <>
              <Button asChild className="hidden md:inline-flex">
                <Link href="/login">Login</Link>
              </Button>
               <Button asChild variant="outline" className="hidden md:inline-flex">
                <Link href={'/admin/login'}>Admin</Link>
              </Button>
            </>
          )}
          
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                </SheetHeader>
              <nav className="grid gap-6 text-lg font-medium mt-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={() => setSheetOpen(false)}
                >
                  <Image src="/nav-brand.png" alt="StudentVoice brand icon" width={24} height={24} />
                  <span className="font-headline">StudentVoice</span>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSheetOpen(false)}
                    className={cn(
                      'transition-colors hover:text-primary',
                      pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 space-y-2">
                 {user ? (
                   <Button onClick={() => { logOut(); setSheetOpen(false); }} className="w-full">
                     <LogOut className="mr-2 h-4 w-4" /> Sign Out
                   </Button>
                 ) : (
                  <>
                    <Button asChild className="w-full">
                      <Link href="/login" onClick={() => setSheetOpen(false)}>Login</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/login" onClick={() => setSheetOpen(false)}>Admin Login</Link>
                    </Button>
                  </>
                 )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

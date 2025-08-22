
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, LineChart, LogOut, Users } from 'lucide-react';
import Image from 'next/image';

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/complaints', label: 'Complaints', icon: FileText },
  { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
  { href: '/admin/user-management', label: 'User Management', icon: Users, requiredPost: 'Faculty Head' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { userProfile, logOut } = useAuth();
  
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col p-4">
      <div className="text-2xl font-bold mb-10 flex items-center justify-between gap-2 px-2">
         <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Image src="/nav-brand.png" alt="StudentVoice brand icon" width={32} height={32} />
            <span>StudentVoice</span>
         </Link>
      </div>
      <nav className="flex-1 space-y-2">
        {navLinks.map((link) => {
            if(link.requiredPost && userProfile?.post !== link.requiredPost) {
                return null;
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-700 hover:text-white',
                  { 'bg-primary text-white': pathname === link.href }
                )}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            )
        })}
      </nav>
      <div className="mt-auto">
         <div className="border-t border-gray-700 -mx-4 my-4"></div>
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar>
            <AvatarImage src="https://placehold.co/40x40.png" />
            <AvatarFallback>{userProfile?.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{userProfile?.email}</p>
            <p className="text-xs text-gray-400 capitalize">{userProfile?.post || userProfile?.role}</p>
          </div>
           <Button variant="ghost" size="icon" onClick={logOut} className="ml-auto text-gray-400 hover:text-white hover:bg-gray-700">
             <LogOut className="h-5 w-5" />
           </Button>
        </div>
      </div>
    </aside>
  );
}

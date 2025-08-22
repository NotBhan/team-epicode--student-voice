
import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-2 gap-y-8 gap-x-4 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="mb-4 flex items-center space-x-2">
              <Image src="/nav-brand.png" alt="StudentVoice brand icon" width={24} height={24} />
              <span className="font-headline text-lg font-bold text-foreground">
                StudentVoice
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A secure platform for students to voice concerns and improve campus life.
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-headline font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/all-complaints" className="text-sm text-muted-foreground hover:text-primary">
                  All Complaints
                </Link>
              </li>
              <li>
                <Link href="/report-problem" className="text-sm text-muted-foreground hover:text-primary">
                  Raise a Complaint
                </Link>
              </li>
              <li>
                <Link href="/give-feedback" className="text-sm text-muted-foreground hover:text-primary">
                  Give Feedback
                </Link>
              </li>
              <li>
                <Link href="/track-complaint" className="text-sm text-muted-foreground hover:text-primary">
                  Track your complaint
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-headline font-semibold text-foreground">Contact</h3>
            <p className="text-sm text-muted-foreground">Dean's Office, Admin Block</p>
            <p className="text-sm text-muted-foreground">complaints@college.edu</p>
            <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
          </div>
          <div>
            <h3 className="mb-4 font-headline font-semibold text-foreground">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} StudentVoice. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

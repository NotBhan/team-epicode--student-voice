
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { QuickAssistChat } from '@/components/quick-assist-chat';
import { PageTransitionLoader } from '@/components/page-transition-loader';
import './globals.css';
import { AuthProvider } from '@/hooks/use-auth';
import { Footer } from '@/components/layout/footer';
import { ComplaintProvider } from '@/hooks/use-complaints';
import { Inter, Lexend } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontHeading = Lexend({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'StudentVoice',
  description: 'A platform for students to voice their concerns and drive change on campus.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-sans antialiased', fontSans.variable, fontHeading.variable)}>
        <AuthProvider>
          <ComplaintProvider>
            <PageTransitionLoader />
            <div className="relative flex min-h-screen w-full flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <QuickAssistChat />
            <Toaster />
          </ComplaintProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { DataProvider } from '@/contexts/DataContext';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'DevDiary - Project & Task Tracker',
  description: 'A simple, clean website to help a solo software developer keep track of projects, project-specific tasks, and small notes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DataProvider>
            <div className="relative flex min-h-dvh flex-col bg-background">
              <Header />
              <main className="container mx-auto max-w-5xl flex-1 px-4 py-8 md:py-12">
                {children}
              </main>
              <Footer />
              <Toaster />
            </div>
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { DataProvider } from '@/contexts/DataContext';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'DevFlow - Project & Task Tracker',
  description: 'A simple, clean website to help a solo software developer keep track of projects, project-specific tasks, and small notes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background font-sans')}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DataProvider>
            <div className="relative flex min-h-dvh flex-col bg-background">
              <Header />
              <main className="container mx-auto max-w-5xl flex-1 px-4 py-8 md:py-12">
                {children}
              </main>
              <Toaster />
            </div>
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

'use client';

import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { WalletProvider } from "@/contexts/WalletContext";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import './globals.css';

// Import Navigation with no SSR
const Navigation = dynamic(() => import('@/components/Navigation'), {
  ssr: false,
  loading: () => (
    <div className="h-16 bg-white shadow-sm flex items-center px-4">
      <div className="animate-pulse flex items-center space-x-4">
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
});

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider>
            <Suspense fallback={
              <div className="h-16 bg-white shadow-sm"></div>
            }>
              <Navigation />
            </Suspense>
            <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
              {children}
            </main>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
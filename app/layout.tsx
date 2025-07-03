import './globals.css';
import { Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MediChain - Blockchain Drug Verification',
  description: 'Secure pharmaceutical supply chain verification using Cardano blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navigation />
          <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
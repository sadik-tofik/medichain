import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MediChain Cardano',
  description: 'Pharmaceutical supply chain on Cardano',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'MediChain Cardano',
    description: 'Pharmaceutical supply chain on Cardano',
    url: 'https://medichain-cardano.vercel.app',
    siteName: 'MediChain',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MediChain Cardano',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediChain Cardano',
    description: 'Pharmaceutical supply chain on Cardano',
    images: ['/twitter-image.jpg'],
  },
};

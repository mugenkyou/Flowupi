import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { OfflineBanner } from '../components/OfflineBanner';

export const metadata: Metadata = {
  title: 'FlowUPI — Fast Local-First UPI Payment Utility',
  description: 'FlowUPI is a fast, local-first UPI payment utility for QR payments, payment splitting, group bills, MDR calculations and more.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FlowUPI',
  },
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
  openGraph: {
    title: 'FlowUPI — Fast Local-First UPI Payment Utility',
    description: 'Local-first web application for QR payments, micro-tranching, MDR calculations, and soundbox simulation.',
    siteName: 'FlowUPI',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#05080E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
      </head>
      <body className="bg-bg text-txt-primary antialiased min-h-screen flex flex-col selection:bg-brand-cyan/30 selection:text-brand-cyan">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6">
          {children}
        </main>
        <OfflineBanner />
        <Footer />
      </body>
    </html>
  );
}

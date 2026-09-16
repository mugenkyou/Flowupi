import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { OfflineBanner } from '../components/OfflineBanner';

export const metadata: Metadata = {
  title: 'SplitUPI — 0% MDR Payment Micro-Tranching Web App',
  description: 'Educational Research & Algorithmic Simulation of UPI Micro-Tranching for 0% MDR Compliance',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SplitUPI',
  },
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg',
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
        <footer className="border-t border-border-subtle bg-bg-surface/50 py-6 text-center text-xs text-txt-muted">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>© 2026 SplitUPI Research · Local-First Web Application</span>
            <span className="text-[11px] text-txt-muted">
              Built for academic demonstration & algorithmic simulation of 0% MDR compliance under NPCI guidelines.
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}

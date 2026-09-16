import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { OfflineBanner } from '../components/OfflineBanner';
import { getWebSiteSchema, getSoftwareApplicationSchema } from '../lib/jsonld';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowupi.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'FlowUPI — Fast Local-First UPI Payment Utility',
    template: '%s | FlowUPI',
  },
  description: 'FlowUPI is a fast, local-first UPI payment utility for scanning QR codes, splitting payments into tranches, MDR calculations, and local history.',
  manifest: '/manifest.json',
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: '5w8gnos2EMpvOaxww-8unXKrbq22ddUe_Wd82N-liqA',
  },
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
    description: 'Scan UPI QR codes, split payments into sequential tranches, pay through your UPI app, and manage local payment history.',
    url: SITE_URL,
    siteName: 'FlowUPI',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'FlowUPI — Fast Local-First UPI Payment Utility',
    description: 'Scan UPI QR codes, split payments into sequential tranches, pay through your UPI app, and manage local payment history.',
  },
  robots: {
    index: true,
    follow: true,
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
  const websiteSchema = getWebSiteSchema();
  const appSchema = getSoftwareApplicationSchema();

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
        />
      </head>
      <body className="bg-bg text-txt-primary antialiased min-h-screen flex flex-col selection:bg-brand-cyan/30 selection:text-brand-cyan">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4BFKD44HFM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-4BFKD44HFM');
          `}
        </Script>
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

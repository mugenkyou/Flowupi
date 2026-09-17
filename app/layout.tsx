import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { OfflineBanner } from '../components/OfflineBanner';
import { getWebSiteSchema, getSoftwareApplicationSchema, getOrganizationSchema } from '../lib/jsonld';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowupi.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'FlowUPI — Instant UPI QR Payment & Bill Splitting Utility',
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
    icon: [
      { url: '/icons/favicon.ico' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
  openGraph: {
    title: 'FlowUPI — Instant UPI QR Payment & Bill Splitting Utility',
    description: 'Scan UPI QR codes, split payments into sequential tranches, pay through your UPI app, and manage local payment history.',
    url: SITE_URL,
    siteName: 'FlowUPI',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'FlowUPI — Instant UPI QR Payment & Bill Splitting Utility',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = getOrganizationSchema();
  const websiteSchema = getWebSiteSchema();
  const appSchema = getSoftwareApplicationSchema();

  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
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
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
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


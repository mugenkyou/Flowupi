import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowupi.app';

export const metadata: Metadata = {
  title: 'Scan UPI QR Code — Instant Camera & Image Scanner | FlowUPI',
  description: 'Scan merchant UPI QR codes, upload QR screenshots, or paste upi://pay intent links for fast sub-₹2,000 micro-tranche payment checkout.',
  alternates: {
    canonical: `${SITE_URL}/scan`,
  },
  openGraph: {
    title: 'Scan UPI QR Code — Instant Camera & Image Scanner | FlowUPI',
    description: 'Scan merchant UPI QR codes, upload QR screenshots, or paste upi://pay intent links for fast sub-₹2,000 micro-tranche payment checkout.',
    url: `${SITE_URL}/scan`,
    siteName: 'FlowUPI',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Scan UPI QR Code — Instant Camera & Image Scanner | FlowUPI',
    description: 'Scan merchant UPI QR codes, upload QR screenshots, or paste upi://pay intent links for fast sub-₹2,000 micro-tranche payment checkout.',
  },
};

export default function ScanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

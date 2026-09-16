import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowupi.vercel.app';

export const metadata: Metadata = {
  title: 'Group Bill Splitter — Equal & Itemized UPI Slice Cards | FlowUPI',
  description: 'Divide dining, event, or travel bills between friends into individual sub-₹2,000 UPI slice QR cards for instant payment sharing.',
  alternates: {
    canonical: `${SITE_URL}/group`,
  },
  openGraph: {
    title: 'Group Bill Splitter — Equal & Itemized UPI Slice Cards | FlowUPI',
    description: 'Divide dining, event, or travel bills between friends into individual sub-₹2,000 UPI slice QR cards for instant payment sharing.',
    url: `${SITE_URL}/group`,
    siteName: 'FlowUPI',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Group Bill Splitter — Equal & Itemized UPI Slice Cards | FlowUPI',
    description: 'Divide dining, event, or travel bills between friends into individual sub-₹2,000 UPI slice QR cards for instant payment sharing.',
  },
};

export default function GroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

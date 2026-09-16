import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowupi.vercel.app';

export const metadata: Metadata = {
  title: 'POS Bill Splitter — Counter Micro-Tranching Terminal | FlowUPI',
  description: 'Simulate retail merchant counter bill tranching into sub-₹2,000 slices for 100% MDR surcharge-free UPI payment settlement.',
  alternates: {
    canonical: `${SITE_URL}/pos`,
  },
  openGraph: {
    title: 'POS Bill Splitter — Counter Micro-Tranching Terminal | FlowUPI',
    description: 'Simulate retail merchant counter bill tranching into sub-₹2,000 slices for 100% MDR surcharge-free UPI payment settlement.',
    url: `${SITE_URL}/pos`,
    siteName: 'FlowUPI',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'POS Bill Splitter — Counter Micro-Tranching Terminal | FlowUPI',
    description: 'Simulate retail merchant counter bill tranching into sub-₹2,000 slices for 100% MDR surcharge-free UPI payment settlement.',
  },
};

export default function PosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

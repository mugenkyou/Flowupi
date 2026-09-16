import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowupi.vercel.app';

export const metadata: Metadata = {
  title: 'UPI MDR Calculator — Annual Surcharge Savings Estimator | FlowUPI',
  description: 'Calculate how much your business loses to payment gateway MDR fees every year, and estimate savings with sub-₹2,000 micro-tranching.',
  alternates: {
    canonical: `${SITE_URL}/calculator`,
  },
  openGraph: {
    title: 'UPI MDR Calculator — Annual Surcharge Savings Estimator | FlowUPI',
    description: 'Calculate how much your business loses to payment gateway MDR fees every year, and estimate savings with sub-₹2,000 micro-tranching.',
    url: `${SITE_URL}/calculator`,
    siteName: 'FlowUPI',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'UPI MDR Calculator — Annual Surcharge Savings Estimator | FlowUPI',
    description: 'Calculate how much your business loses to payment gateway MDR fees every year, and estimate savings with sub-₹2,000 micro-tranching.',
  },
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowupi.vercel.app';

export const metadata: Metadata = {
  title: 'Soundbox Audio Synthesizer — Hardware Confirmation Simulator | FlowUPI',
  description: 'Simulate Paytm and PhonePe hardware soundbox payment voice alert confirmations using client-side Web Audio API speech synthesis.',
  alternates: {
    canonical: `${SITE_URL}/soundbox`,
  },
  openGraph: {
    title: 'Soundbox Audio Synthesizer — Hardware Confirmation Simulator | FlowUPI',
    description: 'Simulate Paytm and PhonePe hardware soundbox payment voice alert confirmations using client-side Web Audio API speech synthesis.',
    url: `${SITE_URL}/soundbox`,
    siteName: 'FlowUPI',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Soundbox Audio Synthesizer — Hardware Confirmation Simulator | FlowUPI',
    description: 'Simulate Paytm and PhonePe hardware soundbox payment voice alert confirmations using client-side Web Audio API speech synthesis.',
  },
};

export default function SoundboxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

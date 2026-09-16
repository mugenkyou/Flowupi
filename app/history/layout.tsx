import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment History & Local Data Ledger | FlowUPI',
  description: 'View locally saved FlowUPI transaction records and export/import backup files.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

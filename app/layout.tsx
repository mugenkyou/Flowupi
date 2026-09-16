import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'SplitUPI — 0% MDR Payment Micro-Tranching Web App',
  description: 'Educational Research & Algorithmic Simulation of UPI Micro-Tranching for 0% MDR Compliance',
  themeColor: '#070B14',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg text-txt-primary antialiased min-h-screen flex flex-col selection:bg-brand-cyan/30 selection:text-brand-cyan">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6">
          {children}
        </main>
        <footer className="border-t border-border-subtle bg-bg-surface/50 py-6 text-center text-xs text-txt-muted">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>© 2026 SplitUPI Research · Open Source Fintech Project</span>
            <span className="text-[11px] text-txt-muted">
              Built for academic demonstration & algorithmic simulation of 0% MDR compliance under NPCI guidelines.
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}

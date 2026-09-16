import React from 'react';
import Link from 'next/link';
import { FlowUpiLogo } from '../components/FlowUpiLogo';
import { NeoPopButton } from '../components/NeoPopComponents';
import { Home, QrCode, AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <div className="w-full max-w-md border-[1.5px] border-border-subtle bg-bg-surface p-8 shadow-neo space-y-6">
        <div className="flex justify-center">
          <FlowUpiLogo size="lg" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 border border-status-error bg-status-error/15 px-3 py-1 text-xs font-black text-status-error uppercase tracking-wider shadow-neo-sm">
            <AlertCircle className="h-4 w-4" />
            <span>ERROR 404 • ROUTE NOT FOUND</span>
          </div>

          <h1 className="text-3xl font-black uppercase tracking-tight text-txt-primary pt-2">
            Flow Doesn&apos;t Exist
          </h1>

          <p className="text-xs font-bold text-txt-secondary leading-relaxed">
            The page or route you are looking for has been moved, removed, or doesn&apos;t exist in the FlowUPI application.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link href="/" className="w-full">
            <NeoPopButton variant="primary">
              <Home className="h-4 w-4" />
              <span>BACK TO HOME</span>
            </NeoPopButton>
          </Link>

          <Link href="/scan" className="w-full">
            <NeoPopButton variant="secondary">
              <QrCode className="h-4 w-4" />
              <span>SCAN / PAY</span>
            </NeoPopButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

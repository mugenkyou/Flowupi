'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { FlowUpiLogo } from '../components/FlowUpiLogo';
import { NeoPopButton } from '../components/NeoPopComponents';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error safely in client console
    console.error('FlowUPI Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <div className="w-full max-w-md border-[1.5px] border-border-subtle bg-bg-surface p-8 shadow-neo space-y-6">
        <div className="flex justify-center">
          <FlowUpiLogo size="lg" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 border border-status-warning bg-status-warning/15 px-3 py-1 text-xs font-black text-status-warning uppercase tracking-wider shadow-neo-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>RUNTIME UNHANDLED EXCEPTION</span>
          </div>

          <h1 className="text-2xl font-black uppercase tracking-tight text-txt-primary pt-2">
            Something Went Wrong
          </h1>

          <p className="text-xs font-bold text-txt-secondary leading-relaxed">
            FlowUPI encountered an unexpected error while loading this component. Your locally saved transaction data remains safe.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <NeoPopButton onClick={() => reset()} variant="primary">
            <RotateCcw className="h-4 w-4" />
            <span>TRY AGAIN</span>
          </NeoPopButton>

          <Link href="/" className="w-full">
            <NeoPopButton variant="surface">
              <Home className="h-4 w-4" />
              <span>GO HOME</span>
            </NeoPopButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

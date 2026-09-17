import React from 'react';
import { NeoPopBadge } from '../components/NeoPopComponents';
import { HomeScannerWorkstation } from '../components/HomeScannerWorkstation';

export default function HomePage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner - Rendered on Server for Immediate FCP & LCP */}
      <div className="border-b border-border-subtle pb-6">
        <div className="flex items-center gap-2 mb-2">
          <NeoPopBadge label="INSTANT SCAN & PAY" variant="primary" />
          <NeoPopBadge label="0% MDR COMPLIANT" variant="success" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-txt-primary tracking-tight">
          FlowUPI — Instant UPI QR Payment & Bill Splitting Utility
        </h1>
        <p className="text-xs font-bold text-txt-secondary mt-1 max-w-xl">
          FlowUPI • Fast, local-first UPI payment utility. Scan counter QR codes or import payment screenshots to initiate sub-₹2,000 micro-tranche surcharge-free checkout.
        </p>
      </div>

      {/* Interactive Payment & Scanner Workstation */}
      <HomeScannerWorkstation />
    </div>
  );
}


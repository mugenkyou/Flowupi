import React from 'react';
import { NeoPopBadge } from '../../components/NeoPopComponents';
import { HomeScannerWorkstation } from '../../components/HomeScannerWorkstation';

export default function ScanPayPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner - Server-rendered for Immediate FCP & LCP */}
      <div className="border-b border-border-subtle pb-6">
        <div className="flex items-center gap-2 mb-2">
          <NeoPopBadge label="INSTANT QR SCANNER" variant="primary" />
          <NeoPopBadge label="CAMERA & SCREENSHOT" variant="success" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-txt-primary tracking-tight">
          Scan UPI QR Code & Payment Workstation | FlowUPI
        </h1>
        <p className="text-xs font-bold text-txt-secondary mt-1 max-w-xl">
          Scan physical counter standees with your camera, upload gallery QR screenshots, or paste upi://pay intent links for instant checkout.
        </p>
      </div>

      {/* Interactive Payment & Scanner Workstation */}
      <HomeScannerWorkstation />
    </div>
  );
}

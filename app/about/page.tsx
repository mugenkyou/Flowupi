import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FlowUpiLogo } from '../../components/FlowUpiLogo';
import { NeoPopBadge, NeoPopButton } from '../../components/NeoPopComponents';
import { QrCode, Store, Users, Calculator, Volume2, ShieldCheck, Zap, ArrowRight, Lock } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowupi.vercel.app';

export const metadata: Metadata = {
  title: 'FlowUPI — About FlowUPI & Local-First UPI Utilities',
  description: 'Learn about FlowUPI, a fast, local-first UPI payment utility built for QR scanning, micro-tranching, MDR calculations, and client-side privacy.',
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: 'FlowUPI — About FlowUPI & Local-First UPI Utilities',
    description: 'Learn about FlowUPI, a fast, local-first UPI payment utility built for QR scanning, micro-tranching, MDR calculations, and client-side privacy.',
    url: `${SITE_URL}/about`,
    siteName: 'FlowUPI',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'FlowUPI — About FlowUPI & Local-First UPI Utilities',
    description: 'Learn about FlowUPI, a fast, local-first UPI payment utility built for QR scanning, micro-tranching, MDR calculations, and client-side privacy.',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header Banner */}
      <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-neo space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <FlowUpiLogo size="lg" />
          <NeoPopBadge label="LOCAL-FIRST WEB UTILITY" variant="primary" />
        </div>

        <p className="text-sm sm:text-base font-bold text-txt-secondary leading-relaxed pt-2">
          FlowUPI is a fast, tactile web application built around simple payment workflows: <span className="text-brand-cyan">Scan</span>, <span className="text-brand-cyan">Split</span>, <span className="text-brand-cyan">Pay</span>, and <span className="text-brand-cyan">Track</span>. Designed with a local-first architecture, it ensures zero sensitive data is stored on remote servers.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border-[1.5px] border-border-subtle bg-bg-elevated p-5 shadow-neo-sm space-y-2">
          <div className="flex h-10 w-10 items-center justify-center border border-brand-cyan bg-brand-cyan/15 text-brand-cyan">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-black uppercase text-txt-primary">Fast & Mobile-First</h3>
          <p className="text-xs text-txt-muted leading-relaxed">
            Optimized for fast mobile browser interaction, physical counter standee scanning, and desktop PWA support.
          </p>
        </div>

        <div className="border-[1.5px] border-border-subtle bg-bg-elevated p-5 shadow-neo-sm space-y-2">
          <div className="flex h-10 w-10 items-center justify-center border border-status-success bg-status-success/15 text-status-success">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-black uppercase text-txt-primary">Local-First Storage</h3>
          <p className="text-xs text-txt-muted leading-relaxed">
            All transaction history, saved groups, and user preferences remain strictly inside your device&apos;s local browser storage.
          </p>
        </div>

        <div className="border-[1.5px] border-border-subtle bg-bg-elevated p-5 shadow-neo-sm space-y-2">
          <div className="flex h-10 w-10 items-center justify-center border border-brand-blue bg-brand-blue/15 text-brand-blue">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-black uppercase text-txt-primary">Zero Credentials</h3>
          <p className="text-xs text-txt-muted leading-relaxed">
            No UPI PINs, bank passwords, OTPs, or authentication keys are ever requested or stored by FlowUPI.
          </p>
        </div>
      </div>

      {/* Feature Breakdown */}
      <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-neo space-y-6">
        <h2 className="text-base font-black uppercase tracking-wider text-txt-primary flex items-center gap-2">
          <span>FlowUPI Capabilities</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="border border-border-subtle bg-bg-elevated p-4 space-y-2">
            <div className="flex items-center gap-2 text-brand-cyan font-black">
              <QrCode className="h-4 w-4" />
              <span>Scan / Pay Workstation</span>
            </div>
            <p className="text-txt-muted leading-relaxed">
              Instant camera QR decoding, screenshot image import parsing, and standard NPCI `upi://pay` intent link parsing.
            </p>
          </div>

          <div className="border border-border-subtle bg-bg-elevated p-4 space-y-2">
            <div className="flex items-center gap-2 text-brand-cyan font-black">
              <Store className="h-4 w-4" />
              <span>POS Bill Splitter</span>
            </div>
            <p className="text-txt-muted leading-relaxed">
              Algorithmic micro-tranching for merchant invoices, generating sub-₹2,000 slices that satisfy 0% MDR tier guidelines.
            </p>
          </div>

          <div className="border border-border-subtle bg-bg-elevated p-4 space-y-2">
            <div className="flex items-center gap-2 text-brand-cyan font-black">
              <Users className="h-4 w-4" />
              <span>Group Bill Splitter</span>
            </div>
            <p className="text-txt-muted leading-relaxed">
              Organize group dinners, trips, and shared expenses, generating individual UPI payment deep links per participant.
            </p>
          </div>

          <div className="border border-border-subtle bg-bg-elevated p-4 space-y-2">
            <div className="flex items-center gap-2 text-brand-cyan font-black">
              <Calculator className="h-4 w-4" />
              <span>MDR Surcharge Calculator</span>
            </div>
            <p className="text-txt-muted leading-relaxed">
              Calculate estimated Merchant Discount Rate (MDR) savings across custom invoice sizes and annual transaction volumes.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-bold text-txt-muted">
            Ready to explore FlowUPI tools?
          </span>
          <Link href="/">
            <NeoPopButton variant="primary" fullWidth={false}>
              <span>TRY SCAN / PAY NOW</span>
              <ArrowRight className="h-4 w-4" />
            </NeoPopButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

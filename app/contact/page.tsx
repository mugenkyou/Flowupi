import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { NeoPopBadge, NeoPopButton } from '../../components/NeoPopComponents';
import { Mail, Github, MessageSquare, AlertCircle, ExternalLink, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FlowUPI — Contact Maintainers',
  description: 'Connect with FlowUPI project maintainers, report bugs, request features, or review official repository support channels.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'FlowUPI — Contact Maintainers',
    description: 'Connect with FlowUPI project maintainers, report bugs, request features, or review official repository support channels.',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-neo space-y-3">
        <div className="flex items-center gap-2 text-brand-cyan font-black">
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs uppercase tracking-wider">OFFICIAL SUPPORT CHANNELS</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black uppercase text-txt-primary tracking-tight">
          Contact Maintainers
        </h1>

        <p className="text-xs sm:text-sm font-bold text-txt-secondary leading-relaxed">
          FlowUPI is an open client-side web application. We encourage users, developers, and researchers to engage via our official repository channels.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* GitHub Issues Channel */}
        <div className="border-[1.5px] border-border-subtle bg-bg-elevated p-6 shadow-neo-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center border border-brand-cyan bg-brand-cyan/15 text-brand-cyan shadow-neo-sm">
              <Github className="h-5 w-5" />
            </div>

            <h2 className="text-sm font-black uppercase text-txt-primary">GitHub Issue Tracker</h2>

            <p className="text-xs text-txt-muted leading-relaxed">
              Report bugs, submit feature suggestions, or discuss technical improvements directly on the repository issue tracker.
            </p>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <NeoPopButton variant="primary">
              <span>OPEN GITHUB ISSUES</span>
              <ExternalLink className="h-4 w-4" />
            </NeoPopButton>
          </a>
        </div>

        {/* Security & Vulnerabilities Channel */}
        <div className="border-[1.5px] border-border-subtle bg-bg-elevated p-6 shadow-neo-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center border border-status-warning bg-status-warning/15 text-status-warning shadow-neo-sm">
              <AlertCircle className="h-5 w-5" />
            </div>

            <h2 className="text-sm font-black uppercase text-txt-primary">Security Vulnerabilities</h2>

            <p className="text-xs text-txt-muted leading-relaxed">
              For responsible disclosure of security findings, please consult our Security Policy document before opening public issues.
            </p>
          </div>

          <Link href="/security">
            <NeoPopButton variant="warning">
              <span>SECURITY POLICY</span>
              <ExternalLink className="h-4 w-4" />
            </NeoPopButton>
          </Link>
        </div>
      </div>

      {/* Notice Box */}
      <div className="border border-border-subtle bg-bg-surface p-5 shadow-neo text-xs text-txt-secondary space-y-2">
        <div className="flex items-center gap-2 font-black text-txt-primary uppercase">
          <HelpCircle className="h-4 w-4 text-brand-cyan" />
          <span>Note on Banking & Payment Support</span>
        </div>
        <p className="leading-relaxed">
          FlowUPI does not process, handle, or settle money transactions directly. For issues regarding specific bank account debits, failed UPI transfers, or merchant refunds, please contact your respective bank or UPI application provider (GPay, PhonePe, Paytm, BHIM).
        </p>
      </div>
    </div>
  );
}

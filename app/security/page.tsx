import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, HardDrive, AlertTriangle, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';
import { NeoPopBadge, NeoPopButton } from '../../components/NeoPopComponents';

export const metadata: Metadata = {
  title: 'FlowUPI — Security & Data Architecture',
  description: 'Technical overview of FlowUPI local-first security model, non-storage of sensitive bank credentials, QR code untrusted input sanitization, and vulnerability reporting.',
};

export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-neo space-y-3">
        <div className="flex items-center gap-2 text-status-success font-black text-xs uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4" />
          <span>SECURITY & ARCHITECTURE DISCLOSURE</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black uppercase text-txt-primary tracking-tight">
          FlowUPI Security Architecture
        </h1>

        <p className="text-xs sm:text-sm font-bold text-txt-secondary leading-relaxed">
          FlowUPI adheres to a strict local-first security philosophy. This page provides a transparent technical breakdown of our security model and data handling.
        </p>
      </div>

      {/* Security Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="border-[1.5px] border-border-subtle bg-bg-elevated p-5 shadow-neo-sm space-y-3">
          <div className="flex h-9 w-9 items-center justify-center border border-status-success bg-status-success/15 text-status-success">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-black uppercase text-txt-primary">Zero Sensitive Credentials</h3>
          <p className="text-txt-muted leading-relaxed">
            FlowUPI never requests, collects, or stores sensitive financial credentials such as UPI PINs, bank passwords, card CVVs, or OTPs. All payment authentication takes place strictly inside your bank&apos;s official UPI app.
          </p>
        </div>

        <div className="border-[1.5px] border-border-subtle bg-bg-elevated p-5 shadow-neo-sm space-y-3">
          <div className="flex h-9 w-9 items-center justify-center border border-brand-cyan bg-brand-cyan/15 text-brand-cyan">
            <HardDrive className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-black uppercase text-txt-primary">Client-Side Local Storage</h3>
          <p className="text-txt-muted leading-relaxed">
            Transaction history and group splits are stored locally in your browser (<code className="font-mono text-brand-cyan">localStorage</code>). Data never leaves your device unless you manually export a backup JSON file.
          </p>
        </div>

        <div className="border-[1.5px] border-border-subtle bg-bg-elevated p-5 shadow-neo-sm space-y-3">
          <div className="flex h-9 w-9 items-center justify-center border border-brand-blue bg-brand-blue/15 text-brand-blue">
            <Terminal className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-black uppercase text-txt-primary">Untrusted Input Sanitization</h3>
          <p className="text-txt-muted leading-relaxed">
            Scanned QR matrix strings and pasted URI parameters are treated as untrusted input. Input strings are strictly parsed for standard NPCI key-value parameters (<code className="font-mono text-brand-cyan">pa, pn, am, tn</code>) and rendered safely via React HTML escaping.
          </p>
        </div>

        <div className="border-[1.5px] border-border-subtle bg-bg-elevated p-5 shadow-neo-sm space-y-3">
          <div className="flex h-9 w-9 items-center justify-center border border-status-warning bg-status-warning/15 text-status-warning">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-black uppercase text-txt-primary">Transparent Boundaries</h3>
          <p className="text-txt-muted leading-relaxed">
            We maintain total technical honesty: browser local storage is convenient for utility tracking but is not equivalent to secure hardware-backed enclaves. Users remain responsible for device security.
          </p>
        </div>
      </div>

      {/* Reporting Vulnerabilities */}
      <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-neo space-y-4">
        <h2 className="text-base font-black uppercase tracking-wider text-txt-primary">
          Reporting Security Vulnerabilities
        </h2>

        <p className="text-xs text-txt-secondary leading-relaxed">
          We welcome responsible disclosure of potential security vulnerabilities. If you discover a security issue, please review our repository disclosure instructions or open an issue on GitHub.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-bold text-txt-muted">
            Consult root repository SECURITY.md guidelines.
          </span>
          <Link href="/contact">
            <NeoPopButton variant="primary" fullWidth={false}>
              <span>CONTACT VIA GITHUB ISSUES</span>
              <ArrowRight className="h-4 w-4" />
            </NeoPopButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

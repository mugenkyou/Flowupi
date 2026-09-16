import React from 'react';
import { Metadata } from 'next';
import { FileText, ShieldAlert, CheckCircle2, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FlowUPI — Terms of Use',
  description: 'FlowUPI Terms of Use detailing software utility scope, user responsibilities, local data handling, and distinction between link generation and bank payment execution.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'FlowUPI — Terms of Use',
    description: 'FlowUPI Terms of Use detailing software utility scope, user responsibilities, local data handling, and distinction between link generation and bank payment execution.',
    url: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-neo space-y-3">
        <div className="flex items-center gap-2 text-brand-cyan font-black text-xs uppercase tracking-wider">
          <FileText className="h-4 w-4" />
          <span>TERMS & CONDITIONS</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black uppercase text-txt-primary tracking-tight">
          FlowUPI Terms of Use
        </h1>

        <p className="text-xs sm:text-sm font-bold text-txt-secondary leading-relaxed">
          Last Updated: September 17, 2026
        </p>

        <p className="text-xs text-txt-muted leading-relaxed border-t border-border-subtle pt-3">
          Please read these Terms of Use carefully before accessing or using the FlowUPI web application.
        </p>
      </div>

      {/* Structured Terms Sections */}
      <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-neo space-y-8 text-xs text-txt-secondary leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-txt-primary uppercase tracking-wider">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using FlowUPI, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, you should not use the application.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2 border-t border-border-subtle pt-6">
          <h2 className="text-sm font-black text-txt-primary uppercase tracking-wider">
            2. Description of Application & Utility Scope
          </h2>
          <p>
            FlowUPI is a client-side web utility that provides QR code scanning, merchant VPA string parsing, sub-₹2,000 micro-tranche generation, group bill splitting tools, MDR calculations, and soundbox audio alerts.
          </p>
        </section>

        {/* Section 3 - CRITICAL LEGAL DISTINCTION */}
        <section className="space-y-2 border-t border-border-subtle pt-6 bg-status-warning/10 p-4 border border-status-warning/40 text-txt-primary">
          <h2 className="text-sm font-black uppercase tracking-wider text-status-warning flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            <span>3. Crucial Distinction: FlowUPI is NOT a Bank or Payment Gateway</span>
          </h2>
          <p className="text-xs text-txt-secondary leading-relaxed">
            FlowUPI merely generates standard NPCI compliant UPI intent URIs (<code className="font-mono text-brand-cyan">upi://pay</code>) and launches your mobile operating system&apos;s default UPI application.
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-txt-secondary pl-2 pt-1">
            <li>FlowUPI does NOT process, transmit, hold, or escrow funds.</li>
            <li>FlowUPI is NOT a payment aggregator, payment gateway, bank, or financial institution.</li>
            <li>All actual financial transfers occur exclusively between your bank and the merchant&apos;s bank through NPCI infrastructure via your chosen UPI application (GPay, PhonePe, Paytm, BHIM, etc.).</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-2 border-t border-border-subtle pt-6">
          <h2 className="text-sm font-black text-txt-primary uppercase tracking-wider">
            4. Local Confirmation &amp; &quot;Mark as Paid&quot;
          </h2>
          <p>
            The &quot;Mark as Paid&quot; control within FlowUPI is a user-controlled local state marker designed for tracking payment progress. Pressing &quot;Mark as Paid&quot; does NOT independently query NPCI or verify with your bank that money was successfully transferred. Users are responsible for verifying payment settlement inside their banking app.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2 border-t border-border-subtle pt-6">
          <h2 className="text-sm font-black text-txt-primary uppercase tracking-wider">
            5. User Responsibilities
          </h2>
          <p>When using FlowUPI, you agree:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-txt-muted">
            <li>To verify merchant VPA (<code className="font-mono text-brand-cyan">pa</code>) and payee name (<code className="font-mono text-brand-cyan">pn</code>) before completing payments in your UPI app.</li>
            <li>To manage your device security and browser local storage data.</li>
            <li>Not to use the application for illegal transactions, fraud, or deceptive practices.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-2 border-t border-border-subtle pt-6">
          <h2 className="text-sm font-black text-txt-primary uppercase tracking-wider">
            6. Disclaimer of Warranties & Limitation of Liability
          </h2>
          <p>
            FlowUPI is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without warranties of any kind, express or implied. Under no circumstances shall FlowUPI maintainers be liable for indirect, incidental, consequential, or banking-related damages arising from your use of the application.
          </p>
        </section>
      </div>
    </div>
  );
}

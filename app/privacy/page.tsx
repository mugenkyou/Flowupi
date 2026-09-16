import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, HardDrive, Camera, ExternalLink, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FlowUPI — Privacy Policy',
  description: 'FlowUPI Privacy Policy detailing local-first browser storage, client-side camera QR scanning, UPI deep links, and zero remote server credential storage.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-neo space-y-3">
        <div className="flex items-center gap-2 text-status-success font-black text-xs uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4" />
          <span>PRIVACY & DATA PROTECTION</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black uppercase text-txt-primary tracking-tight">
          FlowUPI Privacy Policy
        </h1>

        <p className="text-xs sm:text-sm font-bold text-txt-secondary leading-relaxed">
          Last Updated: September 17, 2026
        </p>

        <p className="text-xs text-txt-muted leading-relaxed border-t border-border-subtle pt-3">
          FlowUPI is designed from the ground up as a client-side, local-first web application. This policy accurately describes how data is handled within your browser and on your device.
        </p>
      </div>

      {/* Structured Policy Sections */}
      <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-neo space-y-8 text-xs text-txt-secondary leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-txt-primary uppercase tracking-wider flex items-center gap-2">
            <span>1. Overview</span>
          </h2>
          <p>
            FlowUPI provides tools for scanning UPI payment QR codes, calculating sub-₹2,000 micro-tranches, estimating MDR savings, and managing group splits. Because FlowUPI executes entirely inside your web browser, your data remains under your local control.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2 border-t border-border-subtle pt-6">
          <h2 className="text-sm font-black text-txt-primary uppercase tracking-wider flex items-center gap-2">
            <span>2. Data Stored Locally</span>
          </h2>
          <p>
            FlowUPI utilizes your browser&apos;s Web Storage API (<code className="bg-bg-elevated px-1.5 py-0.5 text-brand-cyan font-mono">localStorage</code>) to save:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-txt-muted">
            <li>Transaction history records (amounts, merchant names, VPAs, timestamps, tranche statuses)</li>
            <li>Group split details and participant lists</li>
            <li>User interface preferences</li>
          </ul>
          <p className="pt-1">
            This data is stored exclusively on your device and is not transmitted to any FlowUPI backend server.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2 border-t border-border-subtle pt-6">
          <h2 className="text-sm font-black text-txt-primary uppercase tracking-wider flex items-center gap-2">
            <Camera className="h-4 w-4 text-brand-cyan" />
            <span>3. Camera & QR Scanner Permissions</span>
          </h2>
          <p>
            When you use the Camera QR Scanner, FlowUPI requests access to your device camera via standard browser MediaDevices APIs. Camera video feeds are processed in real-time in memory purely to decode QR matrix code strings. Video frames are never recorded, saved, or uploaded.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2 border-t border-border-subtle pt-6">
          <h2 className="text-sm font-black text-txt-primary uppercase tracking-wider flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-brand-cyan" />
            <span>4. UPI Deep Links & External Apps</span>
          </h2>
          <p>
            When you click &quot;Pay via UPI App&quot;, FlowUPI generates a standard NPCI intent URI link formatted as <code className="bg-bg-elevated px-1.5 py-0.5 text-brand-cyan font-mono">upi://pay?pa=...</code>. Tapping this link invokes your operating system&apos;s native URI handler to launch your installed UPI payment application (e.g. GPay, PhonePe, Paytm, BHIM). Those applications process payments according to their own privacy policies and banking terms.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2 border-t border-border-subtle pt-6">
          <h2 className="text-sm font-black text-txt-primary uppercase tracking-wider flex items-center gap-2">
            <Lock className="h-4 w-4 text-status-success" />
            <span>5. What FlowUPI Never Collects</span>
          </h2>
          <p>FlowUPI does NOT collect, request, or store:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-txt-muted">
            <li>UPI PINs or bank account passwords</li>
            <li>Credit / debit card numbers or CVVs</li>
            <li>One-Time Passwords (OTPs)</li>
            <li>Aadhaar numbers or government identity numbers</li>
            <li>Biometric authentication data</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-2 border-t border-border-subtle pt-6">
          <h2 className="text-sm font-black text-txt-primary uppercase tracking-wider flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-brand-cyan" />
            <span>6. Data Retention, Export & Deletion</span>
          </h2>
          <p>
            You retain complete control over your stored records:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-txt-muted">
            <li><strong>Export:</strong> You can download your data as an unencrypted <code className="bg-bg-elevated px-1.5 py-0.5 text-brand-cyan font-mono">flowupi-backup.json</code> file at any time from the History page.</li>
            <li><strong>Deletion:</strong> You can clear individual transactions or clear all application data via the History page controls or by clearing site data in your browser settings.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-2 border-t border-border-subtle pt-6">
          <h2 className="text-sm font-black text-txt-primary uppercase tracking-wider flex items-center gap-2">
            <span>7. Changes to This Privacy Policy</span>
          </h2>
          <p>
            Any future updates to this policy will be reflected on this page with an updated &quot;Last Updated&quot; date.
          </p>
        </section>
      </div>
    </div>
  );
}

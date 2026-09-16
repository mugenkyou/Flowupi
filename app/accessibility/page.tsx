import React from 'react';
import { Metadata } from 'next';
import { Eye, Keyboard, Layout, MonitorCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FlowUPI — Accessibility Statement',
  description: 'FlowUPI Accessibility Statement describing semantic HTML controls, keyboard navigation, high contrast NeoPOP tokens, and screen reader usability.',
  alternates: {
    canonical: '/accessibility',
  },
  openGraph: {
    title: 'FlowUPI — Accessibility Statement',
    description: 'FlowUPI Accessibility Statement describing semantic HTML controls, keyboard navigation, high contrast NeoPOP tokens, and screen reader usability.',
    url: '/accessibility',
  },
};

export default function AccessibilityPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-neo space-y-3">
        <div className="flex items-center gap-2 text-brand-cyan font-black text-xs uppercase tracking-wider">
          <Eye className="h-4 w-4" />
          <span>INCLUSIVITY & COMPLIANCE GOALS</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black uppercase text-txt-primary tracking-tight">
          Accessibility Statement
        </h1>

        <p className="text-xs sm:text-sm font-bold text-txt-secondary leading-relaxed">
          FlowUPI aims to provide an accessible and inclusive web experience across diverse devices, screen sizes, input methods, and assistive technologies.
        </p>
      </div>

      {/* Accessibility Features Grid */}
      <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-neo space-y-8 text-xs text-txt-secondary leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-black text-txt-primary uppercase tracking-wider flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-brand-cyan" />
            <span>1. Keyboard Navigation & Focus Indicators</span>
          </h2>
          <p>
            All interactive elements—including primary navigation links, action buttons, forms, modal dialogs, and drawer triggers—are built with standard focus states (<code className="font-mono text-brand-cyan">focus:outline-none focus:border-brand-primary</code>) and support full keyboard navigation (Tab, Enter, Space, and Escape).
          </p>
        </section>

        <section className="space-y-2 border-t border-border-subtle pt-6">
          <h2 className="text-sm font-black text-txt-primary uppercase tracking-wider flex items-center gap-2">
            <Layout className="h-4 w-4 text-brand-cyan" />
            <span>2. High Contrast NeoPOP Visual System</span>
          </h2>
          <p>
            FlowUPI utilizes a high-contrast NeoPOP color palette (<code className="font-mono text-brand-cyan">#05080E</code> deep dark background, crisp white headings <code className="font-mono text-brand-cyan">#F4F7FB</code>, vibrant electric cyan <code className="font-mono text-brand-cyan">#35D6FF</code> accents, and bold tactile borders) engineered to maximize text legibility under varying lighting conditions and mobile outdoor counter environments.
          </p>
        </section>

        <section className="space-y-2 border-t border-border-subtle pt-6">
          <h2 className="text-sm font-black text-txt-primary uppercase tracking-wider flex items-center gap-2">
            <MonitorCheck className="h-4 w-4 text-brand-cyan" />
            <span>3. Responsive Mobile Touch Targets</span>
          </h2>
          <p>
            Touch surfaces, drawer links, and tranche payment buttons are designed with comfortable touch boundaries (minimum 44px to 48px height) to accommodate mobile screen interaction and reduce accidental taps.
          </p>
        </section>

        <section className="space-y-2 border-t border-border-subtle pt-6">
          <h2 className="text-sm font-black text-txt-primary uppercase tracking-wider flex items-center gap-2">
            <span>4. Feedback & Continuous Improvement</span>
          </h2>
          <p>
            We continuously refine our accessibility implementation. If you encounter any barriers while accessing FlowUPI or have suggestions for screen reader optimization, please connect with us via our official GitHub issue tracker.
          </p>
        </section>
      </div>
    </div>
  );
}

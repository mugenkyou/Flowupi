'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FlowUpiLogo } from './FlowUpiLogo';
import { Shield, Lock, ExternalLink } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  // Hide extensive footer on active camera/checkout flows if desired, but keep minimal footer
  const isScanOrCheckout = pathname === '/scan';

  return (
    <footer className="w-full border-t border-border-subtle bg-bg-surface/80 backdrop-blur-sm text-xs text-txt-secondary mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 space-y-8">
        {!isScanOrCheckout && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="space-y-3">
              <FlowUpiLogo size="sm" />
              <p className="text-xs text-txt-muted leading-relaxed">
                Fast, local-first UPI payment utility designed for merchant QR scanning, bill micro-tranching, MDR calculations, and audio soundbox simulation.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] font-bold text-status-success">
                <Shield className="h-3.5 w-3.5" />
                <span>100% Client-Side Local Storage</span>
              </div>
            </div>

            {/* Product Tools Column */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-txt-primary">
                Product Tools
              </h4>
              <ul className="space-y-1.5 font-bold">
                <li>
                  <Link href="/" className="hover:text-brand-primary transition-colors">
                    Scan / Pay
                  </Link>
                </li>
                <li>
                  <Link href="/pos" className="hover:text-brand-primary transition-colors">
                    POS Split Workstation
                  </Link>
                </li>
                <li>
                  <Link href="/group" className="hover:text-brand-primary transition-colors">
                    Group Bill Splitter
                  </Link>
                </li>
                <li>
                  <Link href="/calculator" className="hover:text-brand-primary transition-colors">
                    MDR Surcharge Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/soundbox" className="hover:text-brand-primary transition-colors">
                    Soundbox Synthesizer
                  </Link>
                </li>
                <li>
                  <Link href="/history" className="hover:text-brand-primary transition-colors">
                    Payment History & Backups
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-txt-primary">
                Resources
              </h4>
              <ul className="space-y-1.5 font-bold">
                <li>
                  <Link href="/help" className="hover:text-brand-primary transition-colors">
                    Help & FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-brand-primary transition-colors">
                    About FlowUPI
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-brand-primary transition-colors">
                    Contact Maintainers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Trust Column */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-txt-primary">
                Legal & Trust
              </h4>
              <ul className="space-y-1.5 font-bold">
                <li>
                  <Link href="/privacy" className="hover:text-brand-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-brand-primary transition-colors">
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-brand-primary transition-colors">
                    Security Architecture
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="hover:text-brand-primary transition-colors">
                    Financial Disclaimer
                  </Link>
                </li>
                <li>
                  <Link href="/accessibility" className="hover:text-brand-primary transition-colors">
                    Accessibility Statement
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border-subtle/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-txt-muted">
          <div className="flex items-center gap-2">
            <span>© 2026 FlowUPI • Local-First Web Application</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/privacy" className="hover:text-txt-primary">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-txt-primary">Terms</Link>
            <span>•</span>
            <Link href="/security" className="hover:text-txt-primary">Security</Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:text-txt-primary">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

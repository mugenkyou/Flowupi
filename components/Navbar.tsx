'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SplitUpiLogo } from './SplitUpiLogo';
import {
  QrCode,
  Store,
  Users,
  Calculator,
  Volume2,
  History,
  Info,
  Shield,
  X,
} from 'lucide-react';
import { QRScannerModal } from './QRScannerModal';
import { SplitOrder } from '../lib/types';
import { NeoPopButton } from './NeoPopComponents';

interface NavbarProps {
  onOrderCreated?: (order: SplitOrder) => void;
}

export function Navbar({ onOrderCreated }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Scan / Pay', icon: QrCode },
    { href: '/pos', label: 'POS Split', icon: Store },
    { href: '/group', label: 'Group Split', icon: Users },
    { href: '/calculator', label: 'MDR Roast', icon: Calculator },
    { href: '/soundbox', label: 'Soundbox', icon: Volume2 },
    { href: '/history', label: 'History', icon: History },
  ];

  const handleGlobalOrderCreated = (order: SplitOrder) => {
    if (onOrderCreated) {
      onOrderCreated(order);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('splitupi:order_created', { detail: order }));
    }
    if (pathname !== '/') {
      router.push('/');
    }
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-bg/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <SplitUpiLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 border-[1.5px] px-3 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                    isActive
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-neo-sm'
                      : 'border-transparent text-txt-secondary hover:border-border-subtle hover:text-txt-primary'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Top Bar Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScannerOpen(true)}
              title="Scan Merchant QR"
              className="flex items-center justify-center p-2 text-txt-primary hover:text-brand-primary transition-colors"
            >
              <QrCode className="h-5 w-5" />
            </button>

            <button
              onClick={() => setIsAboutDialogOpen(true)}
              title="MDR Rules & Guide"
              className="flex items-center justify-center p-2 text-txt-secondary hover:text-txt-primary transition-colors"
            >
              <Info className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Bottom Navigation Bar matching Flutter NavigationBar */}
        <div className="flex items-center justify-around border-t border-border-subtle bg-bg py-2 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                  isActive ? 'text-brand-primary' : 'text-txt-secondary'
                }`}
              >
                <div
                  className={`flex items-center justify-center rounded-full px-3 py-1 transition-all ${
                    isActive ? 'bg-brand-primary/20' : 'bg-transparent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Global QR Scanner Modal */}
      {isScannerOpen && (
        <QRScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onOrderCreated={handleGlobalOrderCreated}
        />
      )}

      {/* About 0% MDR Arbitrage Dialog matching Flutter _showAboutMdrDialog */}
      {isAboutDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/85 backdrop-blur-md">
          <div className="relative w-full max-w-md border-[1.5px] border-border-subtle bg-bg-surface p-6 shadow-neo space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-brand-primary" />
                <h3 className="text-base font-extrabold text-txt-primary">
                  The 0% MDR Arbitrage
                </h3>
              </div>
              <button
                onClick={() => setIsAboutDialogOpen(false)}
                className="text-txt-muted hover:text-txt-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-xs text-txt-secondary space-y-2 leading-relaxed">
              <p>• NPCI guidelines mandate interchange fees on merchant transactions exceeding ₹2,000.</p>
              <p>• Transactions of ₹2,000 or under remain 0% MDR compliant.</p>
              <p>• SplitUPI demonstrates algorithmic bill tranching to simulate surcharge-free transactions.</p>
            </div>

            <div className="border border-status-warning/40 bg-status-warning/10 p-3 text-[11px] font-bold text-status-warning flex items-start gap-2">
              <span className="text-base">⚖️</span>
              <div>
                DISCLAIMER: This application is designed strictly for educational, academic demonstration, and algorithmic simulation purposes.
              </div>
            </div>

            <NeoPopButton onClick={() => setIsAboutDialogOpen(false)} variant="primary">
              I UNDERSTAND
            </NeoPopButton>
          </div>
        </div>
      )}
    </>
  );
}

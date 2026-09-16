'use client';

import React, { useState, useEffect } from 'react';
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
  Menu,
  Home,
  ChevronRight,
  Smartphone,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { QRScannerModal } from './QRScannerModal';
import { SplitOrder } from '../lib/types';
import { NeoPopButton } from './NeoPopComponents';
import { usePwaInstall } from '../hooks/usePwaInstall';

interface NavbarProps {
  onOrderCreated?: (order: SplitOrder) => void;
}

export function Navbar({ onOrderCreated }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isInstallable, isStandalone, triggerInstall } = usePwaInstall();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'HOME', icon: Home },
    { href: '/', label: 'SCAN / PAY', icon: QrCode },
    { href: '/pos', label: 'POS SPLIT', icon: Store },
    { href: '/group', label: 'GROUP SPLIT', icon: Users },
    { href: '/calculator', label: 'MDR CALCULATOR', icon: Calculator },
    { href: '/soundbox', label: 'SOUNDBOX', icon: Volume2 },
    { href: '/history', label: 'HISTORY', icon: History },
  ];

  const desktopNavItems = [
    { href: '/', label: 'Scan / Pay', icon: QrCode },
    { href: '/pos', label: 'POS Split', icon: Store },
    { href: '/group', label: 'Group Split', icon: Users },
    { href: '/calculator', label: 'MDR Roast', icon: Calculator },
    { href: '/soundbox', label: 'Soundbox', icon: Volume2 },
    { href: '/history', label: 'History', icon: History },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

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

  const handleInstallClick = async () => {
    const success = await triggerInstall();
    if (!success && !isInstallable) {
      alert("To install SplitUPI on your device, open your browser menu (⋮ or Share) and select 'Add to Home Screen' or 'Install App'.");
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
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
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

          {/* Top Bar Actions & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-1.5 border-[1.5px] border-brand-primary bg-brand-primary/10 px-2.5 py-1.5 text-xs font-black text-brand-primary shadow-neo-sm hover:bg-brand-primary/20 active:translate-x-[1px] active:translate-y-[1px]"
            >
              <QrCode className="h-4 w-4" />
              <span className="text-[11px] font-black tracking-wider hidden xs:inline">SCAN</span>
            </button>

            {!isStandalone && (
              <button
                onClick={handleInstallClick}
                title="Install SplitUPI Web App"
                className="hidden md:flex items-center gap-1.5 border border-border-subtle bg-bg-elevated px-2.5 py-1.5 text-xs font-black text-txt-secondary hover:text-brand-primary hover:border-brand-primary transition-all"
              >
                <Smartphone className="h-4 w-4 text-brand-primary" />
                <span className="text-[10px] font-black tracking-wider uppercase">INSTALL</span>
              </button>
            )}

            <button
              onClick={() => setIsAboutDialogOpen(true)}
              title="MDR Rules & Guide"
              className="flex h-8 w-8 items-center justify-center border border-border-subtle bg-bg-elevated text-txt-secondary hover:text-txt-primary transition-colors"
            >
              <Info className="h-4 w-4" />
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open Navigation Menu"
              className="flex h-9 w-9 items-center justify-center border-[1.5px] border-border-subtle bg-bg-surface text-txt-primary shadow-neo-sm hover:border-brand-primary md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Right-Side Navigation Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          {/* Dimmed Backdrop */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-bg/80 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-in Drawer Container */}
          <div className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col border-l-[1.5px] border-border-subtle bg-bg-surface shadow-2xl transition-transform">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border-subtle p-4 bg-bg-elevated">
              <SplitUpiLogo size="sm" />
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center border border-border-subtle text-txt-secondary hover:border-brand-primary hover:text-txt-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-3 space-y-1">
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = pathname === item.href && (item.label !== 'HOME' || idx === 0);

                return (
                  <Link
                    key={`${item.label}-${idx}`}
                    href={item.href}
                    onClick={() => setIsDrawerOpen(false)}
                    className={`flex items-center justify-between min-h-[48px] px-5 py-3 text-xs font-black uppercase tracking-wider transition-all border-l-4 ${
                      isActive
                        ? 'border-brand-primary bg-brand-primary/15 text-brand-primary shadow-neo-sm'
                        : 'border-transparent text-txt-secondary hover:bg-bg-elevated hover:text-txt-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-brand-primary' : 'text-txt-muted'}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-txt-muted opacity-60" />
                  </Link>
                );
              })}
            </nav>

            {/* PWA Install Button in Drawer */}
            {isStandalone ? (
              <div className="px-5 py-3 border-t border-border-subtle bg-status-success/10 flex items-center justify-between text-xs font-black text-status-success">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> APP INSTALLED
                </span>
                <span className="text-[10px] font-bold text-txt-muted uppercase">STANDALONE</span>
              </div>
            ) : (
              <button
                onClick={async () => {
                  setIsDrawerOpen(false);
                  await handleInstallClick();
                }}
                className="w-full flex items-center justify-between min-h-[48px] px-5 py-3 text-xs font-black uppercase tracking-wider text-brand-primary border-t border-border-subtle bg-brand-primary/10 hover:bg-brand-primary/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-brand-primary" />
                  <span>INSTALL WEB APP</span>
                </div>
                <Download className="h-4 w-4 text-brand-primary" />
              </button>
            )}

            {/* Drawer Footer */}
            <div className="border-t border-border-subtle p-4 bg-bg-elevated/50 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-txt-muted">
                SplitUPI • 0% MDR Payment Engine
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Global QR Scanner Modal */}
      {isScannerOpen && (
        <QRScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScannedPayload={(payload) => {
            setIsScannerOpen(false);
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('splitupi:qr_scanned', { detail: payload }));
            }
            if (pathname !== '/') {
              router.push('/');
            }
          }}
          onOrderCreated={handleGlobalOrderCreated}
        />
      )}

      {/* About 0% MDR Arbitrage Dialog */}
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

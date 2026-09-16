'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  QrCode,
  Upload,
  Camera,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  RotateCcw,
  Store,
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { parseUpiUri, createTrancheOrder } from '../lib/splitEngine';
import { SplitOrder } from '../lib/types';
import { saveOrder } from '../lib/storage';
import { QRScannerModal } from '../components/QRScannerModal';
import { SplitCheckoutModal } from '../components/SplitCheckoutModal';
import { NeoPopBadge, NeoPopButton } from '../components/NeoPopComponents';

export default function HomePage() {
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [pastedUri, setPastedUri] = useState<string>('');

  // Pending parsed payload if amount is missing
  const [pendingParsedData, setPendingParsedData] = useState<{
    pa: string;
    pn: string;
    note: string;
  } | null>(null);
  const [customAmount, setCustomAmount] = useState<number>(3850);

  // Active generated order for checkout
  const [activeOrder, setActiveOrder] = useState<SplitOrder | null>(null);

  const processDecodedResult = (rawData: string) => {
    setErrorMsg('');
    const parsed = parseUpiUri(rawData);

    if (!parsed.pa) {
      setErrorMsg('INVALID UPI QR: The scanned image or code does not contain a valid merchant UPI VPA.');
      return;
    }

    const amt = parsed.am ? parseFloat(parsed.am) : 0;

    if (amt > 0) {
      // Valid QR with amount -> create tranche order & launch checkout immediately
      const order = createTrancheOrder({
        totalAmount: amt,
        merchantVpa: parsed.pa,
        merchantName: parsed.pn || 'Merchant',
        note: parsed.tn || 'Scan & Pay Checkout',
      });
      saveOrder(order);
      setActiveOrder(order);
      setPendingParsedData(null);
    } else {
      // Valid QR without amount -> prompt user for invoice total
      setPendingParsedData({
        pa: parsed.pa,
        pn: parsed.pn || 'Merchant',
        note: parsed.tn || 'Scan & Pay Checkout',
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setErrorMsg('');
      const html5QrCode = new Html5Qrcode('home-file-reader');
      const result = await html5QrCode.scanFile(file, true);
      processDecodedResult(result);
    } catch (_) {
      setErrorMsg('COULD NOT DECODE QR: Unable to detect a valid UPI QR code in the uploaded image file.');
    }
  };

  const handleCreatePendingOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pendingParsedData || customAmount <= 0) return;

    const order = createTrancheOrder({
      totalAmount: customAmount,
      merchantVpa: pendingParsedData.pa,
      merchantName: pendingParsedData.pn,
      note: pendingParsedData.note,
    });

    saveOrder(order);
    setActiveOrder(order);
    setPendingParsedData(null);
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedUri.trim()) return;
    processDecodedResult(pastedUri);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hidden container for image decoding */}
      <div id="home-file-reader" className="hidden" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <NeoPopBadge label="INSTANT SCAN & PAY" variant="primary" />
            <NeoPopBadge label="0% MDR COMPLIANT" variant="success" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-txt-primary tracking-tight">
            Scan & Pay Merchant UPI QR
          </h1>
          <p className="text-xs font-bold text-txt-secondary mt-1 max-w-xl">
            Scan counter QR codes or import payment screenshots to initiate sub-₹2,000 micro-tranche surcharge-free checkout.
          </p>
        </div>

        <Link href="/pos">
          <NeoPopButton variant="secondary" fullWidth={false}>
            <Store className="h-4 w-4" />
            <span>POS COUNTER REGISTER</span>
          </NeoPopButton>
        </Link>
      </div>

      {/* Error Alert Box */}
      {errorMsg && (
        <div className="border-[1.5px] border-status-error bg-status-error/10 p-4 shadow-neo-error space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-status-error uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> {errorMsg}
            </span>
          </div>
          <NeoPopButton onClick={() => setErrorMsg('')} variant="surface" fullWidth={false}>
            <RotateCcw className="h-4 w-4" /> TRY AGAIN
          </NeoPopButton>
        </div>
      )}

      {/* Missing Amount Input Prompt */}
      {pendingParsedData && (
        <div className="border-[1.5px] border-brand-primary bg-bg-surface p-6 shadow-neo-brand space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-brand-primary" />
              <h3 className="text-sm font-black uppercase tracking-wider text-txt-primary">
                Merchant Recognized: {pendingParsedData.pn}
              </h3>
            </div>
            <NeoPopBadge label={pendingParsedData.pa} variant="secondary" />
          </div>

          <form onSubmit={handleCreatePendingOrder} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-txt-secondary mb-1">
                Enter Invoice Total Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-lg font-black text-txt-muted">₹</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(parseFloat(e.target.value) || 0)}
                  className="w-full border-[1.5px] border-border-subtle bg-bg-elevated py-2.5 pl-8 pr-3 text-xl font-black text-txt-primary focus:border-brand-primary focus:outline-none shadow-neo-sm"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[1500, 2450, 3850, 6800, 12500].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setCustomAmount(preset)}
                  className="border border-border-subtle bg-bg-elevated px-3 py-1.5 text-xs font-black text-txt-secondary hover:text-txt-primary shadow-neo-sm"
                >
                  ₹{preset.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <NeoPopButton type="submit" variant="primary">
              <Zap className="h-4 w-4" /> CONFIRM AMOUNT & TRANCHE BILL
            </NeoPopButton>
          </form>
        </div>
      )}

      {/* Main 2-Column Action Workstation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option 1: Live Camera Scan */}
        <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 shadow-neo flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary">
                PRIMARY ENTRY
              </span>
              <NeoPopBadge label="CAMERA" variant="primary" />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex h-12 w-12 items-center justify-center border-[1.5px] border-brand-primary bg-brand-primary/10 text-brand-primary shadow-neo-sm">
                <QrCode className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-txt-primary uppercase tracking-tight">
                  Scan With Camera
                </h3>
                <p className="text-xs font-bold text-txt-secondary">
                  Point device camera at any physical QR counter code
                </p>
              </div>
            </div>

            <p className="text-xs text-txt-muted leading-relaxed">
              Supports GPay, PhonePe, Paytm, BHIM, and all NPCI BharatQR physical standees and printed invoices.
            </p>
          </div>

          <NeoPopButton
            onClick={() => setIsCameraOpen(true)}
            variant="primary"
          >
            <Camera className="h-4 w-4" /> SCAN WITH CAMERA
          </NeoPopButton>
        </div>

        {/* Option 2: Import Screenshot / Image */}
        <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 shadow-neo flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-txt-secondary">
                SECONDARY ENTRY
              </span>
              <NeoPopBadge label="SCREENSHOT" variant="secondary" />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex h-12 w-12 items-center justify-center border-[1.5px] border-border-subtle bg-bg-elevated text-txt-primary shadow-neo-sm">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-txt-primary uppercase tracking-tight">
                  Import QR Image
                </h3>
                <p className="text-xs font-bold text-txt-secondary">
                  Upload screenshot or image file from your device
                </p>
              </div>
            </div>

            <p className="text-xs text-txt-muted leading-relaxed">
              Supports PNG, JPG, JPEG, and WebP payment QR screenshots saved in your gallery or files.
            </p>
          </div>

          <label className="cursor-pointer block">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <NeoPopButton variant="secondary">
              <Upload className="h-4 w-4" /> IMPORT QR SCREENSHOT
            </NeoPopButton>
          </label>
        </div>
      </div>

      {/* Side Feature Banner: POS Counter Register Mode */}
      <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 shadow-neo space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-border-subtle bg-bg-elevated text-txt-primary shadow-neo-sm">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-txt-primary">
                Side Feature: POS Counter Register Mode
              </h3>
              <p className="text-xs font-bold text-txt-secondary">
                Enter custom bill amounts, set Kirana presets, and test sub-₹2,000 tranching without scanning.
              </p>
            </div>
          </div>

          <Link href="/pos">
            <NeoPopButton variant="surface" fullWidth={false}>
              <span>OPEN POS TERMINAL</span>
              <ArrowRight className="h-4 w-4" />
            </NeoPopButton>
          </Link>
        </div>

        {/* Option 3: Manual UPI URI Paste Box */}
        <div className="space-y-3 pt-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-txt-secondary flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-brand-primary" /> Or Paste Raw UPI Intent Link Directly
          </span>

          <form onSubmit={handlePasteSubmit} className="space-y-3">
            <textarea
              rows={2}
              value={pastedUri}
              onChange={(e) => setPastedUri(e.target.value)}
              placeholder="upi://pay?pa=merchant@upi&pn=MerchantName&am=6800..."
              className="w-full border border-border-subtle bg-bg-elevated p-3 text-xs text-txt-primary font-mono placeholder:text-txt-muted focus:border-brand-primary focus:outline-none"
            />

            <NeoPopButton type="submit" variant="surface">
              <span>PARSE & PROCESS UPI LINK</span>
              <ArrowRight className="h-4 w-4" />
            </NeoPopButton>
          </form>
        </div>
      </div>

      {/* Camera Scanner Modal */}
      {isCameraOpen && (
        <QRScannerModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onOrderCreated={(order) => {
            setIsCameraOpen(false);
            setActiveOrder(order);
          }}
        />
      )}

      {/* Step-by-Step Checkout Modal */}
      {activeOrder && (
        <SplitCheckoutModal
          order={activeOrder}
          isOpen={!!activeOrder}
          onClose={() => setActiveOrder(null)}
        />
      )}
    </div>
  );
}

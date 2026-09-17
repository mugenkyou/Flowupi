'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  QrCode,
  Upload,
  Camera,
  AlertCircle,
  Zap,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Edit3,
  Loader2,
} from 'lucide-react';
import { parseUpiUri, createTrancheOrder } from '../lib/splitEngine';
import { SplitOrder } from '../lib/types';
import { saveOrder } from '../lib/storage';
import { ScannedPayload } from './QRScannerModal';
import { NeoPopBadge, NeoPopButton } from './NeoPopComponents';

const QRScannerModal = dynamic(
  () => import('./QRScannerModal').then((mod) => mod.QRScannerModal),
  { ssr: false }
);

const SplitCheckoutModal = dynamic(
  () => import('./SplitCheckoutModal').then((mod) => mod.SplitCheckoutModal),
  { ssr: false }
);

export function HomeScannerWorkstation() {
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [pastedUri, setPastedUri] = useState<string>('');
  const [paymentContext, setPaymentContext] = useState<ScannedPayload | null>(null);
  const [amountInput, setAmountInput] = useState<string>('');
  const [activeOrder, setActiveOrder] = useState<SplitOrder | null>(null);
  const [isDecodingFile, setIsDecodingFile] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleQrScannedEvent = (e: Event) => {
      const customEvt = e as CustomEvent<ScannedPayload>;
      if (customEvt.detail) {
        setPaymentContext(customEvt.detail);
        setAmountInput(customEvt.detail.qrAmount ? String(customEvt.detail.qrAmount) : '');
      }
    };

    window.addEventListener('flowupi:qr_scanned', handleQrScannedEvent);
    window.addEventListener('splitupi:qr_scanned', handleQrScannedEvent);
    return () => {
      window.removeEventListener('flowupi:qr_scanned', handleQrScannedEvent);
      window.removeEventListener('splitupi:qr_scanned', handleQrScannedEvent);
    };
  }, []);

  const processDecodedResult = (rawData: string) => {
    setErrorMsg('');
    const parsed = parseUpiUri(rawData);

    if (!parsed.pa) {
      setErrorMsg('INVALID UPI QR: Scanned code does not contain a valid merchant UPI VPA.');
      return;
    }

    const qrAmt =
      parsed.am && !isNaN(parseFloat(parsed.am)) && parseFloat(parsed.am) > 0
        ? parseFloat(parsed.am)
        : undefined;

    const payload: ScannedPayload = {
      pa: parsed.pa,
      pn: parsed.pn || 'Merchant',
      note: parsed.tn || 'FlowUPI Checkout',
      qrAmount: qrAmt,
    };

    setPaymentContext(payload);
    setAmountInput(qrAmt ? String(qrAmt) : '');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setErrorMsg('');
      setIsDecodingFile(true);
      const { decodeQrFromImageFile } = await import('../lib/qrDecoder');
      const result = await decodeQrFromImageFile(file);
      processDecodedResult(result);
    } catch (err: any) {
      if (err?.message === 'INVALID_FILE_TYPE') {
        setErrorMsg('INVALID FILE FORMAT: Please select a valid image file (PNG, JPG, WebP).');
      } else {
        setErrorMsg('COULD NOT DECODE QR: Unable to detect a valid UPI QR code in the uploaded image file. Try a clearer image or scan with camera.');
      }
    } finally {
      setIsDecodingFile(false);
      e.target.value = '';
    }
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedUri.trim()) return;
    processDecodedResult(pastedUri);
  };

  const handleProceedToSplit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!paymentContext) return;

    const cleanedStr = amountInput.replace(/[^0-9.]/g, '');
    const numAmount = parseFloat(cleanedStr);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('ENTER A VALID AMOUNT: Please enter a payment amount greater than ₹0.');
      return;
    }

    const order = createTrancheOrder({
      totalAmount: numAmount,
      merchantVpa: paymentContext.pa,
      merchantName: paymentContext.pn,
      note: paymentContext.note,
    });

    saveOrder(order);
    setActiveOrder(order);
  };

  const cleanedAmountStr = amountInput.replace(/[^0-9.]/g, '');
  const parsedAmountNum = parseFloat(cleanedAmountStr);
  const isAmountValid = !isNaN(parsedAmountNum) && isFinite(parsedAmountNum) && parsedAmountNum > 0;

  return (
    <>
      {/* Hidden container for image decoding */}
      <div id="home-file-reader" className="hidden" />

      {/* Error Alert Box */}
      {errorMsg && (
        <div className="border-[1.5px] border-status-error bg-status-error/10 p-4 shadow-neo-error space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-status-error uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> {errorMsg}
            </span>
          </div>
          <NeoPopButton onClick={() => setErrorMsg('')} variant="surface" fullWidth={false} aria-label="Dismiss error notification">
            <RotateCcw className="h-4 w-4" /> DISMISS
          </NeoPopButton>
        </div>
      )}

      {/* STEP 2: DEDICATED PAYMENT DETAILS VIEW */}
      {paymentContext ? (
        <div className="border-[1.5px] border-brand-primary bg-bg-surface p-6 sm:p-8 shadow-neo-brand space-y-6">
          {/* Back button & Header */}
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <button
              type="button"
              aria-label="Back to scanner entry options"
              onClick={() => {
                setPaymentContext(null);
                setAmountInput('');
              }}
              className="flex items-center gap-1.5 text-xs font-black text-txt-secondary hover:text-brand-primary transition-colors border border-border-subtle px-3 py-2 bg-bg-elevated shadow-neo-sm min-h-[44px]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>← BACK TO SCANNER</span>
            </button>

            <NeoPopBadge label="PAYMENT DETAILS" variant="primary" />
          </div>

          {/* Payee Info Box */}
          <div className="border-[1.5px] border-border-subtle bg-bg-elevated p-5 shadow-neo-sm space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-txt-muted">
              Scanned Merchant Payee
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-black text-txt-primary tracking-tight">
                  {paymentContext.pn}
                </h2>
                <p className="text-xs font-bold text-brand-primary font-mono mt-0.5">
                  {paymentContext.pa}
                </p>
              </div>

              {paymentContext.note && (
                <div className="text-[11px] font-bold text-txt-secondary bg-bg-surface px-2.5 py-1 border border-border-subtle">
                  Note: {paymentContext.note}
                </div>
              )}
            </div>
          </div>

          {/* Amount Entry Workstation */}
          <form onSubmit={handleProceedToSplit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="payment-amount-input" className="block text-xs font-black uppercase tracking-wider text-txt-primary">
                  Payment Amount (₹)
                </label>
                {paymentContext.qrAmount ? (
                  <span className="text-[10px] font-black text-status-success uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Pre-filled from QR (Editable)
                  </span>
                ) : (
                  <span className="text-[10px] font-black text-brand-cyan uppercase tracking-wider flex items-center gap-1">
                    <Edit3 className="h-3 w-3" /> Enter Amount to Pay
                  </span>
                )}
              </div>

              <div className="relative">
                <span className="absolute left-4 top-3.5 text-2xl font-black text-txt-muted">₹</span>
                <input
                  id="payment-amount-input"
                  type="text"
                  inputMode="decimal"
                  value={amountInput}
                  onChange={(e) => {
                    setAmountInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="0.00"
                  className="w-full border-[2px] border-border-subtle bg-bg-elevated py-3.5 pl-10 pr-4 text-3xl font-black text-txt-primary focus:border-brand-primary focus:outline-none shadow-neo"
                  required
                  autoFocus
                />
              </div>
              <p className="text-[11px] font-bold text-txt-muted">
                Enter the total invoice bill amount to tranche into sub-₹2,000 MDR-free slices.
              </p>
            </div>

            {/* Submit Button */}
            <NeoPopButton
              type="submit"
              onClick={(e) => handleProceedToSplit(e)}
              disabled={!isAmountValid}
              variant={isAmountValid ? 'primary' : 'surface'}
            >
              {isAmountValid ? (
                <>
                  <Zap className="h-5 w-5" /> CONTINUE TO SPLIT BILL (₹{parsedAmountNum.toLocaleString('en-IN')})
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-status-error" /> ENTER A VALID AMOUNT TO CONTINUE
                </>
              )}
            </NeoPopButton>
          </form>
        </div>
      ) : (
        /* STEP 1: SCANNER & IMPORT ENTRY WORKSTATION */
        <>
          <h2 className="sr-only">Select Payment Entry Method</h2>
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
                aria-label="Scan QR code with camera"
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

              <div>
                <input
                  ref={fileInputRef}
                  id="home-qr-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Upload QR screenshot file"
                />
                <NeoPopButton
                  variant="secondary"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isDecodingFile}
                >
                  {isDecodingFile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> DECODING QR SCREENSHOT...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" /> IMPORT QR SCREENSHOT
                    </>
                  )}
                </NeoPopButton>
              </div>
            </div>
          </div>

          {/* Option 3: Manual UPI URI Paste Box */}
          <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 shadow-neo space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-txt-secondary flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-brand-primary" /> Or Paste Raw UPI Intent Link Directly
            </span>

            <form onSubmit={handlePasteSubmit} className="space-y-3">
              <label htmlFor="raw-upi-paste-input" className="sr-only">
                Paste Raw UPI Intent URI
              </label>
              <textarea
                id="raw-upi-paste-input"
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
        </>
      )}

      {/* Camera Scanner Modal */}
      {isCameraOpen && (
        <QRScannerModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onScannedPayload={(payload) => {
            setIsCameraOpen(false);
            setPaymentContext(payload);
            setAmountInput(payload.qrAmount ? String(payload.qrAmount) : '');
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
    </>
  );
}

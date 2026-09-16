'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Flashlight,
  ShieldCheck,
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { parseUpiUri, createTrancheOrder } from '../lib/splitEngine';
import { SplitOrder } from '../lib/types';
import { saveOrder } from '../lib/storage';
import { ScannedPayload } from '../components/QRScannerModal';
import { SplitCheckoutModal } from '../components/SplitCheckoutModal';
import { NeoPopBadge, NeoPopButton } from '../components/NeoPopComponents';

export default function HomePage() {
  // Camera & Scanner States
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isStartingCamera, setIsStartingCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);

  // General error alert
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [pastedUri, setPastedUri] = useState<string>('');

  // Payment context for decoded QR payload
  const [paymentContext, setPaymentContext] = useState<ScannedPayload | null>(null);
  const [amountInput, setAmountInput] = useState<string>('');

  // Active generated order for checkout modal
  const [activeOrder, setActiveOrder] = useState<SplitOrder | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Listen for global custom events
  useEffect(() => {
    const handleQrScannedEvent = (e: Event) => {
      const customEvt = e as CustomEvent<ScannedPayload>;
      if (customEvt.detail) {
        stopCamera();
        setPaymentContext(customEvt.detail);
        setAmountInput(customEvt.detail.qrAmount ? String(customEvt.detail.qrAmount) : '');
      }
    };

    window.addEventListener('flowupi:qr_scanned', handleQrScannedEvent);
    window.addEventListener('splitupi:qr_scanned', handleQrScannedEvent);
    return () => {
      window.removeEventListener('flowupi:qr_scanned', handleQrScannedEvent);
      window.removeEventListener('splitupi:qr_scanned', handleQrScannedEvent);
      stopCamera();
    };
  }, []);

  // Initialize live camera on mount if not in payment context
  useEffect(() => {
    if (!paymentContext && !isCameraActive && !isStartingCamera && !cameraError) {
      startCamera();
    }
  }, [paymentContext]);

  const startCamera = async () => {
    try {
      setCameraError('');
      setErrorMsg('');
      setIsStartingCamera(true);

      const html5QrCode = new Html5Qrcode('home-camera-viewport');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 15, qrbox: { width: 230, height: 230 } },
        (decodedText) => {
          processDecodedResult(decodedText);
        },
        () => {}
      );

      setIsCameraActive(true);
      setIsStartingCamera(false);

      // Check if torch track constraint is supported
      try {
        // @ts-ignore
        const videoTrack = html5QrCode.getRunningTrack?.();
        if (videoTrack) {
          // @ts-ignore
          const capabilities = videoTrack.getCapabilities?.() || {};
          setHasTorch(!!capabilities.torch);
        }
      } catch (_) {}
    } catch (err: unknown) {
      setIsStartingCamera(false);
      setIsCameraActive(false);
      setCameraError('Camera access unavailable. You can import a QR image instead.');
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (_) {}
      scannerRef.current = null;
    }
    setIsCameraActive(false);
    setIsTorchOn(false);
  };

  const toggleTorch = async () => {
    if (scannerRef.current && hasTorch) {
      try {
        // @ts-ignore
        const videoTrack = scannerRef.current.getRunningTrack?.();
        if (videoTrack) {
          const nextState = !isTorchOn;
          // @ts-ignore
          await videoTrack.applyConstraints({ advanced: [{ torch: nextState }] });
          setIsTorchOn(nextState);
        }
      } catch (_) {}
    }
  };

  const processDecodedResult = (rawData: string) => {
    setErrorMsg('');
    const parsed = parseUpiUri(rawData);

    if (!parsed.pa) {
      setErrorMsg('INVALID UPI QR: Code does not contain a valid merchant UPI VPA.');
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

    stopCamera();
    setPaymentContext(payload);
    setAmountInput(qrAmt ? String(qrAmt) : '');
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

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedUri.trim()) return;
    processDecodedResult(pastedUri);
  };

  const handleProceedToSplit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!paymentContext) return;

    const numAmount = parseFloat(amountInput);
    if (isNaN(numAmount) || numAmount <= 0 || !isFinite(numAmount)) {
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

  const parsedAmountNum = parseFloat(amountInput);
  const isAmountValid =
    !isNaN(parsedAmountNum) && isFinite(parsedAmountNum) && parsedAmountNum > 0;

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-8">
      {/* Hidden file reader element */}
      <div id="home-file-reader" className="hidden" />

      {/* Header Banner */}
      <div className="border-b border-border-subtle pb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <NeoPopBadge label="FAST UPI UTILITY" variant="primary" />
            <NeoPopBadge label="0% MDR" variant="success" />
          </div>
          <span className="text-[10px] font-black text-txt-muted uppercase tracking-wider">
            FlowUPI v1.0
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-txt-primary tracking-tight">
          {paymentContext ? 'Confirm Payment Details' : 'Scan UPI QR'}
        </h1>
        <p className="text-xs font-bold text-txt-secondary mt-0.5">
          {paymentContext
            ? 'Review merchant details & enter total invoice bill amount.'
            : 'Point your camera at any UPI counter standee code.'}
        </p>
      </div>

      {/* Global Error Banner */}
      {errorMsg && (
        <div className="border-[1.5px] border-status-error bg-status-error/10 p-4 shadow-neo-error space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-status-error flex-shrink-0 mt-0.5" />
            <span className="text-xs font-black text-status-error uppercase tracking-wider">
              {errorMsg}
            </span>
          </div>
          <button
            onClick={() => setErrorMsg('')}
            className="text-[10px] font-black uppercase text-txt-primary border border-border-subtle px-3 py-1 bg-bg-elevated hover:border-brand-primary"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* STEP 2: PAYMENT DETAILS SCREEN */}
      {paymentContext ? (
        <div className="border-[1.5px] border-brand-primary bg-bg-surface p-5 sm:p-7 shadow-neo-brand space-y-6">
          {/* Top Bar Back Action */}
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <button
              type="button"
              onClick={() => {
                setPaymentContext(null);
                setAmountInput('');
              }}
              className="flex items-center gap-1.5 text-xs font-black text-txt-secondary hover:text-brand-primary transition-colors border border-border-subtle px-3 py-1.5 bg-bg-elevated shadow-neo-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>← BACK TO SCANNER</span>
            </button>

            <NeoPopBadge label="PAYEE CONFIRMED" variant="primary" />
          </div>

          {/* Payee Info Box */}
          <div className="border-[1.5px] border-border-subtle bg-bg-elevated p-5 shadow-neo-sm space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-txt-muted flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-status-success" /> Pay To Merchant
            </span>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center border-2 border-brand-primary bg-brand-primary/20 text-brand-primary font-black text-lg shadow-neo-sm">
                {paymentContext.pn.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-lg font-black text-txt-primary tracking-tight truncate">
                  {paymentContext.pn}
                </h3>
                <p className="text-xs font-bold text-brand-primary font-mono truncate mt-0.5">
                  {paymentContext.pa}
                </p>
              </div>
            </div>

            {paymentContext.note && (
              <div className="text-[11px] font-bold text-txt-secondary bg-bg-surface px-3 py-1.5 border border-border-subtle">
                Note: {paymentContext.note}
              </div>
            )}
          </div>

          {/* Amount Entry Workstation */}
          <form onSubmit={handleProceedToSplit} className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black uppercase tracking-wider text-txt-primary">
                  Payment Amount (₹)
                </label>
                {paymentContext.qrAmount ? (
                  <span className="text-[10px] font-black text-status-success uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Pre-filled from QR
                  </span>
                ) : (
                  <span className="text-[10px] font-black text-brand-cyan uppercase tracking-wider flex items-center gap-1">
                    <Edit3 className="h-3 w-3" /> Enter Total Amount
                  </span>
                )}
              </div>

              <div className="relative">
                <span className="absolute left-4 top-3.5 text-2xl font-black text-txt-muted">₹</span>
                <input
                  type="number"
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
                Total amount will be tranches into sub-₹2,000 MDR-free slices.
              </p>
            </div>

            {/* Primary Action Button */}
            <NeoPopButton
              type="submit"
              disabled={!isAmountValid}
              variant={isAmountValid ? 'primary' : 'surface'}
            >
              {isAmountValid ? (
                <>
                  <Zap className="h-4 w-4" /> CONTINUE TO SPLIT BILL (₹{parsedAmountNum.toLocaleString('en-IN')})
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-status-error" /> ENTER VALID AMOUNT TO CONTINUE
                </>
              )}
            </NeoPopButton>
          </form>
        </div>
      ) : (
        /* STEP 1: MOBILE-FIRST REDESIGNED SCANNER WORKSTATION */
        <div className="space-y-5">
          {/* Main Camera Viewport Box */}
          <div className="relative border-[1.5px] border-border-subtle bg-bg-surface overflow-hidden shadow-neo">
            {/* Viewport Frame Box */}
            <div className="relative w-full aspect-square max-h-[380px] bg-black flex flex-col items-center justify-center overflow-hidden">
              {/* HTML5 QR Camera Target */}
              <div
                id="home-camera-viewport"
                className="w-full h-full object-cover"
              />

              {/* Corner Bracket Overlays (╭─ ─╮) */}
              <div className="absolute inset-0 pointer-events-none p-8 sm:p-12 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-10 h-10 border-t-4 border-l-4 border-brand-cyan shadow-neo-sm" />
                  <div className="w-10 h-10 border-t-4 border-r-4 border-brand-cyan shadow-neo-sm" />
                </div>
                <div className="flex justify-between">
                  <div className="w-10 h-10 border-b-4 border-l-4 border-brand-cyan shadow-neo-sm" />
                  <div className="w-10 h-10 border-b-4 border-r-4 border-brand-cyan shadow-neo-sm" />
                </div>
              </div>

              {/* Moving Scan Line Animation Overlay */}
              {isCameraActive && (
                <div className="absolute inset-x-8 top-1/4 h-0.5 bg-gradient-to-r from-transparent via-brand-cyan to-transparent animate-pulse shadow-neo-cyan" />
              )}

              {/* Loading / Starting Camera State */}
              {isStartingCamera && (
                <div className="absolute inset-0 bg-bg/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center border-2 border-brand-cyan bg-brand-cyan/20 text-brand-cyan animate-spin">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-txt-primary">
                    Starting Camera Feed…
                  </span>
                </div>
              )}

              {/* Camera Error / Unavailable State */}
              {cameraError && (
                <div className="absolute inset-0 bg-bg/95 p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center border-2 border-status-error bg-status-error/15 text-status-error">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase text-txt-primary">
                      Camera Access Unavailable
                    </h3>
                    <p className="text-xs font-bold text-txt-secondary mt-1 max-w-xs">
                      {cameraError}
                    </p>
                  </div>
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <NeoPopButton variant="primary" fullWidth={false}>
                      <Upload className="h-4 w-4" /> IMPORT QR IMAGE
                    </NeoPopButton>
                  </label>
                </div>
              )}
            </div>

            {/* Viewport Control Bar Below Camera */}
            <div className="flex items-center justify-between border-t border-border-subtle bg-bg-elevated px-4 py-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-txt-secondary flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5 text-brand-cyan" /> Point Camera at QR
              </span>

              {/* Torch Trigger */}
              {hasTorch && isCameraActive && (
                <button
                  onClick={toggleTorch}
                  className={`flex items-center gap-1.5 border px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                    isTorchOn
                      ? 'border-status-warning bg-status-warning/20 text-status-warning'
                      : 'border-border-subtle bg-bg-surface text-txt-secondary hover:text-txt-primary'
                  }`}
                >
                  <Flashlight className="h-3.5 w-3.5" />
                  <span>Torch {isTorchOn ? 'ON' : 'OFF'}</span>
                </button>
              )}
            </div>
          </div>

          {/* First-Class Fallbacks: Import Image & Paste Intent Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Import QR Screenshot */}
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

            {/* Restart Camera */}
            {!isCameraActive && !isStartingCamera && (
              <NeoPopButton onClick={startCamera} variant="surface">
                <RotateCcw className="h-4 w-4" /> RESTART CAMERA
              </NeoPopButton>
            )}
          </div>

          {/* Paste Raw UPI URI Box */}
          <div className="border-[1.5px] border-border-subtle bg-bg-surface p-4 shadow-neo space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-txt-secondary flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-brand-cyan" /> Or Paste Raw UPI Payment Link
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
                <span>PARSE UPI INTENT LINK</span>
                <ArrowRight className="h-4 w-4" />
              </NeoPopButton>
            </form>
          </div>

          {/* Scanner Helper Footer */}
          <p className="text-[11px] font-bold text-center text-txt-muted">
            Works with all NPCI BharatQR, GPay, PhonePe, Paytm, and BHIM merchant codes.
          </p>
        </div>
      )}

      {/* Step-by-Step Tranche Checkout Modal */}
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


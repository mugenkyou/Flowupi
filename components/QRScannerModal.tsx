'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { parseUpiUri, createTrancheOrder } from '../lib/splitEngine';
import { SplitOrder } from '../lib/types';
import {
  X,
  Camera,
  Upload,
  Link as LinkIcon,
  AlertCircle,
  Zap,
  Check,
} from 'lucide-react';
import { saveOrder } from '../lib/storage';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: (order: SplitOrder) => void;
}

export function QRScannerModal({
  isOpen,
  onClose,
  onOrderCreated,
}: QRScannerModalProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'paste'>('camera');
  const [pastedUri, setPastedUri] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    try {
      setErrorMsg('');
      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          handleScannedResult(decodedText);
        },
        () => {}
      );
      setIsScanning(true);
    } catch (err: unknown) {
      setIsScanning(false);
      setErrorMsg('Camera access denied or unavailable. Please try uploading an image or pasting a UPI link.');
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
    setIsScanning(false);
  };

  const handleScannedResult = (rawData: string) => {
    stopCamera();
    const parsed = parseUpiUri(rawData);

    if (!parsed.pa) {
      setErrorMsg('Invalid UPI QR code or VPA missing. Please scan a valid merchant UPI QR.');
      return;
    }

    const amount = parsed.am ? parseFloat(parsed.am) : 4500; // default test amount if absent
    const order = createTrancheOrder({
      totalAmount: amount,
      merchantVpa: parsed.pa,
      merchantName: parsed.pn || 'Merchant',
      note: parsed.tn || 'SplitUPI Checkout',
    });

    saveOrder(order);
    if (onOrderCreated) onOrderCreated(order);
    onClose();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setErrorMsg('');
      const html5QrCode = new Html5Qrcode('qr-reader-file');
      const result = await html5QrCode.scanFile(file, true);
      handleScannedResult(result);
    } catch (_) {
      setErrorMsg('Could not detect a valid UPI QR code in the uploaded image.');
    }
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedUri.trim()) return;
    handleScannedResult(pastedUri);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border-subtle bg-bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4 bg-bg-elevated/50">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
              <Zap className="h-4 w-4" />
            </span>
            <h2 className="text-base font-extrabold text-txt-primary">
              Scan / Import UPI QR
            </h2>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="rounded-xl border border-border-subtle p-2 text-txt-secondary hover:bg-bg-elevated hover:text-txt-primary transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border-subtle bg-bg-elevated/30 p-1.5">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'camera'
                ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30'
                : 'text-txt-secondary hover:text-txt-primary'
            }`}
          >
            <Camera className="h-4 w-4" /> Camera Scanner
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'upload'
                ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30'
                : 'text-txt-secondary hover:text-txt-primary'
            }`}
          >
            <Upload className="h-4 w-4" /> Upload Image
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'paste'
                ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30'
                : 'text-txt-secondary hover:text-txt-primary'
            }`}
          >
            <LinkIcon className="h-4 w-4" /> Paste URI
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="m-4 flex items-center gap-2 rounded-xl border border-status-error/40 bg-status-error/15 p-3 text-xs font-semibold text-status-error">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-5">
          {activeTab === 'camera' && (
            <div className="flex flex-col items-center justify-center">
              <div
                id="qr-reader"
                className="w-full max-w-[260px] overflow-hidden rounded-2xl border-2 border-dashed border-brand-cyan/50 bg-bg"
              />
              <p className="mt-3 text-center text-xs text-txt-secondary">
                Point camera at any GPay, PhonePe, Paytm, or BharatQR merchant code
              </p>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border-subtle rounded-2xl p-8 hover:border-brand-cyan/50 transition-all">
              <div id="qr-reader-file" className="hidden" />
              <Upload className="h-10 w-10 text-brand-cyan mb-2" />
              <p className="text-sm font-bold text-txt-primary">Select QR Screenshot</p>
              <p className="text-xs text-txt-muted mt-1 mb-4 text-center">
                Supports PNG, JPG, WEBP merchant payment QR images
              </p>
              <label className="cursor-pointer rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue px-5 py-2.5 text-xs font-bold text-bg shadow-md hover:brightness-110 active:scale-95">
                Browse File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {activeTab === 'paste' && (
            <form onSubmit={handlePasteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-txt-secondary mb-1.5">
                  Raw UPI Payment URI String
                </label>
                <textarea
                  rows={3}
                  value={pastedUri}
                  onChange={(e) => setPastedUri(e.target.value)}
                  placeholder="upi://pay?pa=merchant@upi&pn=MerchantName&am=6800..."
                  className="w-full rounded-xl border border-border-subtle bg-bg-elevated p-3 text-xs text-txt-primary font-mono placeholder:text-txt-muted focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue py-3 text-xs font-bold text-bg shadow-lg shadow-brand-cyan/20 hover:brightness-110 active:scale-95"
              >
                <Check className="h-4 w-4" /> Parse & Split Bill
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

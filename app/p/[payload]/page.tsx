'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShieldCheck, ExternalLink, AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { decodePaymentPayload, DecodedPaymentData } from '../../../lib/paymentLink';
import { NeoPopBadge, NeoPopButton } from '../../../components/NeoPopComponents';

export default function PaymentLandingPage() {
  const params = useParams();
  const router = useRouter();
  const payloadStr = (params?.payload as string) || '';

  const [paymentData, setPaymentData] = useState<DecodedPaymentData | null>(null);
  const [isLaunchingUpi, setIsLaunchingUpi] = useState<boolean>(false);

  useEffect(() => {
    if (payloadStr) {
      const decoded = decodePaymentPayload(payloadStr);
      setPaymentData(decoded);
    }
  }, [payloadStr]);

  const handlePay = () => {
    if (!paymentData?.valid || !paymentData.upiUri) return;
    setIsLaunchingUpi(true);
    // Internal deep link invocation without exposing raw URI to the link/address bar
    window.location.href = paymentData.upiUri;
  };

  // Loading state
  if (!paymentData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 text-center shadow-neo max-w-sm w-full space-y-3">
          <div className="inline-block h-8 w-8 animate-spin border-4 border-brand-primary border-t-transparent rounded-full" />
          <p className="text-xs font-black uppercase text-txt-secondary tracking-wider">
            Loading Payment Details...
          </p>
        </div>
      </div>
    );
  }

  // Error state for invalid / tampered / missing links
  if (!paymentData.valid) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="border-[1.5px] border-status-error bg-bg-surface p-6 sm:p-8 text-center shadow-neo-error max-w-md w-full space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center border border-status-error bg-status-error/10 text-status-error">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <NeoPopBadge label="PAYMENT ERROR" variant="error" />
            <h1 className="text-xl font-black text-txt-primary tracking-tight">
              {paymentData.errorMessage || "Payment link isn't valid."}
            </h1>
            <p className="text-xs font-bold text-txt-secondary">
              This payment link may have been modified, expired, or corrupted. Please request a new link from the sender.
            </p>
          </div>

          <div className="pt-2">
            <NeoPopButton
              onClick={() => router.push('/')}
              variant="primary"
              fullWidth={true}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>GO TO FLOWUPI</span>
            </NeoPopButton>
          </div>
        </div>
      </div>
    );
  }

  const { vpa, name, amount, payer, note } = paymentData;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <NeoPopBadge label="FLOWUPI" variant="primary" />
            <NeoPopBadge label="VERIFIED PAYEE" variant="success" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-txt-primary tracking-tight uppercase">
            PAY YOUR SHARE
          </h1>
          <p className="text-xs font-bold text-txt-secondary">
            Secure 0% MDR direct UPI payment handoff.
          </p>
        </div>

        {/* Main Payment Card */}
        <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-neo-lg space-y-6">
          {/* Payee Info */}
          <div className="text-center border-b border-border-subtle pb-6 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-txt-secondary">
              PAYING TO
            </span>
            <h2 className="text-2xl font-black text-txt-primary tracking-tight">
              {name}
            </h2>
            <p className="text-xs font-mono font-bold text-brand-primary">
              {vpa}
            </p>
          </div>

          {/* Amount Display */}
          <div className="text-center py-2 bg-bg-elevated border border-border-subtle p-4 shadow-neo-sm space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-txt-secondary">
              AMOUNT DUE
            </span>
            <div className="text-4xl sm:text-5xl font-black text-txt-primary tracking-tight">
              ₹{amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="inline-block text-[10px] font-bold text-status-success uppercase tracking-wider">
              (Sub-₹2,000 Zero MDR Slice)
            </span>
          </div>

          {/* Participant & Purpose Details */}
          <div className="space-y-3 pt-2">
            {payer && (
              <div className="flex items-center justify-between text-xs font-bold border-b border-border-subtle/50 pb-2">
                <span className="text-txt-secondary uppercase tracking-wider text-[10px]">FOR PARTICIPANT</span>
                <span className="text-txt-primary font-black">{payer}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs font-bold border-b border-border-subtle/50 pb-2">
              <span className="text-txt-secondary uppercase tracking-wider text-[10px]">PAYMENT PURPOSE</span>
              <span className="text-txt-primary font-black">{note}</span>
            </div>

            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-txt-secondary uppercase tracking-wider text-[10px]">CURRENCY</span>
              <span className="text-txt-primary font-black">INR (₹)</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 space-y-3">
            <NeoPopButton
              onClick={handlePay}
              variant="success"
              fullWidth={true}
              className="min-h-[52px] text-sm"
            >
              <ExternalLink className="h-5 w-5" />
              <span>PAY ₹{amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </NeoPopButton>

            <p className="text-center text-[11px] font-bold text-txt-muted flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-cyan" />
              Opens your installed UPI app (Google Pay, PhonePe, Paytm).
            </p>
          </div>
        </div>

        {/* Status Confirmation feedback after tapping pay */}
        {isLaunchingUpi && (
          <div className="border border-status-warning bg-status-warning/10 p-4 text-center shadow-neo-sm space-y-2 animate-fade-in">
            <div className="flex items-center justify-center gap-2 text-status-warning font-black text-xs uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4" /> Redirecting to UPI App...
            </div>
            <p className="text-[11px] font-bold text-txt-secondary">
              If your UPI app didn&apos;t launch automatically, tap the PAY button again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

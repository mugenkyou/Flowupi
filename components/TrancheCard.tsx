'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Tranche } from '../lib/types';
import {
  Check,
  ExternalLink,
  Copy,
  Volume2,
  Share2,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { playSoundboxConfirmation } from '../lib/soundbox';
import { NeoPopBadge, NeoPopButton } from './NeoPopComponents';

interface TrancheCardProps {
  tranche: Tranche;
  totalTranches: number;
  merchantName: string;
  onStatusChange?: (trancheId: string, status: 'paid' | 'pending' | 'failed') => void;
  compact?: boolean;
  isCurrentActive?: boolean;
  isLocked?: boolean;
}

export function TrancheCard({
  tranche,
  totalTranches,
  merchantName,
  onStatusChange,
  compact = false,
  isCurrentActive = false,
  isLocked = false,
}: TrancheCardProps) {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [upiLaunched, setUpiLaunched] = useState(false);

  const handleCopyUri = () => {
    navigator.clipboard.writeText(tranche.upiUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSoundboxAlert = async () => {
    setIsPlayingAudio(true);
    await playSoundboxConfirmation(tranche.amount, merchantName, 1.0);
    setIsPlayingAudio(false);
  };

  const handleShare = async () => {
    const text = `Pay ₹${tranche.amount.toFixed(2)} tranche ${tranche.index}/${totalTranches} via UPI:\n${tranche.upiUri}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FlowUPI Tranche ${tranche.index}`,
          text,
          url: tranche.upiUri,
        });
      } catch (_) {}
    } else {
      handleCopyUri();
    }
  };

  const handleOpenUpiApp = () => {
    setUpiLaunched(true);
    // Deep link directly to UPI app without automatically setting status to paid
    window.location.href = tranche.upiUri;
  };

  const isPaid = tranche.status === 'paid';
  const isFailed = tranche.status === 'failed';

  return (
    <div
      className={`relative border-[1.5px] p-4 sm:p-5 transition-all ${
        isPaid
          ? 'border-status-success bg-bg-elevated shadow-neo-success opacity-90'
          : isCurrentActive
          ? 'border-brand-primary bg-bg-surface shadow-neo-brand ring-1 ring-brand-primary/30'
          : isLocked
          ? 'border-border-subtle bg-bg/50 opacity-60'
          : 'border-border-subtle bg-bg-surface shadow-neo'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Header & Badges */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <NeoPopBadge
                label={`TRANCHE ${tranche.index} OF ${totalTranches}`}
                variant={isPaid ? 'success' : isCurrentActive ? 'primary' : 'surface'}
              />
              {tranche.payerName && (
                <span className="text-xs font-bold text-txt-primary">
                  {tranche.payerName}
                </span>
              )}
            </div>

            {/* Status Badge */}
            {isPaid ? (
              <NeoPopBadge label="✓ PAID" variant="success" />
            ) : isFailed ? (
              <NeoPopBadge label="FAILED" variant="error" />
            ) : isLocked ? (
              <span className="inline-flex items-center gap-1 border border-border-subtle bg-bg-elevated px-2 py-0.5 text-[10px] font-black text-txt-muted uppercase tracking-wider">
                <Lock className="h-3 w-3" /> LOCKED
              </span>
            ) : isCurrentActive ? (
              <NeoPopBadge label="ACTIVE • PENDING" variant="warning" />
            ) : (
              <NeoPopBadge label="PENDING" variant="surface" />
            )}
          </div>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl font-black text-txt-primary tracking-tight">
              ₹{tranche.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] font-bold text-status-success uppercase tracking-wider">
              (0% MDR Tier)
            </span>
          </div>

          {isLocked && (
            <p className="text-[11px] font-bold text-txt-muted flex items-center gap-1 mt-1">
              <Lock className="h-3 w-3 text-txt-muted inline" />
              Complete Tranche #{tranche.index - 1} first to unlock this payment.
            </p>
          )}
        </div>

        {/* QR Code Container (Only for active or paid, hidden when locked) */}
        {!compact && !isLocked && (
          <div className="flex flex-col items-center justify-center border border-bg bg-white p-2 shadow-neo-sm">
            <QRCodeSVG
              value={tranche.upiUri}
              size={110}
              level="M"
              includeMargin={false}
            />
            <span className="mt-1 text-[8px] font-black text-bg uppercase tracking-wider">
              Scan ₹{tranche.amount.toFixed(0)} via UPI
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons & Confirmation Area */}
      {!isLocked && (
        <div className="mt-4 border-t border-border-subtle pt-3 space-y-3">
          {/* Active Payment Controls */}
          {isCurrentActive && !isPaid && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <button
                  type="button"
                  onClick={handleOpenUpiApp}
                  className="flex-1 min-h-[46px] border-[1.5px] border-brand-primary bg-brand-primary hover:bg-brand-primary/90 text-bg font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-neo-brand transition-all active:translate-x-0.5 active:translate-y-0.5"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Pay ₹{tranche.amount.toFixed(2)} via UPI App</span>
                </button>
              </div>

              {/* Confirmation section after opening UPI app or as explicit gate */}
              <div className={`border-[1.5px] p-3 transition-all ${upiLaunched ? 'border-status-warning bg-status-warning/10 shadow-neo-sm' : 'border-border-subtle bg-bg-elevated'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-txt-primary flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-brand-cyan" />
                      Did you complete the ₹{tranche.amount.toFixed(2)} payment?
                    </span>
                    <p className="text-[11px] font-bold text-txt-muted mt-0.5">
                      UPI app return does not auto-confirm. Press &quot;Mark as Paid&quot; once settled.
                    </p>
                  </div>

                  {onStatusChange && (
                    <NeoPopButton
                      onClick={() => {
                        setUpiLaunched(false);
                        onStatusChange(tranche.id, 'paid');
                      }}
                      variant="success"
                      fullWidth={false}
                      className="min-h-[42px] px-4"
                    >
                      <Check className="h-4 w-4" />
                      <span>Yes, Mark as Paid</span>
                    </NeoPopButton>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Paid State summary bar */}
          {isPaid && (
            <div className="flex items-center justify-between bg-status-success/15 border border-status-success p-3 text-status-success">
              <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Tranche #{tranche.index} Paid (₹{tranche.amount.toFixed(2)})
              </span>
              {tranche.paidAt && (
                <span className="text-[10px] font-bold text-txt-secondary">
                  {new Date(tranche.paidAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          )}

          {/* Secondary Actions: Copy, Soundbox, Share */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSoundboxAlert}
                disabled={isPlayingAudio}
                title="Simulate Soundbox Audio Alert"
                className="flex min-h-[38px] px-3 items-center gap-1.5 border border-border-subtle bg-bg-elevated text-xs font-bold text-brand-primary shadow-neo-sm hover:border-brand-primary transition-all active:translate-x-0.5 active:translate-y-0.5"
              >
                <Volume2 className={`h-3.5 w-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                <span className="hidden sm:inline">Audio Alert</span>
              </button>

              <button
                onClick={handleCopyUri}
                title="Copy UPI Intent URI"
                className="flex min-h-[38px] px-3 items-center gap-1.5 border border-border-subtle bg-bg-elevated text-xs font-bold text-txt-secondary hover:text-txt-primary shadow-neo-sm hover:border-brand-primary transition-all active:translate-x-0.5 active:translate-y-0.5"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-status-success" />
                    <span className="text-status-success">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleShare}
              title="Share Tranche"
              className="flex min-h-[38px] px-3 items-center gap-1.5 border border-border-subtle bg-bg-elevated text-xs font-bold text-txt-secondary hover:text-txt-primary shadow-neo-sm hover:border-brand-primary transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


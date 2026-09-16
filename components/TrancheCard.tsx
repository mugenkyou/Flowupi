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
}

export function TrancheCard({
  tranche,
  totalTranches,
  merchantName,
  onStatusChange,
  compact = false,
  isCurrentActive = false,
}: TrancheCardProps) {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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
    const text = `Pay ₹${tranche.amount.toFixed(2)} slice ${tranche.index}/${totalTranches} via UPI:\n${tranche.upiUri}`;
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

  const isPaid = tranche.status === 'paid';
  const isFailed = tranche.status === 'failed';

  return (
    <div
      className={`relative border-[1.5px] p-4 sm:p-5 transition-all ${
        isPaid
          ? 'border-status-success bg-bg-elevated shadow-neo-success'
          : isCurrentActive
          ? 'border-brand-cyan bg-bg-surface shadow-neo-cyan'
          : 'border-border-subtle bg-bg-surface shadow-neo'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Header & Badges */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <NeoPopBadge
                label={`TRANCHE ${tranche.index}/${totalTranches}`}
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
            ) : isCurrentActive ? (
              <NeoPopBadge label="PAY NOW" variant="warning" />
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
        </div>

        {/* QR Code Container */}
        {!compact && (
          <div className="flex flex-col items-center justify-center border border-bg bg-white p-2 shadow-neo-sm">
            <QRCodeSVG
              value={tranche.upiUri}
              size={110}
              level="M"
              includeMargin={false}
            />
            <span className="mt-1 text-[8px] font-black text-bg uppercase tracking-wider">
              Scan via UPI App
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border-subtle pt-3">
        {/* Deep link UPI button */}
        <a
          href={tranche.upiUri}
          target="_self"
          className="flex-1 min-w-[140px]"
        >
          <NeoPopButton variant="primary" fullWidth className="min-h-[44px]">
            <ExternalLink className="h-4 w-4" />
            <span>Open UPI App</span>
          </NeoPopButton>
        </a>

        {/* Toggle Paid Button */}
        {onStatusChange && (
          <NeoPopButton
            onClick={() => onStatusChange(tranche.id, isPaid ? 'pending' : 'paid')}
            variant={isPaid ? 'success' : 'surface'}
            fullWidth={false}
            className="min-h-[44px]"
          >
            <span>{isPaid ? '✓ Paid' : 'Mark Paid'}</span>
          </NeoPopButton>
        )}

        <div className="flex items-center gap-2">
          {/* Soundbox Trigger */}
          <button
            onClick={handleSoundboxAlert}
            disabled={isPlayingAudio}
            title="Simulate Soundbox Audio Confirmation"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center border-[1.5px] border-border-subtle bg-bg-elevated p-2.5 text-brand-primary shadow-neo-sm hover:border-brand-primary transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <Volume2 className={`h-4 w-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
          </button>

          {/* Copy UPI URI */}
          <button
            onClick={handleCopyUri}
            title="Copy raw UPI URI"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center border-[1.5px] border-border-subtle bg-bg-elevated p-2.5 text-txt-secondary hover:text-txt-primary shadow-neo-sm hover:border-brand-primary transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            {copied ? <Check className="h-4 w-4 text-status-success" /> : <Copy className="h-4 w-4" />}
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            title="Share Tranche QR"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center border-[1.5px] border-border-subtle bg-bg-elevated p-2.5 text-txt-secondary hover:text-txt-primary shadow-neo-sm hover:border-brand-primary transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

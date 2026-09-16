'use client';

import React, { useState } from 'react';
import { X, Share2, Copy, Check, ShieldCheck, Zap } from 'lucide-react';
import { SplitOrder } from '../lib/types';
import { calcMdrSavings } from '../lib/splitEngine';
import { NeoPopButton } from './NeoPopComponents';

interface CloutShareModalProps {
  order: SplitOrder;
  isOpen: boolean;
  onClose: () => void;
}

export function CloutShareModal({
  order,
  isOpen,
  onClose,
}: CloutShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const mdrSaved = calcMdrSavings(order.totalAmount);
  const trancheCount = order.tranches.length;

  const shareText = `⚡ Saved ₹${mdrSaved.toFixed(2)} MDR on a ₹${order.totalAmount.toFixed(0)} bill using @FlowUPI!\n\nSplit into ${trancheCount} sub-₹2,000 tranches to pay 0% MDR fee legally! 🚀\n#UPI #Fintech #FlowUPI #ZeroMDR`;

  const handleCopyText = () => {
    try {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'FlowUPI 0% MDR Savings',
          text: shareText,
          url: typeof window !== 'undefined' ? window.location.origin : '',
        });
      } catch (_) {}
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/85 backdrop-blur-md">
      <div className="relative w-full max-w-md border-[1.5px] border-border-subtle bg-bg-surface p-6 shadow-neo space-y-5">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center border border-brand-primary bg-brand-primary/20 text-brand-primary shadow-neo-sm">
              <Zap className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-black uppercase tracking-wider text-txt-primary">
              Share 0% MDR Clout Card
            </h3>
          </div>

          <button
            onClick={onClose}
            className="border border-border-subtle p-2 text-txt-secondary hover:text-txt-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Card Preview Mockup */}
        <div className="border-[1.5px] border-brand-primary bg-bg-elevated p-5 shadow-neo-brand space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-widest text-brand-primary uppercase">
              FLOWUPI ARBITRAGE
            </span>
            <ShieldCheck className="h-5 w-5 text-status-success" />
          </div>

          <div>
            <span className="text-xs font-bold text-txt-secondary uppercase">MDR Gateway Fee Saved</span>
            <div className="text-3xl font-black text-status-success mt-0.5">
              ₹{mdrSaved.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border-subtle pt-3 text-xs font-bold">
            <span className="text-txt-secondary">Total Bill: ₹{order.totalAmount.toFixed(0)}</span>
            <span className="text-txt-primary">{trancheCount} Micro-Tranches</span>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          readOnly
          rows={4}
          value={shareText}
          className="w-full border border-border-subtle bg-bg-elevated p-3 text-xs font-mono text-txt-secondary focus:outline-none"
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <NeoPopButton onClick={handleNativeShare} variant="primary">
            <Share2 className="h-4 w-4" /> SHARE POST
          </NeoPopButton>

          <NeoPopButton onClick={handleCopyText} variant="surface" fullWidth={false}>
            {copied ? <Check className="h-4 w-4 text-status-success" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </NeoPopButton>
        </div>
      </div>
    </div>
  );
}

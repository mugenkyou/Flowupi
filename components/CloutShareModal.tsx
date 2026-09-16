'use client';

import React, { useState } from 'react';
import { X, Share2, Copy, Check, ShieldCheck, Zap } from 'lucide-react';
import { SplitOrder } from '../lib/types';
import { calcMdrSavings } from '../lib/splitEngine';

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

  const shareText = `⚡ Saved ₹${mdrSaved.toFixed(2)} MDR on a ₹${order.totalAmount.toFixed(0)} bill using @SplitUPI!\n\nSplit into ${trancheCount} sub-₹2,000 tranches to pay 0% MDR fee legally! 🚀\n#UPI #Fintech #SplitUPI #ZeroMDR`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SplitUPI 0% MDR Savings',
          text: shareText,
          url: window.location.origin,
        });
      } catch (_) {}
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/85 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border-subtle bg-bg-surface p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
              <Zap className="h-4 w-4" />
            </span>
            <h3 className="text-base font-extrabold text-txt-primary">
              Share 0% MDR Clout Card
            </h3>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-border-subtle p-2 text-txt-secondary hover:bg-bg-elevated hover:text-txt-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Card Preview Mockup */}
        <div className="rounded-2xl border border-brand-cyan/30 bg-gradient-to-br from-bg-elevated to-bg-surface p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-widest text-brand-cyan uppercase">
              SPLITUPI ARBITRAGE
            </span>
            <ShieldCheck className="h-5 w-5 text-status-success" />
          </div>

          <div>
            <span className="text-xs font-semibold text-txt-secondary">MDR Gateway Fee Saved</span>
            <div className="text-3xl font-black text-status-success mt-0.5">
              ₹{mdrSaved.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border-subtle pt-3 text-xs">
            <span className="text-txt-secondary">Total Bill: ₹{order.totalAmount.toFixed(0)}</span>
            <span className="font-bold text-txt-primary">{trancheCount} Micro-Tranches</span>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          readOnly
          rows={4}
          value={shareText}
          className="w-full rounded-xl border border-border-subtle bg-bg-elevated p-3 text-xs font-mono text-txt-secondary"
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleNativeShare}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue py-3 text-xs font-bold text-bg shadow-lg shadow-brand-cyan/20 hover:brightness-110 active:scale-95"
          >
            <Share2 className="h-4 w-4" /> Share Post
          </button>

          <button
            onClick={handleCopyText}
            className="flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-bg-elevated px-4 py-3 text-xs font-bold text-txt-primary hover:border-brand-cyan/40 active:scale-95"
          >
            {copied ? <Check className="h-4 w-4 text-status-success" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

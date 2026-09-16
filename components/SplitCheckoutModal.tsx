'use client';

import React, { useState, useEffect } from 'react';
import { SplitOrder } from '../lib/types';
import {
  calcPaidAmount,
  calcRemainingAmount,
  calcProgress,
  calcMdrSavings,
} from '../lib/splitEngine';
import { TrancheCard } from './TrancheCard';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Lock,
  History,
  Check,
} from 'lucide-react';
import { playSoundboxConfirmation } from '../lib/soundbox';
import { saveOrder } from '../lib/storage';
import { NeoPopBadge, NeoPopButton } from './NeoPopComponents';

interface SplitCheckoutModalProps {
  order: SplitOrder;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated?: (order: SplitOrder) => void;
}

export function SplitCheckoutModal({
  order: initialOrder,
  isOpen,
  onClose,
  onOrderUpdated,
}: SplitCheckoutModalProps) {
  const [order, setOrder] = useState<SplitOrder>(initialOrder);
  const [activeTrancheIndex, setActiveTrancheIndex] = useState<number>(0);

  useEffect(() => {
    setOrder(initialOrder);
    const firstPendingIdx = initialOrder.tranches.findIndex((t) => t.status !== 'paid');
    setActiveTrancheIndex(firstPendingIdx >= 0 ? firstPendingIdx : 0);
  }, [initialOrder]);

  if (!isOpen) return null;

  const paidAmt = calcPaidAmount(order);
  const remainingAmt = calcRemainingAmount(order);
  const progress = calcProgress(order);
  const isComplete = order.tranches.every((t) => t.status === 'paid');
  const mdrSaved = calcMdrSavings(order.totalAmount);

  // Determine the first pending index (all indices beyond this are LOCKED)
  const firstPendingIndex = order.tranches.findIndex((t) => t.status !== 'paid');

  const handleTrancheStatusChange = async (
    trancheId: string,
    status: 'paid' | 'pending' | 'failed'
  ) => {
    const updatedTranches = order.tranches.map((t) => {
      if (t.id === trancheId) {
        return {
          ...t,
          status,
          paidAt: status === 'paid' ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });

    const updatedOrder: SplitOrder = {
      ...order,
      tranches: updatedTranches,
    };

    setOrder(updatedOrder);
    saveOrder(updatedOrder);
    if (onOrderUpdated) onOrderUpdated(updatedOrder);

    if (status === 'paid') {
      const targetTranche = updatedTranches.find((t) => t.id === trancheId);
      if (targetTranche) {
        playSoundboxConfirmation(targetTranche.amount, order.merchantName);
      }

      const allPaid = updatedTranches.every((t) => t.status === 'paid');
      if (allPaid) {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#35D6FF', '#1687FF', '#7C5CFF', '#35D07F'],
        });
      } else {
        const nextPending = updatedTranches.findIndex((t) => t.status !== 'paid');
        if (nextPending >= 0) {
          setActiveTrancheIndex(nextPending);
        }
      }
    }
  };

  const handleMarkAllPaid = async () => {
    const updatedTranches = order.tranches.map((t) => ({
      ...t,
      status: 'paid' as const,
      paidAt: new Date().toISOString(),
    }));

    const updatedOrder = { ...order, tranches: updatedTranches };
    setOrder(updatedOrder);
    saveOrder(updatedOrder);
    if (onOrderUpdated) onOrderUpdated(updatedOrder);

    playSoundboxConfirmation(order.totalAmount, order.merchantName);
    const confetti = (await import('canvas-confetti')).default;
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#35D6FF', '#1687FF', '#7C5CFF', '#35D07F'],
    });
  };

  const currentTranche = order.tranches[activeTrancheIndex] || order.tranches[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-bg/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border-[1.5px] border-border-subtle bg-bg-surface shadow-neo">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4 bg-bg-elevated">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center border border-brand-primary bg-brand-primary/20 text-brand-primary shadow-neo-sm">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-txt-primary">
                FlowUPI Payment Checkout
              </h2>
              <p className="text-[11px] font-bold text-txt-muted">
                Order #{order.orderId} • {order.merchantName} ({order.merchantVpa})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close checkout modal"
            className="border border-border-subtle p-2 text-txt-secondary hover:text-txt-primary hover:border-brand-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Progress & MDR Savings Header Card */}
          <div className="border-[1.5px] border-border-subtle bg-bg-elevated p-4 sm:p-5 shadow-neo-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-txt-secondary">
                  Total Bill Amount
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-txt-primary tracking-tight">
                    ₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <NeoPopBadge label="0% MDR" variant="success" />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 border border-status-success bg-status-success/15 px-3 py-1.5 text-xs font-black text-status-success uppercase tracking-wider shadow-neo-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>₹{mdrSaved.toFixed(2)} MDR Saved</span>
              </div>
            </div>

            {/* Dynamic Paid & Remaining Summary */}
            <div className="space-y-2 pt-2 border-t border-border-subtle">
              <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                <span className="text-txt-secondary">
                  Paid: <span className="text-status-success">₹{paidAmt.toFixed(2)}</span>
                </span>
                <span className="text-txt-secondary">
                  Remaining: <span className="text-brand-cyan">₹{remainingAmt.toFixed(2)}</span>
                </span>
              </div>

              <div className="h-3 w-full border border-border-subtle bg-bg-surface p-0.5">
                <div
                  className="h-full bg-brand-cyan transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
                />
              </div>

              {/* Sequential Progress Timeline Dots */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {order.tranches.map((t, idx) => {
                  const isPaidSlice = t.status === 'paid';
                  const isActiveSlice = idx === activeTrancheIndex;
                  return (
                    <React.Fragment key={t.id}>
                      {idx > 0 && (
                        <div
                          className={`h-0.5 w-4 sm:w-6 transition-colors ${
                            isPaidSlice || idx <= firstPendingIndex
                              ? 'bg-brand-cyan'
                              : 'bg-border-subtle'
                          }`}
                        />
                      )}
                      <div
                        className={`flex h-5 w-5 items-center justify-center text-[10px] font-black border transition-all ${
                          isPaidSlice
                            ? 'border-status-success bg-status-success text-bg'
                            : isActiveSlice
                            ? 'border-brand-primary bg-brand-primary text-bg font-black scale-110 shadow-neo-sm'
                            : 'border-border-subtle bg-bg-surface text-txt-muted'
                        }`}
                      >
                        {isPaidSlice ? '✓' : idx + 1}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COMPLETION STATE */}
          {isComplete ? (
            <div className="border-[1.5px] border-status-success bg-status-success/10 p-6 text-center space-y-4 shadow-neo-success">
              <div className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-bg bg-status-success text-bg shadow-neo-sm">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-status-success">
                  All Tranches Paid!
                </h3>
                <p className="text-xs font-bold text-txt-secondary mt-1">
                  Payment of ₹{order.totalAmount.toFixed(2)} to {order.merchantName} ({order.merchantVpa}) completed successfully via sub-₹2,000 micro-tranches.
                </p>
              </div>

              {/* Final Transaction Summary */}
              <div className="border border-border-subtle bg-bg-surface p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-border-subtle pb-1.5 font-bold">
                  <span className="text-txt-muted">Payee VPA:</span>
                  <span className="text-txt-primary font-mono">{order.merchantVpa}</span>
                </div>
                <div className="flex justify-between border-b border-border-subtle pb-1.5 font-bold">
                  <span className="text-txt-muted">Total Paid:</span>
                  <span className="text-status-success font-black">₹{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-border-subtle pb-1.5 font-bold">
                  <span className="text-txt-muted">Total Micro-Tranches:</span>
                  <span className="text-txt-primary">{order.tranches.length} Tranches</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-txt-muted">Completed Date:</span>
                  <span className="text-txt-primary">{new Date().toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <NeoPopButton onClick={onClose} variant="success">
                  <Check className="h-4 w-4" /> DONE
                </NeoPopButton>

                <NeoPopButton
                  onClick={() => {
                    onClose();
                    window.location.href = '/history';
                  }}
                  variant="secondary"
                >
                  <History className="h-4 w-4" /> VIEW IN HISTORY
                </NeoPopButton>
              </div>
            </div>
          ) : (
            <>
              {/* Step Navigation Bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-txt-primary">
                    Sequential Micro-Tranches ({order.tranches.length} Total)
                  </h3>
                  <p className="text-[11px] font-bold text-txt-muted">
                    Pay tranche #{activeTrancheIndex + 1} and click &quot;Mark as Paid&quot; to unlock next tranche.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveTrancheIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeTrancheIndex === 0}
                    className="border border-border-subtle p-1.5 text-txt-secondary hover:text-txt-primary disabled:opacity-40"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-black text-txt-primary px-1">
                    {activeTrancheIndex + 1} / {order.tranches.length}
                  </span>
                  <button
                    onClick={() =>
                      setActiveTrancheIndex((prev) =>
                        Math.min(firstPendingIndex >= 0 ? firstPendingIndex : order.tranches.length - 1, prev + 1)
                      )
                    }
                    disabled={
                      activeTrancheIndex >= firstPendingIndex ||
                      firstPendingIndex === -1
                    }
                    className="border border-border-subtle p-1.5 text-txt-secondary hover:text-txt-primary disabled:opacity-40"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Current Actionable / Locked Tranche Card */}
              {currentTranche && (
                <TrancheCard
                  tranche={currentTranche}
                  totalTranches={order.tranches.length}
                  merchantName={order.merchantName}
                  isCurrentActive={activeTrancheIndex === firstPendingIndex}
                  isLocked={activeTrancheIndex > firstPendingIndex && firstPendingIndex !== -1}
                  onStatusChange={handleTrancheStatusChange}
                />
              )}

              {/* Tranche Progression Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {order.tranches.map((t, idx) => {
                  const isActive = idx === activeTrancheIndex;
                  const isPaid = t.status === 'paid';
                  const isLocked = firstPendingIndex !== -1 && idx > firstPendingIndex;

                  return (
                    <button
                      key={t.id}
                      disabled={isLocked}
                      onClick={() => !isLocked && setActiveTrancheIndex(idx)}
                      className={`flex flex-col p-2.5 border-[1.5px] text-left transition-all relative ${
                        isActive
                          ? 'border-brand-primary bg-brand-primary/20 shadow-neo-brand'
                          : isPaid
                          ? 'border-status-success bg-status-success/15 hover:border-status-success'
                          : isLocked
                          ? 'border-border-subtle bg-bg/40 opacity-50 cursor-not-allowed'
                          : 'border-border-subtle bg-bg-elevated hover:border-border-neo'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-txt-muted">
                        <span>Tranche #{t.index}</span>
                        {isPaid ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-status-success" />
                        ) : isLocked ? (
                          <Lock className="h-3 w-3 text-txt-muted" />
                        ) : null}
                      </div>
                      <span className="text-sm font-black text-txt-primary mt-1">
                        ₹{t.amount.toFixed(2)}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5 text-txt-muted">
                        {isPaid ? 'PAID' : isLocked ? 'LOCKED' : isActive ? 'ACTIVE' : 'READY'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border-subtle pt-4">
                <NeoPopButton onClick={handleMarkAllPaid} variant="primary">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>MARK ALL TRANCHES PAID</span>
                </NeoPopButton>

                <NeoPopButton
                  onClick={() =>
                    playSoundboxConfirmation(order.totalAmount, order.merchantName)
                  }
                  variant="secondary"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>SOUNDBOX ALERT</span>
                </NeoPopButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
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
    const pendingIdx = initialOrder.tranches.findIndex((t) => t.status !== 'paid');
    setActiveTrancheIndex(pendingIdx >= 0 ? pendingIdx : 0);
  }, [initialOrder]);

  if (!isOpen) return null;

  const paidAmt = calcPaidAmount(order);
  const remainingAmt = calcRemainingAmount(order);
  const progress = calcProgress(order);
  const isComplete = order.tranches.every((t) => t.status === 'paid');
  const mdrSaved = calcMdrSavings(order.totalAmount);

  const handleTrancheStatusChange = (
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
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#35D6FF', '#1687FF', '#7C5CFF', '#35D07F'],
        });
      } else {
        const nextPending = updatedTranches.findIndex(
          (t, idx) => idx > activeTrancheIndex && t.status !== 'paid'
        );
        if (nextPending >= 0) {
          setActiveTrancheIndex(nextPending);
        }
      }
    }
  };

  const handleMarkAllPaid = () => {
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
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#35D6FF', '#1687FF', '#7C5CFF', '#35D07F'],
    });
  };

  const currentTranche = order.tranches[activeTrancheIndex] || order.tranches[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-bg/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl border-[1.5px] border-border-subtle bg-bg-surface shadow-neo">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4 bg-bg-elevated">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center border border-brand-cyan bg-brand-cyan/20 text-brand-cyan shadow-neo-sm">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-txt-primary">
                SplitUPI Payment Checkout
              </h2>
              <p className="text-[11px] font-bold text-txt-muted">
                Order #{order.orderId} • {order.merchantName} ({order.merchantVpa})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="border border-border-subtle p-2 text-txt-secondary hover:text-txt-primary"
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

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-2">
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
            </div>
          </div>

          {/* 100% Completion Celebration Banner */}
          {isComplete ? (
            <div className="flex flex-col items-center justify-center text-center p-6 border-[1.5px] border-status-success bg-status-success/15 text-status-success space-y-3 shadow-neo-success">
              <div className="flex h-14 w-14 items-center justify-center border-2 border-bg bg-status-success text-bg">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-wider">All Tranches Settled!</h3>
              <p className="text-xs text-txt-secondary max-w-md font-bold">
                All {order.tranches.length} sub-₹2,000 micro-tranches for ₹{order.totalAmount.toFixed(2)} have been paid with 0% MDR fee.
              </p>
              <NeoPopButton onClick={onClose} variant="success">
                DONE / CLOSE CHECKOUT
              </NeoPopButton>
            </div>
          ) : (
            <>
              {/* Step Navigation Bar */}
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-txt-secondary">
                  Micro-Tranches ({order.tranches.length} Slices)
                </h3>
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
                        Math.min(order.tranches.length - 1, prev + 1)
                      )
                    }
                    disabled={activeTrancheIndex === order.tranches.length - 1}
                    className="border border-border-subtle p-1.5 text-txt-secondary hover:text-txt-primary disabled:opacity-40"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Active Tranche Card */}
              {currentTranche && (
                <TrancheCard
                  tranche={currentTranche}
                  totalTranches={order.tranches.length}
                  merchantName={order.merchantName}
                  isCurrentActive={true}
                  onStatusChange={handleTrancheStatusChange}
                />
              )}

              {/* Slice Status Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {order.tranches.map((t, idx) => {
                  const isActive = idx === activeTrancheIndex;
                  const isPaid = t.status === 'paid';

                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTrancheIndex(idx)}
                      className={`flex flex-col p-2.5 border-[1.5px] text-left transition-all ${
                        isActive
                          ? 'border-brand-primary bg-brand-primary/20 shadow-neo-brand'
                          : isPaid
                          ? 'border-status-success bg-status-success/15'
                          : 'border-border-subtle bg-bg-elevated hover:border-border-neo'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-txt-muted">
                        <span>Slice #{t.index}</span>
                        {isPaid && <CheckCircle2 className="h-3 w-3 text-status-success" />}
                      </div>
                      <span className="text-sm font-black text-txt-primary mt-1">
                        ₹{t.amount.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border-subtle pt-4">
                <NeoPopButton onClick={handleMarkAllPaid} variant="primary">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>MARK ALL SLICES PAID</span>
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

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  ShieldCheck,
  QrCode,
  Volume2,
  Layers,
  ArrowRight,
  Trash2,
  CheckCircle2,
  Clock,
  Upload,
} from 'lucide-react';
import { createTrancheOrder, calcMdrSavings } from '../../lib/splitEngine';
import { SplitOrder } from '../../lib/types';
import { getSavedOrders, saveOrder, clearHistory } from '../../lib/storage';
import { SplitCheckoutModal } from '../../components/SplitCheckoutModal';
import { TrancheCard } from '../../components/TrancheCard';
import { playSoundboxConfirmation } from '../../lib/soundbox';
import { NeoPopBadge, NeoPopButton, NeoPopCard } from '../../components/NeoPopComponents';

interface KiranaPreset {
  title: string;
  amount: number;
}

const kiranaPresets: KiranaPreset[] = [
  { title: 'ATTA & OIL', amount: 2450 },
  { title: 'DAIRY & GHEE', amount: 3200 },
  { title: 'DHABA DINNER', amount: 3850 },
  { title: 'DRY FRUITS', amount: 4500 },
  { title: 'FULL RATION', amount: 7500 },
];

export default function PosPage() {
  const [billAmount, setBillAmount] = useState<number>(3850);
  const [merchantVpa, setMerchantVpa] = useState<string>('kirana@okhdfcbank');
  const [merchantName, setMerchantName] = useState<string>('Kirana Store');
  const [note, setNote] = useState<string>('Counter Checkout');
  const [selectedPresetTitle, setSelectedPresetTitle] = useState<string>('DHABA DINNER');
  const [currentOrder, setCurrentOrder] = useState<SplitOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [recentOrders, setRecentOrders] = useState<SplitOrder[]>([]);

  useEffect(() => {
    recalculateOrder(3850, 'kirana@okhdfcbank', 'Kirana Store', 'Counter Checkout');
    setRecentOrders(getSavedOrders());

    const handleGlobalOrderCreated = (e: Event) => {
      const customEvt = e as CustomEvent<SplitOrder>;
      if (customEvt.detail) {
        const order = customEvt.detail;
        setCurrentOrder(order);
        setBillAmount(order.totalAmount);
        setMerchantVpa(order.merchantVpa);
        setMerchantName(order.merchantName);
        setSelectedPresetTitle('SCANNED INVOICE');
        setIsModalOpen(true);
        setRecentOrders(getSavedOrders());
      }
    };

    window.addEventListener('splitupi:order_created', handleGlobalOrderCreated);
    return () => {
      window.removeEventListener('splitupi:order_created', handleGlobalOrderCreated);
    };
  }, []);

  const recalculateOrder = (
    amt: number,
    vpa: string,
    name: string,
    nt: string
  ) => {
    if (amt <= 0) return;
    const order = createTrancheOrder({
      totalAmount: amt,
      merchantVpa: vpa || 'merchant@upi',
      merchantName: name || 'Merchant',
      note: nt,
    });
    setCurrentOrder(order);
    saveOrder(order);
    setRecentOrders(getSavedOrders());
  };

  const handlePresetSelect = (preset: KiranaPreset) => {
    setSelectedPresetTitle(preset.title);
    setBillAmount(preset.amount);
    recalculateOrder(preset.amount, merchantVpa, merchantName, note);
  };

  const mdrSaved = calcMdrSavings(billAmount);
  const trancheCount = Math.ceil(billAmount / 1999);

  return (
    <div className="space-y-8">
      {/* Hero Banner with 3D NeoPOP Styling matching Flutter POS Header */}
      <section className="border-[1.5px] border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-neo space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <NeoPopBadge label="POS REGISTER MODE" variant="secondary" />
              <NeoPopBadge label="0% MDR TIER" variant="primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-txt-primary tracking-tight">
              POS Payment Micro-Tranching Terminal
            </h1>
            <p className="text-xs font-bold text-txt-secondary mt-1 max-w-xl">
              Simulate retail counter bill tranching into sub-₹2,000 slices for 100% MDR surcharge-free payment settlement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/">
              <NeoPopButton variant="primary" fullWidth={false}>
                <QrCode className="h-4 w-4" />
                <span>GO TO SCAN / PAY HOME</span>
              </NeoPopButton>
            </Link>

            {currentOrder && (
              <NeoPopButton
                onClick={() => setIsModalOpen(true)}
                variant="secondary"
                fullWidth={false}
              >
                <Zap className="h-4 w-4" />
                <span>CHECKOUT MODAL</span>
              </NeoPopButton>
            )}
          </div>
        </div>

        {/* Counter Register & Tranche Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Register Inputs */}
          <div className="lg:col-span-5 space-y-5">
            {/* Presets Grid */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-txt-secondary mb-2">
                Quick Merchant Kirana Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {kiranaPresets.map((preset) => {
                  const isSelected = selectedPresetTitle === preset.title;

                  return (
                    <button
                      key={preset.title}
                      onClick={() => handlePresetSelect(preset)}
                      className={`border-[1.5px] px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all duration-100 ${
                        isSelected
                          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-neo-brand'
                          : 'border-border-subtle bg-bg-elevated text-txt-secondary hover:text-txt-primary shadow-neo-sm'
                      }`}
                    >
                      {preset.title} (₹{preset.amount})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bill Amount Input */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-txt-secondary mb-1">
                Total Invoice Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-lg font-black text-txt-muted">₹</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={billAmount}
                  onChange={(e) => {
                    const amt = parseFloat(e.target.value) || 0;
                    setBillAmount(amt);
                    setSelectedPresetTitle('CUSTOM BILL');
                    recalculateOrder(amt, merchantVpa, merchantName, note);
                  }}
                  className="w-full border-[1.5px] border-border-subtle bg-bg-elevated py-2.5 pl-8 pr-3 text-xl font-black text-txt-primary focus:border-brand-primary focus:outline-none shadow-neo-sm"
                />
              </div>
            </div>

            {/* Merchant Details Inputs */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-txt-secondary mb-1">
                  Merchant Name
                </label>
                <input
                  type="text"
                  value={merchantName}
                  onChange={(e) => {
                    setMerchantName(e.target.value);
                    recalculateOrder(billAmount, e.target.value, merchantVpa, note);
                  }}
                  className="w-full border-[1.5px] border-border-subtle bg-bg-elevated px-3 py-2 text-xs font-bold text-txt-primary focus:border-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-txt-secondary mb-1">
                  Merchant VPA / UPI ID
                </label>
                <input
                  type="text"
                  value={merchantVpa}
                  onChange={(e) => {
                    setMerchantVpa(e.target.value);
                    recalculateOrder(billAmount, merchantName, e.target.value, note);
                  }}
                  className="w-full border-[1.5px] border-border-subtle bg-bg-elevated px-3 py-2 text-xs font-bold text-txt-primary focus:border-brand-primary focus:outline-none"
                />
              </div>
            </div>

            {/* 0% MDR Guarantee Card */}
            <div className="border-[1.5px] border-status-success bg-status-success/10 p-4 shadow-neo-success space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-status-success uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" /> 0% MDR Guarantee
                </span>
                <NeoPopBadge label="SAFE TIER" variant="success" />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-txt-muted uppercase">Standard Gateway Fee</span>
                  <div className="text-base font-black text-status-error">
                    ₹{((billAmount > 2000 ? billAmount * 0.004 : 0)).toFixed(2)}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-txt-muted uppercase">FlowUPI MDR Fee</span>
                  <div className="text-base font-black text-status-success">
                    ₹0.00 (0%)
                  </div>
                </div>
              </div>
            </div>

            <NeoPopButton
              onClick={() => setIsModalOpen(true)}
              variant="primary"
            >
              <Zap className="h-4 w-4" /> OPEN STEP-BY-STEP CHECKOUT
            </NeoPopButton>
          </div>

          {/* Tranche Preview Panel matching QrTrancheCard list */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-txt-secondary flex items-center gap-2">
                <Layers className="h-4 w-4 text-brand-primary" /> Generated Sub-₹2,000 Slices ({trancheCount})
              </h2>

              <button
                onClick={() => playSoundboxConfirmation(billAmount, merchantName)}
                className="flex items-center gap-1.5 border border-brand-primary bg-brand-primary/10 px-2.5 py-1 text-xs font-black text-brand-primary hover:bg-brand-primary/20 shadow-neo-sm"
              >
                <Volume2 className="h-3.5 w-3.5" /> SOUNDBOX ALERT
              </button>
            </div>

            {currentOrder && currentOrder.tranches.length > 0 && (
              <div className="space-y-3">
                {currentOrder.tranches.map((t, idx) => (
                  <TrancheCard
                    key={t.id}
                    tranche={t}
                    totalTranches={currentOrder.tranches.length}
                    merchantName={merchantName}
                    isCurrentActive={idx === 0}
                    onStatusChange={(id, status) => {
                      const updatedTranches = currentOrder.tranches.map((tr) =>
                        tr.id === id
                          ? { ...tr, status, paidAt: status === 'paid' ? new Date().toISOString() : undefined }
                          : tr
                      );
                      const updatedOrder = { ...currentOrder, tranches: updatedTranches };
                      setCurrentOrder(updatedOrder);
                      saveOrder(updatedOrder);
                      setRecentOrders(getSavedOrders());
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Active Modal */}
      {isModalOpen && currentOrder && (
        <SplitCheckoutModal
          order={currentOrder}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onOrderUpdated={(updated) => {
            setCurrentOrder(updated);
            setRecentOrders(getSavedOrders());
          }}
        />
      )}
    </div>
  );
}

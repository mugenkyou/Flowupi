'use client';

import React, { useState } from 'react';
import {
  Users,
  Zap,
  Copy,
  Check,
  QrCode,
  MessageCircle,
} from 'lucide-react';
import { createGroupSplitOrder } from '../../lib/splitEngine';
import { SplitOrder } from '../../lib/types';
import { saveOrder, saveGroup } from '../../lib/storage';
import { TrancheCard } from '../../components/TrancheCard';
import { SplitCheckoutModal } from '../../components/SplitCheckoutModal';
import { NeoPopBadge, NeoPopButton } from '../../components/NeoPopComponents';

export default function GroupSplitPage() {
  const [totalAmount, setTotalAmount] = useState<number>(5400);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(3);
  const [friendNames, setFriendNames] = useState<string[]>(['Alex', 'Priya', 'Rahul']);
  const [merchantVpa, setMerchantVpa] = useState<string>('restaurant@upi');
  const [merchantName, setMerchantName] = useState<string>('Bistro Grill');
  const [groupOrder, setGroupOrder] = useState<SplitOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [copiedGroupShare, setCopiedGroupShare] = useState<boolean>(false);

  const handlePeopleChange = (num: number) => {
    const valid = Math.max(1, Math.min(10, num));
    setNumberOfPeople(valid);

    const updated = [...friendNames];
    while (updated.length < valid) {
      updated.push(`Friend #${updated.length + 1}`);
    }
    setFriendNames(updated.slice(0, valid));
  };

  const handleFriendNameChange = (index: number, val: string) => {
    const updated = [...friendNames];
    updated[index] = val;
    setFriendNames(updated);
  };

  const handleGenerateGroupSplit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!totalAmount || totalAmount <= 0) return;

    const order = createGroupSplitOrder({
      totalAmount,
      numberOfPeople,
      merchantVpa,
      merchantName,
      friendNames,
      note: 'Group Bill Split',
    });

    saveOrder(order);
    saveGroup({
      id: order.orderId,
      groupName: `${merchantName} Split`,
      totalAmount,
      numberOfPeople,
      friendNames,
      merchantName,
      merchantVpa,
      createdAt: order.createdAt,
      order,
    });
    setGroupOrder(order);
  };

  const perPersonShare = (totalAmount / numberOfPeople).toFixed(2);
  const groupShareText = `🍽️ Group Bill Split via @FlowUPI!\nTotal: ₹${totalAmount.toFixed(0)} (${numberOfPeople} people • ₹${perPersonShare}/person)\nPay your share instantly with 0% MDR fee! 🚀\n#FlowUPI #GroupSplit`;

  const handleCopyGroupShare = () => {
    navigator.clipboard.writeText(groupShareText);
    setCopiedGroupShare(true);
    setTimeout(() => setCopiedGroupShare(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <NeoPopBadge label="SMART BILL SPLITTING" variant="secondary" />
            <NeoPopBadge label="EQUAL / ITEMIZED" variant="surface" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-txt-primary tracking-tight">
            Group Bill Splitter
          </h1>
          <p className="text-xs font-bold text-txt-secondary mt-1">
            Divide dining, event, or travel bills between friends into sub-₹2,000 individual UPI slice QR cards.
          </p>
        </div>

        {groupOrder && (
          <NeoPopButton
            onClick={() => setIsModalOpen(true)}
            variant="secondary"
            fullWidth={false}
          >
            <QrCode className="h-4 w-4" />
            <span>OPEN GROUP CHECKOUT</span>
          </NeoPopButton>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-5">
          <form
            onSubmit={(e) => {
              handleGenerateGroupSplit(e);
            }}
            className="border-[1.5px] border-border-subtle bg-bg-surface p-6 shadow-neo space-y-5"
          >
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
                <Zap className="h-4 w-4" /> Group Split Setup
              </span>
              <span className="text-xs font-black text-brand-primary">₹{perPersonShare} / person</span>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-txt-secondary mb-1">
                Total Bill Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-lg font-black text-txt-muted">₹</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                  className="w-full border-[1.5px] border-border-subtle bg-bg-elevated py-2.5 pl-8 pr-3 text-xl font-black text-txt-primary focus:border-brand-primary focus:outline-none shadow-neo-sm"
                  required
                />
              </div>
            </div>

            {/* Stepper for number of people */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-txt-secondary mb-1">
                Split Between ({numberOfPeople} People)
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handlePeopleChange(numberOfPeople - 1)}
                  className="flex h-10 w-10 items-center justify-center border-[1.5px] border-border-subtle bg-bg-elevated text-lg font-black text-txt-primary shadow-neo-sm hover:border-brand-primary"
                >
                  -
                </button>
                <span className="text-xl font-black text-brand-primary px-2">
                  {numberOfPeople}
                </span>
                <button
                  type="button"
                  onClick={() => handlePeopleChange(numberOfPeople + 1)}
                  className="flex h-10 w-10 items-center justify-center border-[1.5px] border-border-subtle bg-bg-elevated text-lg font-black text-txt-primary shadow-neo-sm hover:border-brand-primary"
                >
                  +
                </button>
              </div>
            </div>

            {/* Friend Names List */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-wider text-txt-secondary">
                Payer Names
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {friendNames.map((name, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={name}
                    onChange={(e) => handleFriendNameChange(idx, e.target.value)}
                    placeholder={`Friend #${idx + 1}`}
                    className="w-full border-[1.5px] border-border-subtle bg-bg-elevated px-3 py-2 text-xs font-bold text-txt-primary focus:border-brand-primary focus:outline-none"
                  />
                ))}
              </div>
            </div>

            {/* Merchant Details */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-txt-secondary mb-1">
                  Merchant Name
                </label>
                <input
                  type="text"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="w-full border-[1.5px] border-border-subtle bg-bg-elevated px-3 py-2 text-xs font-bold text-txt-primary focus:border-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-txt-secondary mb-1">
                  Merchant VPA
                </label>
                <input
                  type="text"
                  value={merchantVpa}
                  onChange={(e) => setMerchantVpa(e.target.value)}
                  className="w-full border-[1.5px] border-border-subtle bg-bg-elevated px-3 py-2 text-xs font-bold text-txt-primary focus:border-brand-primary focus:outline-none"
                />
              </div>
            </div>

            <NeoPopButton type="submit" variant="primary">
              <Zap className="h-4 w-4" /> GENERATE GROUP SPLIT QR CARDS
            </NeoPopButton>
          </form>

          {/* WhatsApp Share Card */}
          <div className="border-[1.5px] border-border-subtle bg-bg-surface p-5 shadow-neo space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-txt-secondary">
                WhatsApp Group Share Text
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(groupShareText)}`;
                    window.open(waUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-status-success hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Share</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyGroupShare}
                  className="flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline"
                >
                  {copiedGroupShare ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedGroupShare ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <textarea
              readOnly
              rows={3}
              value={groupShareText}
              className="w-full border-[1.5px] border-border-subtle bg-bg-elevated p-2.5 text-xs font-bold text-txt-muted"
            />
          </div>
        </div>

        {/* Tranche Display Grid */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-txt-secondary">
            Individual Friend QR Cards ({numberOfPeople} Shares)
          </h2>

          {groupOrder && groupOrder.tranches.length > 0 ? (
            <div className="space-y-3">
              {groupOrder.tranches.map((t) => (
                <TrancheCard
                  key={t.id}
                  tranche={t}
                  totalTranches={groupOrder.tranches.length}
                  merchantName={merchantName}
                  onStatusChange={(id, status) => {
                    const updatedTranches = groupOrder.tranches.map((item) =>
                      item.id === id ? { ...item, status } : item
                    );
                    const updatedOrder = { ...groupOrder, tranches: updatedTranches };
                    setGroupOrder(updatedOrder);
                    saveOrder(updatedOrder);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border-[1.5px] border-border-subtle bg-bg-surface text-txt-muted shadow-neo">
              <Users className="h-10 w-10 text-txt-muted/50 mb-2" />
              <p className="text-sm font-black text-txt-primary">No group split generated yet.</p>
              <p className="text-xs font-bold text-txt-muted mt-1 max-w-xs">
                Click &quot;GENERATE GROUP QR CARDS&quot; to create individual UPI slice QR codes for each friend.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Group Checkout Modal */}
      {groupOrder && isModalOpen && (
        <SplitCheckoutModal
          order={groupOrder}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onOrderUpdated={(ord) => setGroupOrder(ord)}
        />
      )}
    </div>
  );
}

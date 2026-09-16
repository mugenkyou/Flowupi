'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  Users,
  Zap,
  Copy,
  Check,
  QrCode,
  MessageCircle,
  Camera,
  Upload,
  Loader2,
  CheckCircle2,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { createGroupSplitOrder } from '../../lib/splitEngine';
import { SplitOrder, Tranche } from '../../lib/types';
import { saveOrder, saveGroup } from '../../lib/storage';
import { TrancheCard } from '../../components/TrancheCard';
import { SplitCheckoutModal } from '../../components/SplitCheckoutModal';
import { NeoPopBadge, NeoPopButton } from '../../components/NeoPopComponents';
import { generatePaymentUrl } from '../../lib/paymentLink';

const QRScannerModal = dynamic(
  () => import('../../components/QRScannerModal').then((mod) => mod.QRScannerModal),
  { ssr: false }
);

export default function GroupSplitPage() {
  const [totalAmount, setTotalAmount] = useState<number>(5400);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(3);
  const [friendNames, setFriendNames] = useState<string[]>(['Alex', 'Priya', 'Rahul']);
  const [merchantVpa, setMerchantVpa] = useState<string>('');
  const [merchantName, setMerchantName] = useState<string>('');
  const [groupOrder, setGroupOrder] = useState<SplitOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [copiedGroupShare, setCopiedGroupShare] = useState<boolean>(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);
  const [isDecodingQr, setIsDecodingQr] = useState<boolean>(false);
  const [autoFilledFromQr, setAutoFilledFromQr] = useState<boolean>(false);
  const [copiedParticipantId, setCopiedParticipantId] = useState<string | null>(null);
  const groupFileInputRef = useRef<HTMLInputElement>(null);

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

  const applyScannedPayload = (payload: { pa: string; pn: string; qrAmount?: number }) => {
    if (payload.pa) {
      setMerchantVpa(payload.pa);
    }
    if (payload.pn) {
      setMerchantName(payload.pn);
    } else if (payload.pa) {
      const handle = payload.pa.split('@')[0];
      setMerchantName(handle.charAt(0).toUpperCase() + handle.slice(1));
    }
    if (payload.qrAmount && payload.qrAmount > 0) {
      setTotalAmount(payload.qrAmount);
    }
    setAutoFilledFromQr(true);
    setTimeout(() => setAutoFilledFromQr(false), 4000);
  };

  const handleGroupFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsDecodingQr(true);
      const { decodeQrFromImageFile } = await import('../../lib/qrDecoder');
      const { parseUpiUri } = await import('../../lib/splitEngine');
      const rawResult = await decodeQrFromImageFile(file);
      const parsed = parseUpiUri(rawResult);

      if (parsed.pa) {
        applyScannedPayload({
          pa: parsed.pa,
          pn: parsed.pn || 'Merchant',
          qrAmount: parsed.am ? parseFloat(parsed.am) : undefined,
        });
      } else {
        alert('Invalid UPI QR Code: Could not find a valid merchant UPI VPA in the uploaded image.');
      }
    } catch (_) {
      alert('Could not decode QR code from the uploaded image file. Please try scanning with camera or manual entry.');
    } finally {
      setIsDecodingQr(false);
      e.target.value = '';
    }
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

  const getParticipantLink = (t: Tranche): string => {
    return generatePaymentUrl({
      vpa: merchantVpa,
      name: merchantName,
      amount: t.amount,
      payer: t.payerName || `Friend #${t.index}`,
      note: 'Group Bill Split',
    }, true);
  };

  const handleShareParticipantLink = async (t: Tranche) => {
    const link = getParticipantLink(t);
    const payerName = t.payerName || `Friend #${t.index}`;
    const shareText = `Your FlowUPI payment link for ${merchantName} (₹${t.amount.toFixed(2)}):\n${link}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `FlowUPI Payment Link for ${payerName}`,
          text: shareText,
          url: link,
        });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedParticipantId(t.id);
      setTimeout(() => setCopiedParticipantId(null), 2000);
    } catch (_) {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShareAllGroupLinks = async () => {
    if (!groupOrder) return;
    const linksList = groupOrder.tranches
      .map((t) => {
        const payer = t.payerName || `Friend #${t.index}`;
        const link = getParticipantLink(t);
        return `• ${payer} (₹${t.amount.toFixed(2)}): ${link}`;
      })
      .join('\n');

    const text = `🍽️ Group Bill Split for ${merchantName}\nTotal: ₹${totalAmount.toFixed(0)} (${numberOfPeople} people • ₹${perPersonShare}/person)\n\nShare payment links:\n${linksList}\n\n#FlowUPI`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `FlowUPI Group Split for ${merchantName}`,
          text,
        });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }

    navigator.clipboard.writeText(text);
    setCopiedGroupShare(true);
    setTimeout(() => setCopiedGroupShare(false), 2000);
  };

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

            {/* Merchant Details & QR Auto-Fill */}
            <div className="space-y-3 pt-2 border-t border-border-subtle/60">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-txt-secondary">
                  Merchant Payee Information
                </span>
                {autoFilledFromQr && (
                  <span className="text-[10px] font-black text-status-success uppercase flex items-center gap-1 animate-bounce">
                    <CheckCircle2 className="h-3 w-3" /> Auto-Filled from QR!
                  </span>
                )}
              </div>

              {/* QR Auto-Fill Action Box */}
              <div className="border border-brand-primary/30 bg-brand-primary/5 p-3 space-y-2">
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-wider flex items-center gap-1">
                  <Camera className="h-3 w-3" /> Auto-Fill Payee & Amount via QR
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsQrScannerOpen(true)}
                    className="flex-1 min-h-[36px] px-2.5 border border-brand-primary bg-brand-primary/10 text-brand-primary font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-neo-sm hover:bg-brand-primary/20 transition-all active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <Camera className="h-3.5 w-3.5" /> Scan QR
                  </button>
                  <button
                    type="button"
                    onClick={() => groupFileInputRef.current?.click()}
                    disabled={isDecodingQr}
                    className="flex-1 min-h-[36px] px-2.5 border border-border-subtle bg-bg-elevated text-txt-primary font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-neo-sm hover:border-brand-primary transition-all active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                  >
                    {isDecodingQr ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Decoding...
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" /> Upload QR Image
                      </>
                    )}
                  </button>
                  <input
                    ref={groupFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleGroupFileUpload}
                    className="hidden"
                    aria-label="Upload merchant QR code image for group split"
                  />
                </div>
              </div>

              {/* Manual Editable Fields */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-txt-secondary mb-1">
                    Merchant Name
                  </label>
                  <input
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    placeholder="e.g. Bistro Grill"
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
                    placeholder="e.g. bistro@upi"
                    className="w-full border-[1.5px] border-border-subtle bg-bg-elevated px-3 py-2 text-xs font-bold text-txt-primary focus:border-brand-primary focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <NeoPopButton type="submit" variant="primary">
                <Zap className="h-4 w-4" /> GENERATE GROUP SPLIT QR CARDS
              </NeoPopButton>

              <NeoPopButton
                type="button"
                onClick={() => {
                  if (!groupOrder) {
                    handleGenerateGroupSplit();
                  }
                  setIsModalOpen(true);
                }}
                variant="secondary"
              >
                <QrCode className="h-4 w-4" /> OPEN GROUP CHECKOUT
              </NeoPopButton>
            </div>
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
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xs font-black uppercase tracking-wider text-txt-secondary">
            Individual Friend QR Cards ({numberOfPeople} Shares)
          </h2>

          {groupOrder && groupOrder.tranches.length > 0 ? (
            <div className="space-y-6">
              <div className="space-y-3">
                {groupOrder.tranches.map((t) => (
                  <TrancheCard
                    key={t.id}
                    tranche={t}
                    totalTranches={groupOrder.tranches.length}
                    merchantName={merchantName}
                    merchantVpa={merchantVpa}
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

              {/* GROUP SHARE SECTION */}
              <div className="border-[1.5px] border-border-subtle bg-bg-surface p-5 sm:p-6 shadow-neo space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <NeoPopBadge label="GROUP SHARE" variant="primary" />
                      <span className="text-xs font-black text-txt-primary uppercase tracking-wider">
                        {merchantName}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-txt-secondary mt-1">
                      Share each person&apos;s payment link so they can pay their share directly on their phone.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleShareAllGroupLinks}
                    className="min-h-[38px] px-3.5 border border-brand-primary bg-brand-primary hover:bg-brand-primary/90 text-bg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-neo-sm transition-all active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>SHARE ALL LINKS</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {groupOrder.tranches.map((t) => {
                    const payer = t.payerName || `Friend #${t.index}`;
                    return (
                      <div
                        key={`share_${t.id}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border-subtle bg-bg-elevated p-3 sm:px-4 shadow-neo-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-txt-primary">
                            {payer}
                          </span>
                          <span className="text-xs font-bold text-brand-primary">
                            — ₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              window.location.href = t.upiUri;
                            }}
                            className="px-3.5 py-1.5 border border-brand-primary bg-brand-primary text-bg font-black text-xs uppercase tracking-wider shadow-neo-sm hover:bg-brand-primary/90 transition-all flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>PAY</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleShareParticipantLink(t)}
                            className="px-3.5 py-1.5 border border-border-subtle bg-bg-surface text-txt-primary font-black text-xs uppercase tracking-wider shadow-neo-sm hover:border-brand-primary transition-all flex items-center gap-1"
                          >
                            {copiedParticipantId === t.id ? (
                              <>
                                <Check className="h-3 w-3 text-status-success" />
                                <span className="text-status-success">Copied</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="h-3 w-3" />
                                <span>SHARE</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
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

      {/* Merchant QR Auto-Fill Scanner Modal */}
      {isQrScannerOpen && (
        <QRScannerModal
          isOpen={isQrScannerOpen}
          onClose={() => setIsQrScannerOpen(false)}
          onScannedPayload={(payload) => {
            setIsQrScannerOpen(false);
            applyScannedPayload(payload);
          }}
        />
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  History,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  QrCode,
} from 'lucide-react';
import { SplitOrder } from '../../lib/types';
import { getSavedOrders, deleteOrder, clearHistory } from '../../lib/storage';
import { calcMdrSavings, calcPaidAmount, calcProgress } from '../../lib/splitEngine';
import { SplitCheckoutModal } from '../../components/SplitCheckoutModal';

export default function HistoryPage() {
  const [orders, setOrders] = useState<SplitOrder[]>([]);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [selectedOrder, setSelectedOrder] = useState<SplitOrder | null>(null);

  useEffect(() => {
    setOrders(getSavedOrders());
  }, []);

  const handleDelete = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteOrder(orderId);
    setOrders(getSavedOrders());
  };

  const handleClearAll = () => {
    clearHistory();
    setOrders([]);
  };

  const filteredOrders = orders.filter((o) => {
    const isPaid = o.tranches.every((t) => t.status === 'paid');
    if (filter === 'paid') return isPaid;
    if (filter === 'pending') return !isPaid;
    return true;
  });

  const totalSavings = orders.reduce((sum, o) => sum + calcMdrSavings(o.totalAmount), 0);
  const totalVolume = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1 text-xs font-extrabold text-brand-cyan mb-2">
            <History className="h-3.5 w-3.5" /> Transaction Logs & Local Persistence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-txt-primary">
            Transaction History
          </h1>
          <p className="text-xs text-txt-secondary mt-1">
            Review past SplitUPI micro-tranche orders, check payment settlement progress, and resume pending checkouts.
          </p>
        </div>

        {orders.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 rounded-xl border border-status-error/30 bg-status-error/10 px-4 py-2.5 text-xs font-bold text-status-error hover:bg-status-error/20 transition-all"
          >
            <Trash2 className="h-4 w-4" /> Clear History
          </button>
        )}
      </div>

      {/* Analytics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border-subtle bg-bg-surface p-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-txt-muted">
            Total Split Orders
          </span>
          <div className="text-2xl font-black text-txt-primary mt-1">
            {orders.length}
          </div>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-bg-surface p-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-txt-muted">
            Total Volume Processed
          </span>
          <div className="text-2xl font-black text-brand-cyan mt-1">
            ₹{totalVolume.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="rounded-2xl border border-status-success/30 bg-status-success/10 p-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-status-success">
            Total Gateway MDR Saved
          </span>
          <div className="text-2xl font-black text-status-success mt-1">
            ₹{totalSavings.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
        {(['all', 'paid', 'pending'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition-all ${
              filter === tab
                ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40'
                : 'text-txt-secondary hover:text-txt-primary'
            }`}
          >
            {tab} Orders ({orders.filter((o) => {
              const isPaid = o.tranches.every((t) => t.status === 'paid');
              if (tab === 'paid') return isPaid;
              if (tab === 'pending') return !isPaid;
              return true;
            }).length})
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-border-subtle rounded-3xl bg-bg-surface text-txt-muted space-y-2">
          <QrCode className="h-10 w-10 text-txt-muted/50 mb-1" />
          <p className="text-sm font-bold">No transactions found in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((ord) => {
            const isPaid = ord.tranches.every((t) => t.status === 'paid');
            const paidAmt = calcPaidAmount(ord);
            const progress = calcProgress(ord);
            const mdrSaved = calcMdrSavings(ord.totalAmount);

            return (
              <div
                key={ord.orderId}
                onClick={() => setSelectedOrder(ord)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-border-subtle bg-bg-surface hover:border-brand-cyan/40 cursor-pointer transition-all gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-txt-primary">
                      Order #{ord.orderId}
                    </span>
                    <span className="text-xs font-semibold text-txt-secondary">
                      • {ord.merchantName} ({ord.merchantVpa})
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-txt-muted">
                    <span>{ord.tranches.length} Slices</span>
                    <span>•</span>
                    <span className="text-status-success font-semibold">
                      ₹{mdrSaved.toFixed(2)} MDR Saved
                    </span>
                    <span>•</span>
                    <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Micro progress bar */}
                  <div className="mt-2.5 h-1.5 w-48 overflow-hidden rounded-full bg-bg-elevated">
                    <div
                      className="h-full rounded-full bg-brand-cyan"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-border-subtle pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <div className="text-lg font-black text-txt-primary">
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="mt-0.5">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-status-success">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Fully Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-status-warning">
                          <Clock className="h-3.5 w-3.5" /> ₹{paidAmt.toFixed(0)} Paid
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(ord.orderId, e)}
                      title="Delete transaction record"
                      className="p-2 rounded-xl text-txt-muted hover:text-status-error hover:bg-status-error/10 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <ArrowRight className="h-4 w-4 text-txt-muted group-hover:translate-x-1 group-hover:text-brand-cyan transition-all" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Active Checkout Modal */}
      {selectedOrder && (
        <SplitCheckoutModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={() => setOrders(getSavedOrders())}
        />
      )}
    </div>
  );
}

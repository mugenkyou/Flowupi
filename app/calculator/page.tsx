'use client';

import React, { useState } from 'react';
import {
  Calculator,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { NeoPopBadge, NeoPopButton } from '../../components/NeoPopComponents';

export default function SavingsCalculatorPage() {
  const [monthlyTurnover, setMonthlyTurnover] = useState<number>(350000); // 3.5 Lakhs/month
  const [avgTicketSize, setAvgTicketSize] = useState<number>(6800);

  const annualTurnover = monthlyTurnover * 12;

  // MDR Rate: 0.4% for transactions above 2000
  const mdrRate = avgTicketSize > 2000 ? 0.004 : 0.0;
  const annualMdrLoss = annualTurnover * mdrRate;

  // SplitUPI 0% MDR tier
  const annualSplitUpiCost = 0;
  const annualSavings = annualMdrLoss - annualSplitUpiCost;
  const threeYearSavings = annualSavings * 3;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border-subtle pb-6">
        <div className="flex items-center gap-2 mb-2">
          <NeoPopBadge label="MDR ROAST ENGINE" variant="success" />
          <NeoPopBadge label="100% RECOVERY" variant="primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-txt-primary tracking-tight">
          Annual MDR Savings Calculator
        </h1>
        <p className="text-xs font-bold text-txt-secondary mt-1">
          Calculate how much your business loses to payment gateway MDR fees every year, and how SplitUPI recovers 100% of it.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders & Inputs Panel */}
        <div className="lg:col-span-6 border-[1.5px] border-border-subtle bg-bg-surface p-6 shadow-neo space-y-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-status-success flex items-center gap-1.5">
              <Zap className="h-4 w-4" /> Business Turnover Parameters
            </span>
            <span className="text-[10px] font-bold text-txt-muted">Interactive Calculator</span>
          </div>

          {/* Monthly Turnover Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-txt-secondary uppercase">Monthly UPI Turnover</span>
              <span className="text-base font-black text-brand-cyan">
                ₹{monthlyTurnover.toLocaleString('en-IN')} / mo
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="2500000"
              step="25000"
              value={monthlyTurnover}
              onChange={(e) => setMonthlyTurnover(parseFloat(e.target.value))}
              className="w-full accent-brand-cyan"
            />
            <div className="flex justify-between text-[10px] font-bold text-txt-muted">
              <span>₹50,000</span>
              <span>₹10,00,000</span>
              <span>₹25,00,000</span>
            </div>
          </div>

          {/* Average Ticket Size Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-txt-secondary uppercase">Average Bill Ticket Size</span>
              <span className="text-base font-black text-brand-cyan">
                ₹{avgTicketSize.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="500"
              value={avgTicketSize}
              onChange={(e) => setAvgTicketSize(parseFloat(e.target.value))}
              className="w-full accent-brand-cyan"
            />
            <div className="flex justify-between text-[10px] font-bold text-txt-muted">
              <span>₹1,000</span>
              <span>₹25,000</span>
              <span>₹50,000</span>
            </div>
          </div>

          {/* Rule Breakdown Box */}
          <div className="border border-border-subtle bg-bg-elevated p-4 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-brand-cyan font-black">
              <ShieldCheck className="h-4 w-4" /> NPCI Regulatory Framework Context
            </div>
            <p className="text-[11px] font-bold text-txt-secondary leading-relaxed">
              Under NPCI guidelines, transactions above ₹2,000 across specified PPI wallet/MDR rails incur 0.4%–1.1% interchange fees. Slicing bills into sub-₹2,000 tranches legally maintains 0% MDR compliance.
            </p>
          </div>
        </div>

        {/* Results & ROI Comparison Panel matching Flutter savings_calculator_view.dart */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Savings Result Hero */}
          <div className="border-[1.5px] border-status-success bg-status-success/15 p-6 shadow-neo-success space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-status-success flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> 100% MDR Fee Recovery
            </span>

            <div>
              <span className="text-xs font-bold text-txt-secondary uppercase">
                Net Annual Money Saved with SplitUPI
              </span>
              <div className="text-4xl sm:text-5xl font-black text-status-success mt-1 tracking-tight">
                ₹{annualSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <span className="text-xs font-bold text-txt-muted">
                Per year (₹{threeYearSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })} saved over 3 years)
              </span>
            </div>
          </div>

          {/* Comparison Metric Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border-[1.5px] border-status-error bg-status-error/15 p-4 shadow-neo-sm">
              <div className="flex items-center gap-1 text-[10px] font-black text-status-error uppercase tracking-wider">
                <AlertCircle className="h-3.5 w-3.5" /> Gateway MDR Loss
              </div>
              <div className="text-2xl font-black text-status-error mt-2">
                ₹{annualMdrLoss.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <span className="text-[10px] font-bold text-txt-muted">0.4% paid to gateways</span>
            </div>

            <div className="border-[1.5px] border-status-success bg-status-success/15 p-4 shadow-neo-sm">
              <div className="flex items-center gap-1 text-[10px] font-black text-status-success uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" /> SplitUPI MDR Cost
              </div>
              <div className="text-2xl font-black text-status-success mt-2">
                ₹0.00
              </div>
              <span className="text-[10px] font-bold text-txt-muted">0% Sub-₹2k MDR Tier</span>
            </div>
          </div>

          <Link href="/pos" className="block">
            <NeoPopButton variant="primary">
              <span>START SAVING TODAY ON POS TERMINAL</span>
              <ArrowRight className="h-4 w-4" />
            </NeoPopButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

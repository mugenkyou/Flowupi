'use client';

import React from 'react';
import { Volume2, Radio, Sparkles } from 'lucide-react';
import { SoundboxSpeaker } from '../../components/SoundboxSpeaker';
import { NeoPopBadge } from '../../components/NeoPopComponents';
import { playSoundboxConfirmation } from '../../lib/soundbox';

export default function SoundboxPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-border-subtle pb-6 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
          <NeoPopBadge label="HARDWARE SIMULATOR" variant="primary" />
          <NeoPopBadge label="PAYTM / PHONEPE SPEC" variant="secondary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-txt-primary tracking-tight">
          Soundbox Audio Synthesizer
        </h1>
        <p className="text-xs font-bold text-txt-secondary mt-1">
          Simulate counter hardware audio confirmations (*"Payment of ₹X received on SplitUPI"*) using Web Audio API and Speech Synthesis.
        </p>
      </div>

      {/* Main Soundbox Component */}
      <SoundboxSpeaker defaultAmount={1999} merchantName="SplitUPI Store" />

      {/* Quick Amount Presets Card */}
      <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 shadow-neo space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-txt-secondary flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-primary" /> Test Audio Triggers
        </h3>
        <p className="text-xs font-bold text-txt-muted">
          Click any preset tranche amount below to test instant audio confirmation announcements:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 999, 1999, 4500, 6800, 12500].map((amt) => (
            <button
              key={amt}
              onClick={() => {
                playSoundboxConfirmation(amt, 'SplitUPI Store');
              }}
              className="flex flex-col items-center justify-center p-3 border-[1.5px] border-border-subtle bg-bg-elevated hover:border-brand-primary hover:bg-brand-primary/10 transition-all shadow-neo-sm active:translate-x-[2px] active:translate-y-[2px]"
            >
              <Volume2 className="h-4 w-4 text-brand-primary mb-1" />
              <span className="text-sm font-black text-txt-primary">
                ₹{amt.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-txt-muted uppercase">Broadcast Audio</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

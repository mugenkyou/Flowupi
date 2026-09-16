'use client';

import React from 'react';
import { Volume2, Radio, Sparkles } from 'lucide-react';
import { SoundboxSpeaker } from '../../components/SoundboxSpeaker';

export default function SoundboxPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-border-subtle pb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-violet/30 bg-brand-violet/10 px-3 py-1 text-xs font-extrabold text-brand-violet mb-2">
          <Radio className="h-3.5 w-3.5 animate-pulse" /> Merchant Hardware Simulator
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-txt-primary">
          Soundbox Audio Synthesizer
        </h1>
        <p className="text-xs text-txt-secondary mt-1">
          Simulate counter hardware audio confirmations (*"Payment of ₹X received on SplitUPI"*) using Web Audio API and Speech Synthesis.
        </p>
      </div>

      {/* Main Soundbox Component */}
      <SoundboxSpeaker defaultAmount={1999} merchantName="SplitUPI Store" />

      {/* Quick Amount Presets Card */}
      <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-txt-secondary flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-violet" /> Test Audio Triggers
        </h3>
        <p className="text-xs text-txt-muted">
          Click any preset tranche amount below to test instant audio confirmation announcements:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 999, 1999, 4500, 6800, 12500].map((amt) => (
            <button
              key={amt}
              onClick={() => {
                const SoundboxModule = require('../../lib/soundbox');
                SoundboxModule.playSoundboxConfirmation(amt, 'SplitUPI Store');
              }}
              className="flex flex-col items-center justify-center p-3 rounded-2xl border border-border-subtle bg-bg-elevated hover:border-brand-violet/50 hover:bg-brand-violet/10 transition-all active:scale-95"
            >
              <Volume2 className="h-4 w-4 text-brand-violet mb-1" />
              <span className="text-sm font-black text-txt-primary">
                ₹{amt.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-txt-muted">Broadcast Audio</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

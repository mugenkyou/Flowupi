'use client';

import React, { useState } from 'react';
import { Volume2, Play, Radio, Sparkles } from 'lucide-react';
import { playSoundboxConfirmation } from '../lib/soundbox';
import { NeoPopBadge, NeoPopButton } from './NeoPopComponents';

interface SoundboxSpeakerProps {
  defaultAmount?: number;
  merchantName?: string;
  className?: string;
}

export function SoundboxSpeaker({
  defaultAmount = 1999,
  merchantName = 'SplitUPI Store',
  className = '',
}: SoundboxSpeakerProps) {
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [volume, setVolume] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleTestSound = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    await playSoundboxConfirmation(amount, merchantName, volume);
    setIsPlaying(false);
  };

  return (
    <div
      className={`relative border-[1.5px] border-border-subtle bg-bg-surface p-5 sm:p-6 shadow-neo ${className}`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center border border-brand-primary bg-brand-primary/20 text-brand-primary shadow-neo-sm">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-txt-primary uppercase tracking-wider">
              Merchant Soundbox Audio Simulator
            </h3>
            <p className="text-[11px] font-bold text-txt-muted">
              Simulates Paytm / PhonePe hardware audio confirmations
            </p>
          </div>
        </div>

        <NeoPopBadge label="● ONLINE" variant="success" />
      </div>

      {/* Speaker Mesh Enclosure */}
      <div className="my-5 flex items-center justify-between border-[1.5px] border-border-subtle bg-bg-elevated p-4 shadow-neo-sm">
        {/* Visualizer bars */}
        <div className="flex items-center gap-1.5">
          {[14, 22, 18, 28, 20, 32, 16, 24, 12, 28, 18, 22].map((h, i) => (
            <div
              key={i}
              style={{ height: isPlaying ? `${Math.max(6, Math.min(32, h * (Math.random() + 0.5)))}px` : '10px' }}
              className={`w-2 transition-all duration-150 ${
                isPlaying ? 'bg-brand-primary shadow-neo-sm' : 'bg-border-subtle'
              }`}
            />
          ))}
        </div>

        <Volume2 className={`h-6 w-6 ${isPlaying ? 'text-brand-primary animate-bounce' : 'text-txt-muted'}`} />
      </div>

      {/* Controls Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-txt-secondary mb-1">
              Trigger Amount (₹)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full border-[1.5px] border-border-subtle bg-bg-elevated px-3 py-2 text-sm font-black text-txt-primary focus:border-brand-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-txt-secondary mb-1">
              Volume ({Math.round(volume * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-brand-primary mt-2"
            />
          </div>
        </div>

        {/* 3D Play Button */}
        <NeoPopButton
          onClick={handleTestSound}
          disabled={isPlaying}
          variant="primary"
        >
          {isPlaying ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin" /> Broadcasting Audio Alert...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" /> Trigger Soundbox Audio Confirmation
            </>
          )}
        </NeoPopButton>
      </div>
    </div>
  );
}

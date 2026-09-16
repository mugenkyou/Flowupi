import React from 'react';

interface SplitUpiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  isCompact?: boolean;
}

export function SplitUpiLogo({
  className = '',
  size = 'md',
  showBadge = true,
  isCompact = false,
}: SplitUpiLogoProps) {
  const iconSize = size === 'sm' ? 26 : size === 'lg' ? 38 : 32;
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* 3D NeoPOP Visual Logo Emblem */}
      <div
        style={{ width: iconSize, height: iconSize }}
        className="relative flex items-center justify-center border border-brand-cyan bg-bg-surface shadow-neo-cyan text-brand-cyan font-black text-sm tracking-tight"
      >
        <span className="text-base font-black">₹</span>
      </div>

      {!isCompact && (
        <div className="flex items-center gap-2">
          <div className={`font-black tracking-tight ${textSize} text-txt-primary`}>
            SPLIT<span className="text-brand-cyan">UPI</span>
          </div>

          {showBadge && (
            <div className="border border-brand-cyan/50 bg-bg-elevated px-1.5 py-0.5 text-[9px] font-black tracking-wider text-brand-cyan uppercase">
              RESEARCH
            </div>
          )}
        </div>
      )}
    </div>
  );
}

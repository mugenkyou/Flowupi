'use client';

import React from 'react';

interface FlowUpiLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function FlowUpiLogo({ size = 'md', showText = true }: FlowUpiLogoProps) {
  const dimensions = {
    sm: { icon: 'h-6 w-6', text: 'text-base' },
    md: { icon: 'h-8 w-8', text: 'text-xl' },
    lg: { icon: 'h-10 w-10', text: 'text-2xl' },
  }[size];

  return (
    <div className="flex items-center gap-2 select-none group cursor-pointer">
      {/* FlowUPI Logo Icon: Electric Flow Bolt */}
      <div
        className={`relative flex items-center justify-center border-[1.5px] border-brand-primary bg-bg-surface p-1 shadow-neo-sm group-hover:border-brand-cyan transition-all ${dimensions.icon}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <path
            d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
            fill="#00E599"
            stroke="#00E599"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={`font-black tracking-tight text-txt-primary group-hover:text-brand-primary transition-colors ${dimensions.text}`}
        >
          Flow<span className="text-brand-primary">UPI</span>
        </span>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { WifiOff } from 'lucide-react';
import { usePwaInstall } from '../hooks/usePwaInstall';

export function OfflineBanner() {
  const { isOffline } = usePwaInstall();

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-3 right-3 z-50 flex items-center gap-2 border-[1.5px] border-status-warning bg-bg-surface px-3 py-2 text-xs font-black text-status-warning shadow-neo-warning animate-bounce">
      <WifiOff className="h-4 w-4" />
      <span>OFFLINE MODE · Core App Shell Active</span>
    </div>
  );
}

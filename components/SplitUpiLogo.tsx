'use client';

import React from 'react';
import { FlowUpiLogo } from './FlowUpiLogo';

interface SplitUpiLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

/**
 * @deprecated Re-exported for legacy compatibility. Prefer using FlowUpiLogo.
 */
export function SplitUpiLogo(props: SplitUpiLogoProps) {
  return <FlowUpiLogo {...props} />;
}

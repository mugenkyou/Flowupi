import React from 'react';

/**
 * NeoPOP 3D Interactive Button matching Flutter NeoPopActionButton
 */
interface NeoPopButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'violet' | 'success' | 'warning' | 'error' | 'surface';
  fullWidth?: boolean;
}

export function NeoPopButton({
  children,
  variant = 'primary',
  fullWidth = true,
  className = '',
  ...props
}: NeoPopButtonProps) {
  const variantStyles = {
    primary: 'bg-brand-cyan text-bg border-bg shadow-neo-cyan hover:brightness-110',
    secondary: 'bg-brand-blue text-white border-bg shadow-neo-blue hover:brightness-110',
    violet: 'bg-brand-violet text-white border-bg shadow-neo-violet hover:brightness-110',
    success: 'bg-status-success text-bg border-bg shadow-neo-success hover:brightness-110',
    warning: 'bg-status-warning text-bg border-bg shadow-neo hover:brightness-110',
    error: 'bg-status-error text-white border-bg shadow-neo hover:brightness-110',
    surface: 'bg-bg-elevated text-txt-primary border-border-subtle shadow-neo hover:border-brand-cyan/50',
  };

  return (
    <button
      {...props}
      className={`relative inline-flex items-center justify-center gap-2 border-[1.5px] px-4 py-3 text-xs font-black tracking-wider uppercase transition-all duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
        variantStyles[variant]
      } ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * NeoPOP 3D Elevated Card matching Flutter NeoPopSurfaceCard
 */
interface NeoPopCardProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  shadowColor?: string;
  onClick?: () => void;
  active?: boolean;
}

export function NeoPopCard({
  children,
  className = '',
  onClick,
  active = false,
}: NeoPopCardProps) {
  return (
    <div
      onClick={onClick}
      className={`border-[1.5px] bg-bg-surface p-4 sm:p-5 shadow-neo transition-all ${
        active
          ? 'border-brand-cyan ring-1 ring-brand-cyan'
          : 'border-border-subtle hover:border-border-neo'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * NeoPOP Pill Badge matching Flutter NeoPopPillBadge
 */
interface NeoPopBadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'violet' | 'success' | 'warning' | 'error' | 'surface';
  icon?: React.ReactNode;
  className?: string;
}

export function NeoPopBadge({
  label,
  variant = 'primary',
  icon,
  className = '',
}: NeoPopBadgeProps) {
  const variantStyles = {
    primary: 'bg-brand-cyan text-bg border-bg',
    secondary: 'bg-brand-blue text-white border-bg',
    violet: 'bg-brand-violet text-white border-bg',
    success: 'bg-status-success text-bg border-bg',
    warning: 'bg-status-warning text-bg border-bg',
    error: 'bg-status-error text-white border-bg',
    surface: 'bg-bg-elevated text-txt-primary border-border-subtle',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 border border-bg px-2 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-neo-sm ${
        variantStyles[variant]
      } ${className}`}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
}

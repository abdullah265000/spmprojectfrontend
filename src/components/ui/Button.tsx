import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:bg-emerald-600 shadow-lg shadow-emerald-500/20',
  secondary:
    'bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-900 border border-slate-700',
  ghost: 'text-slate-300 hover:bg-slate-800 hover:text-white active:bg-slate-900',
  danger:
    'bg-rose-500/90 text-white hover:bg-rose-500 active:bg-rose-600 shadow-lg shadow-rose-500/20',
  outline:
    'border border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/10 active:bg-emerald-500/20',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

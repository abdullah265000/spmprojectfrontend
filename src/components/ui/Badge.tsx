import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'emerald' | 'blue' | 'amber' | 'rose' | 'slate' | 'cyan';
  className?: string;
}

const variants = {
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  blue: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  slate: 'bg-slate-700/40 text-slate-300 border-slate-600/40',
  cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
};

export function Badge({ children, variant = 'slate', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <div className={cn('card p-5', className)}>{children}</div>;
}

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  accent?: 'emerald' | 'blue' | 'amber' | 'rose';
}

const accentMap = {
  emerald: 'from-emerald-500/20 to-emerald-500/0 text-emerald-300',
  blue: 'from-blue-500/20 to-blue-500/0 text-blue-300',
  amber: 'from-amber-500/20 to-amber-500/0 text-amber-300',
  rose: 'from-rose-500/20 to-rose-500/0 text-rose-300',
};

export function StatCard({ label, value, unit, icon, trend, accent = 'emerald' }: StatCardProps) {
  return (
    <div className="card p-5 relative overflow-hidden group hover:border-slate-700 transition-colors">
      <div
        className={cn(
          'absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gradient-to-br blur-2xl opacity-60',
          accentMap[accent]
        )}
      />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {value}
            {unit && <span className="text-base font-medium text-slate-400 ml-1">{unit}</span>}
          </p>
        </div>
        <div className={cn('p-2.5 rounded-xl bg-slate-800/80', accentMap[accent].split(' ').pop())}>
          {icon}
        </div>
      </div>
      {trend && (
        <p
          className={cn(
            'mt-3 text-xs font-semibold flex items-center gap-1',
            trend.positive ? 'text-emerald-400' : 'text-rose-400'
          )}
        >
          {trend.positive ? '▲' : '▼'} {trend.value}
        </p>
      )}
    </div>
  );
}

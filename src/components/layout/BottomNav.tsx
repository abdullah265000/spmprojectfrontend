import { cn } from '@/lib/utils';
import { getNavItems, type ViewKey } from './Sidebar';
import { useApp } from '@/context/AppContext';

interface BottomNavProps {
  active: ViewKey;
  onNavigate: (view: ViewKey) => void;
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const { user } = useApp();
  if (!user) return null;
  const items = getNavItems(user.role).slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-1 py-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all',
                isActive ? 'text-emerald-400' : 'text-slate-400'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'scale-110')} />
              <span className="truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

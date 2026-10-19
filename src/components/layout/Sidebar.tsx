import { Dumbbell, LayoutDashboard, ClipboardList, Timer, TrendingUp, Users, Shield, Settings, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';
import type { ComponentType } from 'react';

export type ViewKey =
  | 'dashboard'
  | 'plans'
  | 'logger'
  | 'progress'
  | 'trainer'
  | 'admin'
  | 'settings';

interface NavItem {
  key: ViewKey;
  label: string;
  icon: ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['member', 'trainer', 'admin'] },
  { key: 'plans', label: 'Workout Plans', icon: ClipboardList, roles: ['member', 'trainer', 'admin'] },
  { key: 'logger', label: 'Session Logger', icon: Timer, roles: ['member', 'trainer'] },
  { key: 'progress', label: 'Progress History', icon: TrendingUp, roles: ['member', 'trainer', 'admin'] },
  { key: 'trainer', label: 'Trainer Portal', icon: Users, roles: ['trainer', 'admin'] },
  { key: 'admin', label: 'Admin Console', icon: Shield, roles: ['admin'] },
  { key: 'settings', label: 'Settings', icon: Settings, roles: ['member', 'trainer', 'admin'] },
];

interface SidebarProps {
  active: ViewKey;
  onNavigate: (view: ViewKey) => void;
}

export function getNavItems(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const { user, logout } = useApp();
  if (!user) return null;
  const items = getNavItems(user.role);

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-800">
        <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
          <Dumbbell className="w-5 h-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          Iron<span className="text-gradient">Track</span>
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white border border-transparent'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-transform group-hover:scale-110',
                  isActive && 'text-emerald-400'
                )}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
          <div
            className={cn(
              'w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-sm font-bold text-slate-950',
              user.avatarColor
            )}
          >
            {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user.role}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

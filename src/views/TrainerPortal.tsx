import { useState } from 'react';
import { Users, Search, Activity, Flame, Clock, Calendar, Plus, ClipboardList, UserCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn, formatRelative } from '@/lib/utils';
import type { ActivityStatus, MemberSummary } from '@/types';

const statusConfig: Record<ActivityStatus, { variant: 'emerald' | 'amber' | 'rose'; label: string; dot: string }> = {
  active: { variant: 'emerald', label: 'Active', dot: 'bg-emerald-400' },
  moderate: { variant: 'amber', label: 'Moderate', dot: 'bg-amber-400' },
  inactive: { variant: 'rose', label: 'Inactive', dot: 'bg-rose-400' },
};

export function TrainerPortal({ onCreatePlan }: { onCreatePlan: () => void }) {
  const { members } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | 'all'>('all');
  const [selected, setSelected] = useState<MemberSummary | null>(null);

  const filtered = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = members.filter((m) => m.status === 'active').length;
  const totalSessions = members.reduce((s, m) => s + m.sessionsThisMonth, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Trainer Portal</h1>
          <p className="mt-1 text-sm text-slate-400">Monitor your members and build their programs.</p>
        </div>
        <Button onClick={onCreatePlan}>
          <Plus className="w-4 h-4" /> Create Workout Plan
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400"><Users className="w-5 h-5" /></div>
          <div><p className="text-2xl font-bold text-white">{members.length}</p><p className="text-xs text-slate-400">Assigned Members</p></div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400"><Activity className="w-5 h-5" /></div>
          <div><p className="text-2xl font-bold text-white">{activeCount}</p><p className="text-xs text-slate-400">Active This Week</p></div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400"><Flame className="w-5 h-5" /></div>
          <div><p className="text-2xl font-bold text-white">{totalSessions}</p><p className="text-xs text-slate-400">Sessions This Month</p></div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400"><UserCheck className="w-5 h-5" /></div>
          <div><p className="text-2xl font-bold text-white">{Math.round(totalSessions / members.length)}</p><p className="text-xs text-slate-400">Avg Sessions/Member</p></div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            placeholder="Search members by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'moderate', 'inactive'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-semibold capitalize border transition-all',
                statusFilter === s
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Members datatable */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                <th className="px-4 py-3 text-left font-semibold">Member</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Goal</th>
                <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Last Active</th>
                <th className="px-4 py-3 text-center font-semibold">Sessions</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Membership</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const status = statusConfig[m.status];
                return (
                  <tr
                    key={m.id}
                    onClick={() => setSelected(m)}
                    className="border-b border-slate-800/60 last:border-0 hover:bg-slate-900/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-xs font-bold text-slate-950', m.avatarColor)}>
                          {m.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">{m.name}</p>
                          <p className="text-xs text-slate-400 truncate">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge variant="blue">{m.goal}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-slate-300">{formatRelative(m.lastSessionDate)}</td>
                    <td className="px-4 py-3 text-center font-bold text-white">{m.sessionsThisMonth}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300">
                        <span className={cn('w-2 h-2 rounded-full', status.dot)} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <Badge variant={m.membership === 'Elite' ? 'amber' : m.membership === 'Premium' ? 'cyan' : 'slate'}>
                        {m.membership}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-10 text-sm">No members match your search.</p>
        )}
      </Card>

      {/* Member detail drawer-like modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl p-6 animate-slide-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-4">
              <div className={cn('w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-xl font-bold text-slate-950', selected.avatarColor)}>
                {selected.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selected.name}</h3>
                <p className="text-sm text-slate-400">{selected.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="blue">{selected.goal}</Badge>
                  <Badge variant={statusConfig[selected.status].variant}>{statusConfig[selected.status].label}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="rounded-xl bg-slate-900/60 p-3 border border-slate-800">
                <Flame className="w-4 h-4 text-amber-400" />
                <p className="mt-1 text-xl font-bold text-white">{selected.sessionsThisMonth}</p>
                <p className="text-[10px] text-slate-500">Sessions This Month</p>
              </div>
              <div className="rounded-xl bg-slate-900/60 p-3 border border-slate-800">
                <Calendar className="w-4 h-4 text-blue-400" />
                <p className="mt-1 text-sm font-bold text-white">{formatRelative(selected.lastSessionDate)}</p>
                <p className="text-[10px] text-slate-500">Last Session</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Assigned Trainer</span>
                <span className="text-white font-medium">{selected.assignedTrainer}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Membership</span>
                <span className="text-white font-medium">{selected.membership}</span>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <Button className="flex-1" onClick={() => setSelected(null)}>
                <ClipboardList className="w-4 h-4" /> Assign Plan
              </Button>
              <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

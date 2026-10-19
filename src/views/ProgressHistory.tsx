import { useState } from 'react';
import { TrendingUp, Calendar, Flame, Clock, Trophy, ChevronRight, Dumbbell } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { cn, formatDate, formatDuration, formatRelative } from '@/lib/utils';
import { strengthData, bodyWeightData, volumeData } from '@/data/mockData';

const chartTooltipStyle = {
  backgroundColor: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '0.75rem',
  fontSize: '0.75rem',
  color: '#e2e8f0',
};

export function ProgressHistory() {
  const { sessions, plans } = useApp();
  const [selected, setSelected] = useState<string | null>(null);

  const totalVolume = sessions.reduce((s, x) => s + x.totalVolume, 0);
  const avgDuration = Math.round(sessions.reduce((s, x) => s + x.durationMinutes, 0) / sessions.length);
  const avgRating = (sessions.reduce((s, x) => s + (x.rating ?? 0), 0) / sessions.length).toFixed(1);

  const selectedSession = sessions.find((s) => s.id === selected);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Progress History</h1>
        <p className="mt-1 text-sm text-slate-400">Every session logged, every PR tracked.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Sessions" value={sessions.length} icon={<Dumbbell className="w-5 h-5" />} accent="emerald" />
        <StatCard label="Total Volume" value={totalVolume.toLocaleString()} unit="kg" icon={<Flame className="w-5 h-5" />} accent="amber" />
        <StatCard label="Avg Duration" value={avgDuration} unit="min" icon={<Clock className="w-5 h-5" />} accent="blue" />
        <StatCard label="Avg Rating" value={avgRating} icon={<Trophy className="w-5 h-5" />} accent="rose" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-bold text-white mb-1">Strength Progression</h3>
          <p className="text-xs text-slate-400 mb-4">Main lifts over 12 weeks (kg)</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={strengthData} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line type="monotone" dataKey="benchPress" name="Bench" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="squat" name="Squat" stroke="#38bdf8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="deadlift" name="Deadlift" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-bold text-white mb-1">Weekly Volume</h3>
          <p className="text-xs text-slate-400 mb-4">Total kg lifted per week</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={volumeData} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
              <Bar dataKey="volume" name="Volume (kg)" radius={[4, 4, 0, 0]}>
                {volumeData.map((_, i) => (
                  <Cell key={i} fill={i === volumeData.length - 1 ? '#10b981' : '#0e7490'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold text-white mb-1">Body Composition</h3>
        <p className="text-xs text-slate-400 mb-4">Weight & body fat over 12 weeks</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={bodyWeightData} margin={{ left: -16, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="bodyFat" name="Body Fat (%)" stroke="#f43f5e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Sessions timeline */}
      <Card>
        <h3 className="font-bold text-white mb-4">Session Timeline</h3>
        <div className="space-y-2">
          {sessions.map((s) => {
            const plan = plans.find((p) => p.id === s.planId);
            return (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/70 transition-all text-left group"
              >
                <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{plan?.name ?? 'Freestyle Session'}</p>
                  <p className="text-xs text-slate-400">{formatDate(s.date)} · {formatRelative(s.date)}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-amber-400"><Flame className="w-3.5 h-3.5" /> {s.totalVolume.toLocaleString()}kg</span>
                  <span className="flex items-center gap-1 text-slate-400"><Clock className="w-3.5 h-3.5" /> {formatDuration(s.durationMinutes)}</span>
                  {s.rating && <span className="flex items-center gap-1 text-amber-400"><Trophy className="w-3.5 h-3.5" /> {s.rating}</span>}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
              </button>
            );
          })}
        </div>
      </Card>

      {/* Session detail */}
      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title="Session Details"
        description={selectedSession ? formatDate(selectedSession.date) : ''}
        className="max-w-xl"
      >
        {selectedSession && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-slate-900/60 p-3">
                <Flame className="w-4 h-4 mx-auto text-amber-400" />
                <p className="mt-1 text-lg font-bold text-white">{selectedSession.totalVolume.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500">Volume (kg)</p>
              </div>
              <div className="rounded-xl bg-slate-900/60 p-3">
                <Clock className="w-4 h-4 mx-auto text-blue-400" />
                <p className="mt-1 text-lg font-bold text-white">{formatDuration(selectedSession.durationMinutes)}</p>
                <p className="text-[10px] text-slate-500">Duration</p>
              </div>
              <div className="rounded-xl bg-slate-900/60 p-3">
                <Trophy className="w-4 h-4 mx-auto text-amber-400" />
                <p className="mt-1 text-lg font-bold text-white">{selectedSession.rating ?? '-'}</p>
                <p className="text-[10px] text-slate-500">Rating</p>
              </div>
            </div>

            {selectedSession.notes && (
              <div className="rounded-xl bg-slate-900/60 p-3 border border-slate-800">
                <p className="text-xs font-semibold text-slate-300 mb-1">Notes</p>
                <p className="text-sm text-slate-400">{selectedSession.notes}</p>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-300">Logged Exercises</p>
              {selectedSession.exercises.length === 0 ? (
                <p className="text-sm text-slate-500">Detailed set data not recorded for this session.</p>
              ) : (
                selectedSession.exercises.map((ex) => (
                  <div key={ex.id} className="rounded-xl bg-slate-900/60 p-3 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{ex.name}</p>
                      <Badge variant="emerald">{ex.category}</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {ex.sets.map((s) => (
                        <span
                          key={s.id}
                          className={cn(
                            'px-2 py-1 rounded-md text-[11px] font-medium',
                            s.completed ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-400'
                          )}
                        >
                          {s.reps}×{s.weight}kg
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

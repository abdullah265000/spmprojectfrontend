import { TrendingUp, Dumbbell, Flame, Clock, ArrowRight, Trophy, Target, Calendar } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
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
import { Button } from '@/components/ui/Button';
import { bodyWeightData, strengthData, volumeData } from '@/data/mockData';
import { cn, formatDate, formatDuration, formatRelative } from '@/lib/utils';
import type { ViewKey } from '@/components/layout/Sidebar';

interface DashboardProps {
  onNavigate: (view: ViewKey) => void;
}

const chartTooltipStyle = {
  backgroundColor: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '0.75rem',
  fontSize: '0.75rem',
  color: '#e2e8f0',
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, sessions, plans, profile, startWorkout, activeWorkout } = useApp();

  const totalVolume = sessions.reduce((sum, s) => sum + s.totalVolume, 0);
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const activePlans = plans.filter((p) => p.assignedTo.includes(user?.id ?? ''));

  const todaysPlan = activePlans[0];
  const recent = sessions.slice(0, 4);

  const weightChange = (bodyWeightData[0].weight - bodyWeightData[bodyWeightData.length - 1].weight).toFixed(1);
  const strengthChange = strengthData[strengthData.length - 1].benchPress - strengthData[0].benchPress;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-6 lg:p-8">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="mt-1 text-2xl lg:text-3xl font-bold text-white">
              Welcome back, {user?.name.split(' ')[0]} 👋
            </h1>
            <p className="mt-2 text-slate-400 max-w-md">
              You're on a {profile.goal.toLowerCase()} program and trending up. Let's keep the momentum going.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {activeWorkout ? (
              <Button size="lg" onClick={() => onNavigate('logger')} className="animate-pulse-glow">
                <Dumbbell className="w-5 h-5" /> Resume Active Workout
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => {
                  if (todaysPlan) startWorkout(todaysPlan.id);
                  onNavigate('logger');
                }}
              >
                <Flame className="w-5 h-5" /> Start Today's Routine
              </Button>
            )}
            <Button size="lg" variant="secondary" onClick={() => onNavigate('progress')}>
              <TrendingUp className="w-5 h-5" /> View Progress
            </Button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Sessions Logged"
          value={sessions.length}
          icon={<Dumbbell className="w-5 h-5" />}
          accent="emerald"
          trend={{ value: '+3 this month', positive: true }}
        />
        <StatCard
          label="Total Volume"
          value={totalVolume.toLocaleString()}
          unit="kg"
          icon={<Flame className="w-5 h-5" />}
          accent="amber"
          trend={{ value: '+12% vs last month', positive: true }}
        />
        <StatCard
          label="Training Time"
          value={Math.round(totalMinutes / 60)}
          unit="hrs"
          icon={<Clock className="w-5 h-5" />}
          accent="blue"
          trend={{ value: '+4 hrs this month', positive: true }}
        />
        <StatCard
          label="Current Weight"
          value={profile.currentWeightKg}
          unit="kg"
          icon={<Target className="w-5 h-5" />}
          accent="rose"
          trend={{ value: `${weightChange} kg lost`, positive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white">Strength Progression</h3>
              <p className="text-xs text-slate-400">12-week main lift tracking (kg)</p>
            </div>
            <Badge variant="emerald">
              <TrendingUp className="w-3 h-3" /> +{strengthChange}kg
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={strengthData} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="benchPress" name="Bench" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="squat" name="Squat" stroke="#38bdf8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="deadlift" name="Deadlift" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="overheadPress" name="OHP" stroke="#f43f5e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white">Body Weight Trend</h3>
              <p className="text-xs text-slate-400">Weight & body fat percentage</p>
            </div>
            <Badge variant="rose">Goal: {profile.goalWeightKg}kg</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={bodyWeightData} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[70, 85]} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area
                type="monotone"
                dataKey="weight"
                name="Weight (kg)"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#weightFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Active plans + recent sessions */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Active Workout Plans</h3>
            <button
              onClick={() => onNavigate('plans')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {activePlans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{plan.name}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {plan.exercises.length} exercises · {plan.difficulty}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    startWorkout(plan.id);
                    onNavigate('logger');
                  }}
                >
                  Start
                </Button>
              </div>
            ))}
            {activePlans.length === 0 && (
              <p className="text-sm text-slate-500 py-6 text-center">No active plans assigned yet.</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Recent Sessions</h3>
            <button
              onClick={() => onNavigate('progress')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              All
            </button>
          </div>
          <div className="space-y-2.5">
            {recent.map((s) => {
              const plan = plans.find((p) => p.id === s.planId);
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60"
                >
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-300 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {plan?.name ?? 'Freestyle Session'}
                    </p>
                    <p className="text-xs text-slate-400">{formatRelative(s.date)} · {formatDuration(s.durationMinutes)}</p>
                  </div>
                  {s.rating && (
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Trophy className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{s.rating}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Volume chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white">Weekly Training Volume</h3>
            <p className="text-xs text-slate-400">Total kg lifted per week</p>
          </div>
          <Badge variant="cyan">+86% in 12 weeks</Badge>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={volumeData} margin={{ left: -16, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="volFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Area type="monotone" dataKey="volume" name="Volume (kg)" stroke="#06b6d4" strokeWidth={2} fill="url(#volFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

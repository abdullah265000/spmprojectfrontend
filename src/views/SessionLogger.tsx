import { useEffect, useState } from 'react';
import { Timer, Dumbbell, Plus, Check, X, Flame, Trophy, Flag, Play, Pause, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Form';
import { cn, formatDuration } from '@/lib/utils';
import type { ViewKey } from '@/components/layout/Sidebar';
import type { ExerciseCategory } from '@/types';

interface LoggerProps {
  onNavigate: (view: ViewKey) => void;
}

const categoryColors: Record<ExerciseCategory, string> = {
  Chest: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  Back: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  Legs: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Shoulders: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Arms: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  Core: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  Cardio: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  'Full Body': 'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

export function SessionLogger({ onNavigate }: LoggerProps) {
  const { activeWorkout, plans, toggleSet, updateSet, addSet, finishWorkout, cancelWorkout, startWorkout } = useApp();
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showFinish, setShowFinish] = useState(false);
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!activeWorkout || paused) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - activeWorkout.startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout, paused]);

  if (!activeWorkout) {
    const activePlans = plans.filter((p) => p.assignedTo.includes('u-001'));
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Session Logger</h1>
          <p className="mt-1 text-sm text-slate-400">Pick a plan to begin a focused training session.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {activePlans.map((plan) => (
            <Card key={plan.id} className="hover:border-emerald-500/40 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.exercises.length} exercises · {plan.difficulty}</p>
                </div>
                <Badge variant="emerald">{plan.category}</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {plan.exercises.slice(0, 5).map((ex) => (
                  <span key={ex.id} className="px-2 py-1 rounded-md bg-slate-800/60 text-[11px] text-slate-300">
                    {ex.name}
                  </span>
                ))}
              </div>
              <Button className="mt-4 w-full" onClick={() => { startWorkout(plan.id); setElapsed(0); }}>
                <Play className="w-4 h-4" /> Start Session
              </Button>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const completedSets = activeWorkout.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0
  );
  const totalSets = activeWorkout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const progress = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  const currentVolume = activeWorkout.exercises.reduce(
    (sum, ex) => sum + ex.sets.reduce((s, set) => s + (set.completed ? set.reps * set.weight : 0), 0),
    0
  );

  const confirmFinish = () => {
    finishWorkout(rating, notes);
    setShowFinish(false);
    setNotes('');
    setRating(5);
    onNavigate('progress');
  };

  const confirmCancel = () => {
    cancelWorkout();
    onNavigate('dashboard');
  };

  return (
    <div className="space-y-5 animate-fade-in pb-20 lg:pb-0">
      {/* Active header */}
      <div className="sticky top-0 z-10 -mx-4 lg:-mx-6 px-4 lg:px-6 py-4 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 animate-pulse-glow">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Session
              </p>
              <p className="text-xl font-bold text-white tabular-nums">
                {formatDuration(Math.floor(elapsed / 60))} {String(elapsed % 60).padStart(2, '0')}s
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => setPaused((p) => !p)}>
              {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {paused ? 'Resume' : 'Pause'}
            </Button>
            <Button size="sm" variant="danger" onClick={confirmCancel}>
              <X className="w-4 h-4" /> Cancel
            </Button>
            <Button size="sm" onClick={() => setShowFinish(true)}>
              <Flag className="w-4 h-4" /> Finish
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>{completedSets} / {totalSets} sets completed</span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-amber-400"><Flame className="w-3 h-3" /> {currentVolume.toLocaleString()} kg</span>
              <span>{progress}%</span>
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {activeWorkout.exercises.map((ex, idx) => (
          <Card key={ex.id} className="overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="font-bold text-white">{ex.name}</h3>
                  <span className={cn('inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border', categoryColors[ex.category])}>
                    {ex.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Set table */}
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="px-2 py-2 text-left font-semibold">Set</th>
                    <th className="px-2 py-2 text-left font-semibold">Reps</th>
                    <th className="px-2 py-2 text-left font-semibold">Weight (kg)</th>
                    <th className="px-2 py-2 text-center font-semibold">Done</th>
                  </tr>
                </thead>
                <tbody>
                  {ex.sets.map((s) => (
                    <tr
                      key={s.id}
                      className={cn(
                        'border-t border-slate-800/60 transition-colors',
                        s.completed && 'bg-emerald-500/5'
                      )}
                    >
                      <td className="px-2 py-2">
                        <span className={cn('font-bold', s.completed ? 'text-emerald-400' : 'text-slate-300')}>
                          {s.setNumber}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min={0}
                          value={s.reps}
                          onChange={(e) => updateSet(ex.id, s.id, 'reps', +e.target.value)}
                          className="w-16 bg-slate-900/80 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min={0}
                          step={2.5}
                          value={s.weight}
                          onChange={(e) => updateSet(ex.id, s.id, 'weight', +e.target.value)}
                          className="w-20 bg-slate-900/80 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        />
                      </td>
                      <td className="px-2 py-2 text-center">
                        <button
                          onClick={() => toggleSet(ex.id, s.id)}
                          className={cn(
                            'w-8 h-8 rounded-lg inline-flex items-center justify-center transition-all',
                            s.completed
                              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                              : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-emerald-300'
                          )}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => addSet(ex.id)}
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Set
            </button>
          </Card>
        ))}
      </div>

      {/* Finish modal */}
      <Modal
        open={showFinish}
        onClose={() => setShowFinish(false)}
        title="Finish Workout?"
        description="Rate your session and add any notes before saving."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-slate-900/60 p-3">
              <Timer className="w-4 h-4 mx-auto text-emerald-400" />
              <p className="mt-1 text-lg font-bold text-white">{formatDuration(Math.floor(elapsed / 60))}</p>
              <p className="text-[10px] text-slate-500">Duration</p>
            </div>
            <div className="rounded-xl bg-slate-900/60 p-3">
              <Flame className="w-4 h-4 mx-auto text-amber-400" />
              <p className="mt-1 text-lg font-bold text-white">{currentVolume.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500">Volume (kg)</p>
            </div>
            <div className="rounded-xl bg-slate-900/60 p-3">
              <Check className="w-4 h-4 mx-auto text-emerald-400" />
              <p className="mt-1 text-lg font-bold text-white">{completedSets}/{totalSets}</p>
              <p className="text-[10px] text-slate-500">Sets Done</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-300 mb-2">Session Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className={cn(
                    'flex-1 py-2 rounded-lg border transition-all',
                    rating >= n
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                      : 'border-slate-800 text-slate-500 hover:text-slate-300'
                  )}
                >
                  <Trophy className="w-4 h-4 mx-auto" />
                </button>
              ))}
            </div>
          </div>

          <Textarea label="Notes (optional)" rows={3} placeholder="How did the session feel?" value={notes} onChange={(e) => setNotes(e.target.value)} />

          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowFinish(false)}>Keep Logging</Button>
            <Button onClick={confirmFinish}>
              <Flag className="w-4 h-4" /> Save Session
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

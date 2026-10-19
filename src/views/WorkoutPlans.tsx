import { useState } from 'react';
import { ClipboardList, Plus, Dumbbell, Trash2, Clock, Target, Layers, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Form';
import { allCategories, getExercisesByCategory } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { Exercise, ExerciseCategory, WorkoutPlan } from '@/types';

const difficultyVariant = {
  Beginner: 'emerald',
  Intermediate: 'amber',
  Advanced: 'rose',
} as const;

const categoryColors: Record<ExerciseCategory, string> = {
  Chest: 'bg-rose-500/15 text-rose-300',
  Back: 'bg-blue-500/15 text-blue-300',
  Legs: 'bg-emerald-500/15 text-emerald-300',
  Shoulders: 'bg-amber-500/15 text-amber-300',
  Arms: 'bg-purple-500/15 text-purple-300',
  Core: 'bg-cyan-500/15 text-cyan-300',
  Cardio: 'bg-orange-500/15 text-orange-300',
  'Full Body': 'bg-slate-500/15 text-slate-300',
};

export function WorkoutPlans() {
  const { plans, addPlan, removePlan, user } = useApp();
  const [showBuilder, setShowBuilder] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<ExerciseCategory | 'All'>('All');

  // builder state
  const [planName, setPlanName] = useState('');
  const [planDesc, setPlanDesc] = useState('');
  const [planCat, setPlanCat] = useState<ExerciseCategory>('Full Body');
  const [difficulty, setDifficulty] = useState<WorkoutPlan['difficulty']>('Intermediate');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExCat, setNewExCat] = useState<ExerciseCategory>('Chest');
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState(3);
  const [newExReps, setNewExReps] = useState(10);
  const [newExWeight, setNewExWeight] = useState(20);
  const [error, setError] = useState('');

  const filtered = plans.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'All' || p.category === filterCat;
    return matchesSearch && matchesCat;
  });

  const resetBuilder = () => {
    setPlanName('');
    setPlanDesc('');
    setPlanCat('Full Body');
    setDifficulty('Intermediate');
    setExercises([]);
    setNewExName('');
    setError('');
  };

  const addExercise = () => {
    const name = newExName || getExercisesByCategory(newExCat)[0];
    const ex: Exercise = {
      id: `ex-${Date.now()}`,
      name,
      category: newExCat,
      sets: newExSets,
      reps: newExReps,
      weight: newExWeight,
      restSeconds: 90,
    };
    setExercises((prev) => [...prev, ex]);
    setNewExName('');
  };

  const removeExercise = (id: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  };

  const savePlan = () => {
    if (planName.trim().length < 3) {
      setError('Plan name must be at least 3 characters.');
      return;
    }
    if (exercises.length === 0) {
      setError('Add at least one exercise to the plan.');
      return;
    }
    const plan: WorkoutPlan = {
      id: `wp-${Date.now()}`,
      name: planName,
      description: planDesc || `${difficulty} ${planCat} plan.`,
      category: planCat,
      assignedTo: user?.role === 'member' ? [user.id] : [],
      createdBy: user?.id ?? 'u-002',
      createdAt: new Date().toISOString().slice(0, 10),
      difficulty,
      exercises,
    };
    addPlan(plan);
    resetBuilder();
    setShowBuilder(false);
  };

  const grouped = exercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
    (acc[ex.category] ??= []).push(ex);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Workout Plans</h1>
          <p className="mt-1 text-sm text-slate-400">
            Browse, create, and assign training programs grouped by muscle category.
          </p>
        </div>
        <Button onClick={() => setShowBuilder(true)}>
          <Plus className="w-4 h-4" /> Create Plan
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            placeholder="Search plans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All', ...allCategories].map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c as ExerciseCategory | 'All')}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all',
                filterCat === c
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Plan grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((plan) => (
          <Card key={plan.id} className="hover:border-slate-700 transition-colors group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{plan.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-bold', categoryColors[plan.category])}>
                      {plan.category}
                    </span>
                    <Badge variant={difficultyVariant[plan.difficulty]}>{plan.difficulty}</Badge>
                  </div>
                </div>
              </div>
              {(user?.role === 'trainer' || user?.role === 'admin') && (
                <button
                  onClick={() => removePlan(plan.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="mt-3 text-sm text-slate-400 line-clamp-2">{plan.description}</p>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-slate-900/60 py-2">
                <Dumbbell className="w-4 h-4 mx-auto text-slate-400" />
                <p className="mt-1 text-sm font-bold text-white">{plan.exercises.length}</p>
                <p className="text-[10px] text-slate-500">Exercises</p>
              </div>
              <div className="rounded-lg bg-slate-900/60 py-2">
                <Layers className="w-4 h-4 mx-auto text-slate-400" />
                <p className="mt-1 text-sm font-bold text-white">
                  {plan.exercises.reduce((s, e) => s + e.sets, 0)}
                </p>
                <p className="text-[10px] text-slate-500">Total Sets</p>
              </div>
              <div className="rounded-lg bg-slate-900/60 py-2">
                <Clock className="w-4 h-4 mx-auto text-slate-400" />
                <p className="mt-1 text-sm font-bold text-white">~45</p>
                <p className="text-[10px] text-slate-500">Minutes</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-xs font-semibold text-slate-300 mb-2">Exercises</p>
              <div className="flex flex-wrap gap-1.5">
                {plan.exercises.slice(0, 4).map((ex) => (
                  <span
                    key={ex.id}
                    className="px-2 py-1 rounded-md bg-slate-800/60 text-[11px] text-slate-300"
                  >
                    {ex.name}
                  </span>
                ))}
                {plan.exercises.length > 4 && (
                  <span className="px-2 py-1 rounded-md bg-slate-800/60 text-[11px] text-slate-400">
                    +{plan.exercises.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Target className="w-10 h-10 mx-auto text-slate-600" />
          <p className="mt-3 text-slate-400">No plans match your filters.</p>
        </div>
      )}

      {/* Plan Builder Modal */}
      <Modal
        open={showBuilder}
        onClose={() => setShowBuilder(false)}
        title="Create Workout Plan"
        description="Group exercises by category and assign to members."
        className="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Plan Name" placeholder="e.g. Push Day A" value={planName} onChange={(e) => setPlanName(e.target.value)} />
            <Select label="Category" value={planCat} onChange={(e) => setPlanCat(e.target.value as ExerciseCategory)}>
              {allCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>
          <Textarea label="Description" rows={2} placeholder="Brief goal of this plan..." value={planDesc} onChange={(e) => setPlanDesc(e.target.value)} />
          <Select label="Difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as WorkoutPlan['difficulty'])}>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Select>

          {/* Exercise builder */}
          <div className="rounded-xl border border-slate-800 p-4 bg-slate-950/40">
            <p className="text-xs font-semibold text-slate-300 mb-3">Add Exercise</p>
            <div className="grid sm:grid-cols-12 gap-2">
              <div className="sm:col-span-3">
                <Select label="Category" value={newExCat} onChange={(e) => { setNewExCat(e.target.value as ExerciseCategory); setNewExName(''); }}>
                  {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div className="sm:col-span-5">
                <Select label="Exercise" value={newExName} onChange={(e) => setNewExName(e.target.value)}>
                  <option value="">Select...</option>
                  {getExercisesByCategory(newExCat).map((n) => <option key={n} value={n}>{n}</option>)}
                </Select>
              </div>
              <div className="sm:col-span-1">
                <Input label="Sets" type="number" min={1} value={newExSets} onChange={(e) => setNewExSets(+e.target.value)} />
              </div>
              <div className="sm:col-span-1">
                <Input label="Reps" type="number" min={1} value={newExReps} onChange={(e) => setNewExReps(+e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Input label="Weight" type="number" min={0} value={newExWeight} onChange={(e) => setNewExWeight(+e.target.value)} />
              </div>
            </div>
            <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={addExercise}>
              <Plus className="w-4 h-4" /> Add Exercise
            </Button>

            {/* Added exercises grouped */}
            {Object.entries(grouped).length > 0 && (
              <div className="mt-4 space-y-3">
                {Object.entries(grouped).map(([cat, list]) => (
                  <div key={cat}>
                    <p className={cn('inline-block px-2 py-0.5 rounded-md text-[10px] font-bold mb-1.5', categoryColors[cat as ExerciseCategory])}>
                      {cat}
                    </p>
                    <div className="space-y-1.5">
                      {list.map((ex) => (
                        <div key={ex.id} className="flex items-center justify-between bg-slate-900/60 rounded-lg px-3 py-2">
                          <div className="text-sm text-slate-200">
                            <span className="font-medium">{ex.name}</span>
                            <span className="text-slate-400 ml-2 text-xs">
                              {ex.sets}×{ex.reps} @ {ex.weight}kg
                            </span>
                          </div>
                          <button
                            onClick={() => removeExercise(ex.id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setShowBuilder(false)}>Cancel</Button>
            <Button onClick={savePlan}>Save Plan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

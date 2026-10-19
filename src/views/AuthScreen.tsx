import { useState } from 'react';
import { Dumbbell, Mail, Lock, User as UserIcon, ArrowRight, Flame, Activity, Trophy } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Form';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';
import { FOOTER_TEXT } from '@/lib/constants';

const ROLES: { key: UserRole; label: string; description: string; icon: typeof UserIcon }[] = [
  { key: 'member', label: 'Member', description: 'Track workouts & progress', icon: Activity },
  { key: 'trainer', label: 'Trainer', description: 'Manage clients & plans', icon: Flame },
  { key: 'admin', label: 'Gym Management', description: 'Oversee operations & staff', icon: Trophy },
];

export function AuthScreen() {
  const { login, register } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('member');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [accepted, setAccepted] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === 'register' && name.trim().length < 2) e.name = 'Enter your full name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Enter a valid email address.';
    if (password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (mode === 'register' && password !== confirmPassword)
      e.confirmPassword = 'Passwords do not match.';
    if (mode === 'register' && !accepted) e.terms = 'Please accept the terms to continue.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      if (mode === 'login') {
        await login(email, password, role);
      } else {
        await register(email, password, role, name);
      }
    } catch (err: any) {
      setErrors({ password: err.message || 'Authentication failed. Please check your credentials.' });
    }
  };

  const useDemo = () => login('demo@uol.edu.pk', 'correct-password-or-demo', role);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">
      {/* Brand panel */}
      <div className="relative lg:w-1/2 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 p-8 lg:p-12 flex flex-col justify-between min-h-[280px] lg:min-h-screen">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(16,185,129,0.4), transparent 40%), radial-gradient(circle at 80% 70%, rgba(20,184,166,0.3), transparent 45%)' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 glow-emerald">
            <Dumbbell className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Iron<span className="text-gradient">Track</span>
          </span>
        </div>

        <div className="relative my-12 hidden lg:block">
          <h1 className="text-4xl font-bold text-white leading-tight max-w-md">
            Train smarter.<br />Track every rep.<br />
            <span className="text-gradient">Crush your goals.</span>
          </h1>
          <p className="mt-4 text-slate-400 max-w-sm text-base leading-relaxed">
            The centralized platform for members, trainers, and gym management to build plans,
            log sessions, and watch progress climb — all in one place.
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-3 max-w-sm">
          {[
            { label: 'Active Members', value: '1,240+' },
            { label: 'Workouts Logged', value: '58k' },
            { label: 'Avg. Strength Gain', value: '+18%' },
          ].map((stat) => (
            <div key={stat.label} className="card p-3">
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Dumbbell className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Iron<span className="text-gradient">Track</span>
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-1.5 text-sm text-slate-400">
            {mode === 'login'
              ? 'Sign in to continue your fitness journey.'
              : 'Join IronTrack and start tracking today.'}
          </p>

          {/* Role selection */}
          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-300 mb-2">Login as</p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isActive = role === r.key;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRole(r.key)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-center transition-all',
                      isActive
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{r.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {ROLES.find((r) => r.key === role)?.description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'register' && (
              <Input
                id="name"
                label="Full Name"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                icon={<UserIcon className="w-4 h-4" />}
              />
            )}
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail className="w-4 h-4" />}
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<Lock className="w-4 h-4" />}
            />
            {mode === 'register' && (
              <>
                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  icon={<Lock className="w-4 h-4" />}
                />
                <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-400/40"
                  />
                  <span>
                    I agree to the Terms of Service and Privacy Policy of The University of Lahore gym program.
                    {errors.terms && <span className="block text-rose-400 mt-1">{errors.terms}</span>}
                  </span>
                </label>
              </>
            )}

            <Button type="submit" size="lg" className="w-full">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <button
            onClick={useDemo}
            className="mt-3 w-full text-xs text-slate-400 hover:text-emerald-300 transition-colors py-2"
          >
            Or explore the {ROLES.find((r) => r.key === role)?.label.toLowerCase()} demo — no credentials needed
          </button>

          <p className="mt-6 text-center text-sm text-slate-400">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => {
                setMode((m) => (m === 'login' ? 'register' : 'login'));
                setErrors({});
              }}
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {mode === 'login' ? 'Register' : 'Sign in'}
            </button>
          </p>

          <p className="mt-8 text-center text-[11px] text-slate-500 leading-relaxed">
            {FOOTER_TEXT}
          </p>
        </div>
      </div>
    </div>
  );
}
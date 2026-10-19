import { useState } from 'react';
import { User, Mail, Phone, Target, Ruler, Weight, Calendar, Bell, Shield, Palette, LogOut, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Form';
import { cn } from '@/lib/utils';

export function Settings() {
  const { user, profile, logout } = useApp();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({ workoutReminders: true, progressReports: true, trainerMessages: false, productUpdates: true });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">Manage your profile, preferences, and account.</p>
      </div>

      {/* Profile */}
      <Card>
        <div className="flex items-center gap-4 mb-5">
          <div className={cn('w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-xl font-bold text-slate-950', user.avatarColor)}>
            {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{user.name}</h3>
            <p className="text-sm text-slate-400 capitalize">{user.role} · {user.membership ?? 'Standard'} Member</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="emerald">Active</Badge>
              <Badge variant="blue">Since {user.joinedDate ?? '2025'}</Badge>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} icon={<User className="w-4 h-4" />} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} icon={<Phone className="w-4 h-4" />} />
          <Input label="Member ID" value={user.id.toUpperCase()} disabled />
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave}>
            {saved ? <><Check className="w-4 h-4" /> Saved</> : 'Save Changes'}
          </Button>
        </div>
      </Card>

      {/* Fitness profile (member only) */}
      {user.role === 'member' && (
        <Card>
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" /> Fitness Profile
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat icon={<Calendar className="w-4 h-4" />} label="Age" value={`${profile.age} yrs`} />
            <Stat icon={<Ruler className="w-4 h-4" />} label="Height" value={`${profile.heightCm} cm`} />
            <Stat icon={<Weight className="w-4 h-4" />} label="Weight" value={`${profile.currentWeightKg} kg`} />
            <Stat icon={<Target className="w-4 h-4" />} label="Goal" value={profile.goal} />
          </div>
          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-900/60 p-4 border border-slate-800">
              <p className="text-xs text-slate-400">Start Weight</p>
              <p className="text-xl font-bold text-white">{profile.startWeightKg} kg</p>
            </div>
            <div className="rounded-xl bg-slate-900/60 p-4 border border-slate-800">
              <p className="text-xs text-slate-400">Current Weight</p>
              <p className="text-xl font-bold text-emerald-400">{profile.currentWeightKg} kg</p>
            </div>
            <div className="rounded-xl bg-slate-900/60 p-4 border border-slate-800">
              <p className="text-xs text-slate-400">Target Weight</p>
              <p className="text-xl font-bold text-amber-400">{profile.goalWeightKg} kg</p>
            </div>
          </div>
        </Card>
      )}

      {/* Notifications */}
      <Card>
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-400" /> Notifications
        </h3>
        <div className="space-y-3">
          {([
            ['workoutReminders', 'Workout Reminders', 'Get nudged when a scheduled session is due.'],
            ['progressReports', 'Weekly Progress Reports', 'A summary of your volume, weight, and PRs every Sunday.'],
            ['trainerMessages', 'Trainer Messages', 'Notifications when your trainer updates your plan.'],
            ['productUpdates', 'Product Updates', 'New features and improvements to IronTrack.'],
          ] as const).map(([key, label, desc]) => (
            <label key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  notifications[key] ? 'bg-emerald-500' : 'bg-slate-700'
                )}
              >
                <span className={cn('absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform', notifications[key] && 'translate-x-5')} />
              </button>
            </label>
          ))}
        </div>
      </Card>

      {/* Appearance & Security placeholders */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-400" /> Appearance
          </h3>
          <div className="flex gap-2">
            <div className="flex-1 rounded-xl border-2 border-emerald-500/50 bg-slate-900 p-3 text-center">
              <div className="w-full h-8 rounded-lg bg-gradient-to-br from-slate-900 to-emerald-950 mb-2" />
              <p className="text-xs font-semibold text-emerald-300">Dark (Active)</p>
            </div>
            <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900 p-3 text-center opacity-50 cursor-not-allowed">
              <div className="w-full h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-400">Light</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" /> Security
          </h3>
          <div className="space-y-3">
            <Button variant="secondary" size="sm" className="w-full">Change Password</Button>
            <Button variant="secondary" size="sm" className="w-full">Enable Two-Factor Auth</Button>
            <Button variant="danger" size="sm" className="w-full" onClick={logout}>
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-900/60 p-3 border border-slate-800 text-center">
      <div className="flex justify-center text-emerald-400">{icon}</div>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
      <p className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</p>
    </div>
  );
}

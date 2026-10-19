import { useState } from 'react';
import { Shield, Plus, Search, Trash2, Users, UserCheck, Building2, Mail } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Form';
import { cn, formatDate } from '@/lib/utils';

export function AdminConsole() {
  const { staff, addStaff, removeStaff, members } = useApp();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Trainer');
  const [specialization, setSpecialization] = useState('Strength & Conditioning');
  const [error, setError] = useState('');

  const trainers = staff.filter((s) => s.role === 'Trainer');
  const activeStaff = staff.filter((s) => s.status === 'Active').length;

  const filtered = staff.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (name.trim().length < 2) return setError('Enter a valid name.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError('Enter a valid email.');
    const colors = ['from-blue-400 to-cyan-500', 'from-emerald-400 to-green-500', 'from-amber-400 to-orange-500', 'from-rose-400 to-pink-500', 'from-violet-400 to-indigo-500'];
    addStaff({
      id: `st-${Date.now()}`,
      name,
      email,
      role: role as 'Trainer' | 'Admin',
      specialization,
      membersAssigned: 0,
      status: 'Active',
      joinedDate: new Date().toISOString().slice(0, 10),
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
    });
    setName(''); setEmail(''); setError(''); setShowAdd(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-emerald-400" /> Admin Console
          </h1>
          <p className="mt-1 text-sm text-slate-400">Onboard staff, manage rosters, and oversee gym operations.</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4" /> Onboard Staff
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400"><Users className="w-5 h-5" /></div>
          <div><p className="text-2xl font-bold text-white">{members.length}</p><p className="text-xs text-slate-400">Total Members</p></div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400"><UserCheck className="w-5 h-5" /></div>
          <div><p className="text-2xl font-bold text-white">{trainers.length}</p><p className="text-xs text-slate-400">Active Trainers</p></div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400"><Building2 className="w-5 h-5" /></div>
          <div><p className="text-2xl font-bold text-white">{activeStaff}</p><p className="text-xs text-slate-400">Staff On Duty</p></div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400"><Shield className="w-5 h-5" /></div>
          <div><p className="text-2xl font-bold text-white">{staff.filter((s) => s.role === 'Admin').length}</p><p className="text-xs text-slate-400">Admins</p></div>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          placeholder="Search staff by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                <th className="px-4 py-3 text-left font-semibold">Staff Member</th>
                <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Specialization</th>
                <th className="px-4 py-3 text-center font-semibold">Members</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Joined</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-900/50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-xs font-bold text-slate-950', s.avatarColor)}>
                        {s.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.email}</p>
                      </div>
                      <Badge variant={s.role === 'Admin' ? 'rose' : 'cyan'} className="ml-1">{s.role}</Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-slate-300">{s.specialization}</td>
                  <td className="px-4 py-3 text-center font-bold text-white">{s.membersAssigned}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-300">{formatDate(s.joinedDate)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={s.status === 'Active' ? 'emerald' : 'amber'}>{s.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeStaff(s.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-slate-500 py-10 text-sm">No staff found.</p>}
      </Card>

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Onboard New Staff"
        description="Add a trainer or admin to the gym roster."
      >
        <div className="space-y-4">
          <Input label="Full Name" placeholder="e.g. Ayesha Malik" value={name} onChange={(e) => setName(e.target.value)} icon={<Users className="w-4 h-4" />} />
          <Input label="Email" type="email" placeholder="name@uol.edu.pk" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Trainer</option>
              <option>Admin</option>
            </Select>
            <Select label="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
              <option>Strength & Conditioning</option>
              <option>Hypertrophy & Nutrition</option>
              <option>Mobility & Rehab</option>
              <option>Olympic Lifting</option>
              <option>Operations Manager</option>
            </Select>
          </div>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd}><Plus className="w-4 h-4" /> Add Staff</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

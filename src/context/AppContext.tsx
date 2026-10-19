import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type {
  Exercise,
  LoggedExercise,
  Session,
  User,
  UserRole,
  WorkoutPlan,
} from '@/types';
import {
  currentUser as defaultUser,
  memberProfile,
  memberRoster,
  recentSessions,
  staffRoster,
  workoutPlans as initialPlans,
} from '@/data/mockData';

interface ActiveSet {
  id: string;
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

interface ActiveExercise {
  id: string;
  name: string;
  category: Exercise['category'];
  sets: ActiveSet[];
}

interface AppState {
  user: User | null;
  role: UserRole;
  isAuthed: boolean;
  login: (role: UserRole, name?: string) => void;
  logout: () => void;

  plans: WorkoutPlan[];
  addPlan: (plan: WorkoutPlan) => void;
  removePlan: (planId: string) => void;

  sessions: Session[];
  addSession: (session: Session) => void;

  members: typeof memberRoster;
  staff: typeof staffRoster;
  addStaff: (staff: (typeof staffRoster)[number]) => void;
  removeStaff: (staffId: string) => void;

  activeWorkout: {
    planId: string | null;
    startedAt: number;
    exercises: ActiveExercise[];
  } | null;
  startWorkout: (planId: string) => void;
  toggleSet: (exerciseId: string, setId: string) => void;
  updateSet: (exerciseId: string, setId: string, field: 'reps' | 'weight', value: number) => void;
  addSet: (exerciseId: string) => void;
  finishWorkout: (rating?: number, notes?: string) => void;
  cancelWorkout: () => void;

  profile: typeof memberProfile;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('member');
  const [plans, setPlans] = useState<WorkoutPlan[]>(initialPlans);
  const [sessions, setSessions] = useState<Session[]>(recentSessions);
  const [staff, setStaff] = useState(staffRoster);
  const [activeWorkout, setActiveWorkout] = useState<AppState['activeWorkout']>(null);

  const login = useCallback((selectedRole: UserRole, name?: string) => {
    setRole(selectedRole);
    const baseUser: User = {
      ...defaultUser,
      role: selectedRole,
      name: name ?? defaultUser.name,
    };
    if (selectedRole === 'trainer') {
      baseUser.name = name ?? 'Sarah Khan';
      baseUser.email = 'sarah.khan@uol.edu.pk';
      baseUser.avatarColor = 'from-blue-400 to-cyan-500';
      baseUser.specialization = 'Strength & Conditioning';
    } else if (selectedRole === 'admin') {
      baseUser.name = name ?? 'Dr. Hassan Raza';
      baseUser.email = 'hassan.raza@uol.edu.pk';
      baseUser.avatarColor = 'from-rose-400 to-pink-500';
    }
    setUser(baseUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setActiveWorkout(null);
  }, []);

  const addPlan = useCallback((plan: WorkoutPlan) => {
    setPlans((prev) => [plan, ...prev]);
  }, []);

  const removePlan = useCallback((planId: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== planId));
  }, []);

  const addSession = useCallback((session: Session) => {
    setSessions((prev) => [session, ...prev]);
  }, []);

  const addStaff = useCallback((newStaff: (typeof staffRoster)[number]) => {
    setStaff((prev) => [newStaff, ...prev]);
  }, []);

  const removeStaff = useCallback((staffId: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== staffId));
  }, []);

  const startWorkout = useCallback((planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;
    const exercises: ActiveExercise[] = plan.exercises.map((ex) => ({
      id: ex.id,
      name: ex.name,
      category: ex.category,
      sets: Array.from({ length: ex.sets }, (_, i) => ({
        id: `${ex.id}-set-${i + 1}`,
        setNumber: i + 1,
        reps: ex.reps,
        weight: ex.weight,
        completed: false,
      })),
    }));
    setActiveWorkout({ planId, startedAt: Date.now(), exercises });
  }, [plans]);

  const toggleSet = useCallback((exerciseId: string, setId: string) => {
    setActiveWorkout((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.id === exerciseId
            ? {
                ...ex,
                sets: ex.sets.map((s) =>
                  s.id === setId ? { ...s, completed: !s.completed } : s
                ),
              }
            : ex
        ),
      };
    });
  }, []);

  const updateSet = useCallback(
    (exerciseId: string, setId: string, field: 'reps' | 'weight', value: number) => {
      setActiveWorkout((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          exercises: prev.exercises.map((ex) =>
            ex.id === exerciseId
              ? {
                  ...ex,
                  sets: ex.sets.map((s) =>
                    s.id === setId ? { ...s, [field]: value } : s
                  ),
                }
              : ex
          ),
        };
      });
    },
    []
  );

  const addSet = useCallback((exerciseId: string) => {
    setActiveWorkout((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          const nextNumber = ex.sets.length + 1;
          const last = ex.sets[ex.sets.length - 1];
          return {
            ...ex,
            sets: [
              ...ex.sets,
              {
                id: `${ex.id}-set-${nextNumber}`,
                setNumber: nextNumber,
                reps: last?.reps ?? 8,
                weight: last?.weight ?? 20,
                completed: false,
              },
            ],
          };
        }),
      };
    });
  }, []);

  const finishWorkout = useCallback(
    (rating = 5, notes = '') => {
      if (!activeWorkout || !user) return;
      const exercises: LoggedExercise[] = activeWorkout.exercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        category: ex.category,
        sets: ex.sets.map((s) => ({
          id: s.id,
          setNumber: s.setNumber,
          reps: s.reps,
          weight: s.weight,
          completed: s.completed,
        })),
      }));
      const totalVolume = exercises.reduce(
        (sum, ex) => sum + ex.sets.reduce((s, set) => s + (set.completed ? set.reps * set.weight : 0), 0),
        0
      );
      const durationMinutes = Math.max(1, Math.round((Date.now() - activeWorkout.startedAt) / 60000));
      const session: Session = {
        id: `s-${Date.now()}`,
        memberId: user.id,
        planId: activeWorkout.planId ?? undefined,
        date: new Date().toISOString().slice(0, 10),
        durationMinutes,
        totalVolume,
        exercises,
        rating,
        notes,
      };
      setSessions((prev) => [session, ...prev]);
      setActiveWorkout(null);
    },
    [activeWorkout, user]
  );

  const cancelWorkout = useCallback(() => setActiveWorkout(null), []);

  const value = useMemo<AppState>(
    () => ({
      user,
      role,
      isAuthed: user !== null,
      login,
      logout,
      plans,
      addPlan,
      removePlan,
      sessions,
      addSession,
      members: memberRoster,
      staff,
      addStaff,
      removeStaff,
      activeWorkout,
      startWorkout,
      toggleSet,
      updateSet,
      addSet,
      finishWorkout,
      cancelWorkout,
      profile: memberProfile,
    }),
    [
      user,
      role,
      login,
      logout,
      plans,
      addPlan,
      removePlan,
      sessions,
      addSession,
      staff,
      addStaff,
      removeStaff,
      activeWorkout,
      startWorkout,
      toggleSet,
      updateSet,
      addSet,
      finishWorkout,
      cancelWorkout,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

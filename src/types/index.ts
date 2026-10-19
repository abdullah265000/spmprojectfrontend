export type UserRole = 'member' | 'trainer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarColor: string;
  phone?: string;
  membership?: 'Basic' | 'Premium' | 'Elite';
  joinedDate?: string;
  specialization?: string;
}

export type ExerciseCategory =
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Arms'
  | 'Core'
  | 'Cardio'
  | 'Full Body';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  sets: number;
  reps: number;
  weight: number; // kg
  restSeconds: number;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  assignedTo: string[]; // member ids
  createdBy: string; // trainer id
  createdAt: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: Exercise[];
}

export interface LoggedSet {
  id: string;
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface LoggedExercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  sets: LoggedSet[];
}

export interface Session {
  id: string;
  memberId: string;
  planId?: string;
  date: string;
  durationMinutes: number;
  totalVolume: number; // total kg lifted
  exercises: LoggedExercise[];
  notes?: string;
  rating?: number; // 1-5
}

export interface MemberProfile {
  id: string;
  userId: string;
  age: number;
  heightCm: number;
  startWeightKg: number;
  currentWeightKg: number;
  goalWeightKg: number;
  bodyFatPct: number;
  goal: 'Build Muscle' | 'Lose Weight' | 'Endurance' | 'General Fitness';
  assignedTrainerId?: string;
}

export interface StrengthPoint {
  date: string;
  benchPress: number;
  squat: number;
  deadlift: number;
  overheadPress: number;
}

export interface BodyWeightPoint {
  date: string;
  weight: number;
  bodyFat: number;
}

export interface VolumePoint {
  date: string;
  volume: number;
  duration: number;
}

export type ActivityStatus = 'active' | 'moderate' | 'inactive';

export interface MemberSummary {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  goal: string;
  lastSessionDate: string;
  sessionsThisMonth: number;
  status: ActivityStatus;
  assignedTrainer: string;
  membership: 'Basic' | 'Premium' | 'Elite';
}

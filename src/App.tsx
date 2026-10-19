import { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Sidebar, type ViewKey } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { AuthScreen } from '@/views/AuthScreen';
import { Dashboard } from '@/views/Dashboard';
import { WorkoutPlans } from '@/views/WorkoutPlans';
import { SessionLogger } from '@/views/SessionLogger';
import { ProgressHistory } from '@/views/ProgressHistory';
import { TrainerPortal } from '@/views/TrainerPortal';
import { AdminConsole } from '@/views/AdminConsole';
import { Settings } from '@/views/Settings';

function Shell() {
  const { isAuthed, user } = useApp();
  const [view, setView] = useState<ViewKey>('dashboard');

  if (!isAuthed || !user) {
    return <AuthScreen />;
  }

  // Role-based default view guard
  const allowedViews: ViewKey[] = ['dashboard', 'plans', 'progress', 'settings'];
  if (user.role === 'trainer') allowedViews.push('logger', 'trainer');
  if (user.role === 'admin') allowedViews.push('logger', 'trainer', 'admin');
  const safeView = allowedViews.includes(view) ? view : 'dashboard';

  const renderView = () => {
    switch (safeView) {
      case 'dashboard':
        return <Dashboard onNavigate={setView} />;
      case 'plans':
        return <WorkoutPlans />;
      case 'logger':
        return <SessionLogger onNavigate={setView} />;
      case 'progress':
        return <ProgressHistory />;
      case 'trainer':
        return <TrainerPortal onCreatePlan={() => setView('plans')} />;
      case 'admin':
        return <AdminConsole />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setView} />;
    }
  };

  // Distraction-free logger: hide chrome during active workout handled inside view
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar active={safeView} onNavigate={setView} />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-4 lg:px-6 py-6 pb-28 lg:pb-24 max-w-7xl mx-auto w-full">
          {renderView()}
        </main>
      </div>
      <BottomNav active={safeView} onNavigate={setView} />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}

import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';

export const DashboardLayout = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
    <Sidebar />
    <main className="lg:pl-64">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </main>
  </div>
);

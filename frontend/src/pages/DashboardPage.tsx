import { useQuery } from '@tanstack/react-query';
import { Contact, Target, TrendingUp, Users, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { StatCard } from '../components/ui/StatCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { leadService } from '../services/leadService';

export const DashboardPage = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: leadService.getStats,
  });

  return (
    <>
      <Navbar
        title="Dashboard"
        subtitle="Overview of your lead pipeline"
        actions={
          <Link to="/leads/new">
            <Button size="sm">+ New Lead</Button>
          </Link>
        }
      />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Leads" value={stats?.total ?? 0} icon={Users} color="brand" />
          <StatCard
            title="Qualified"
            value={stats?.qualified ?? 0}
            icon={Target}
            color="emerald"
          />
          <StatCard
            title="Contacted"
            value={stats?.contacted ?? 0}
            icon={Contact}
            color="amber"
          />
          <StatCard title="Lost" value={stats?.lost ?? 0} icon={XCircle} color="red" />
        </div>
      )}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Quick actions</h2>
            <p className="text-sm text-slate-500">Manage your leads efficiently</p>
          </div>
          <TrendingUp className="h-8 w-8 text-brand-500" />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/leads">
            <Button variant="secondary">View all leads</Button>
          </Link>
          <Link to="/leads/new">
            <Button>Create new lead</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

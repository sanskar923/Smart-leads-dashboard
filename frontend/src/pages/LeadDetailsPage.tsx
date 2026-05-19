import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Mail, User } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/Spinner';
import { leadService } from '../services/leadService';
import { cn } from '../utils/cn';

const statusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-amber-100 text-amber-700',
  Qualified: 'bg-emerald-100 text-emerald-700',
  Lost: 'bg-red-100 text-red-700',
};

export const LeadDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: lead, isLoading, isError, error } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadService.getLead(id!),
    enabled: !!id,
  });

  if (isLoading) return <PageLoader />;
  if (isError || !lead) {
    return <p className="text-red-500">{error?.message ?? 'Lead not found'}</p>;
  }

  return (
    <>
      <Navbar
        title={lead.name}
        subtitle="Lead details"
        actions={
          <div className="flex gap-2">
            <Link to="/leads">
              <Button variant="secondary" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link to={`/leads/${lead._id}/edit`}>
              <Button size="sm">Edit Lead</Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-semibold">Contact Information</h2>
          <dl className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-slate-400" />
              <div>
                <dt className="text-xs text-slate-500">Name</dt>
                <dd className="font-medium">{lead.name}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-slate-400" />
              <div>
                <dt className="text-xs text-slate-500">Email</dt>
                <dd className="font-medium">{lead.email}</dd>
              </div>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-semibold">Lead Details</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-slate-500">Status</dt>
              <dd className="mt-1">
                <span
                  className={cn(
                    'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                    statusColors[lead.status]
                  )}
                >
                  {lead.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Source</dt>
              <dd className="font-medium">{lead.source}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Assigned To</dt>
              <dd className="font-medium">
                {lead.assignedTo.name} ({lead.assignedTo.email})
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Created</dt>
              <dd className="font-medium">{new Date(lead.createdAt).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
};

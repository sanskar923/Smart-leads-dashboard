import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Lead } from '../../types/lead';
import { cn } from '../../utils/cn';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';

interface LeadTableProps {
  leads: Lead[];
  isAdmin: boolean;
  onDelete: (lead: Lead) => void;
}

const statusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Contacted: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Qualified: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Lost: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export const LeadTable = ({ leads, isAdmin, onDelete }: LeadTableProps) => {
  if (leads.length === 0) {
    return (
      <EmptyState
        title="No leads found"
        description="Try adjusting your filters or create a new lead."
        action={
          <Link to="/leads/new">
            <Button>Create Lead</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
          <tr>
            <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Name</th>
            <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Email</th>
            <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Status</th>
            <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Source</th>
            <th className="hidden px-4 py-3 font-medium text-slate-600 dark:text-slate-300 md:table-cell">
              Assigned
            </th>
            <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{lead.name}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{lead.email}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                    statusColors[lead.status]
                  )}
                >
                  {lead.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{lead.source}</td>
              <td className="hidden px-4 py-3 text-slate-600 dark:text-slate-300 md:table-cell">
                {lead.assignedTo.name}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Link
                    to={`/leads/${lead._id}`}
                    className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/leads/${lead._id}/edit`}
                    className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => onDelete(lead)}
                      className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/50">
    <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
      <Inbox className="h-8 w-8 text-slate-400" />
    </div>
    <h3 className="text-lg font-medium text-slate-900 dark:text-white">{title}</h3>
    {description && (
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { LeadFilters as Filters, LeadSort, LeadSource, LeadStatus } from '../../types/lead';

interface LeadFiltersProps {
  filters: Filters;
  onChange: (filters: Partial<Filters>) => void;
  searchInput: string;
  onSearchChange: (value: string) => void;
}

const statusOptions: { value: string; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const sourceOptions: { value: string; label: string }[] = [
  { value: '', label: 'All sources' },
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

const sortOptions: { value: LeadSort; label: string }[] = [
  { value: 'latest', label: 'Latest first' },
  { value: 'oldest', label: 'Oldest first' },
];

export const LeadFiltersBar = ({
  filters,
  onChange,
  searchInput,
  onSearchChange,
}: LeadFiltersProps) => (
  <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">
    <div className="relative sm:col-span-2 lg:col-span-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        placeholder="Search name or email..."
        value={searchInput}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9"
      />
    </div>
    <Select
      label="Status"
      value={filters.status ?? ''}
      onChange={(e) =>
        onChange({ status: (e.target.value || undefined) as LeadStatus | undefined })
      }
      options={statusOptions}
    />
    <Select
      label="Source"
      value={filters.source ?? ''}
      onChange={(e) =>
        onChange({ source: (e.target.value || undefined) as LeadSource | undefined })
      }
      options={sourceOptions}
    />
    <Select
      label="Sort"
      value={filters.sort}
      onChange={(e) => onChange({ sort: e.target.value as LeadSort })}
      options={sortOptions}
    />
  </div>
);

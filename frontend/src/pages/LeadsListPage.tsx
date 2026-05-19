import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { LeadFiltersBar } from '../components/leads/LeadFilters';
import { LeadTable } from '../components/leads/LeadTable';
import { Pagination } from '../components/leads/Pagination';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { TableSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDebounce } from '../hooks/useDebounce';
import { leadService } from '../services/leadService';
import type { Lead, LeadFilters } from '../types/lead';

export const LeadsListPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'Admin';

  const [filters, setFilters] = useState<LeadFilters>({
    page: 1,
    sort: 'latest',
  });
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const activeFilters: LeadFilters = {
    ...filters,
    search: debouncedSearch || undefined,
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['leads', activeFilters],
    queryFn: () => leadService.getLeads(activeFilters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadService.deleteLead(id),
    onSuccess: () => {
      showToast('Lead deleted successfully', 'success');
      void queryClient.invalidateQueries({ queryKey: ['leads'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setDeleteTarget(null);
    },
    onError: (err: Error) => showToast(err.message, 'error'),
  });

  const handleFilterChange = (partial: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial, page: 1 }));
  };

  const handleExport = async () => {
    try {
      const exportFilters = {
        status: activeFilters.status,
        source: activeFilters.source,
        search: activeFilters.search,
        sort: activeFilters.sort,
      };
      const blob = await leadService.exportCsv(exportFilters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gigflow-leads-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('CSV exported successfully', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Export failed', 'error');
    }
  };

  return (
    <>
      <Navbar
        title="Leads"
        subtitle="Manage and track your sales pipeline"
        actions={
          <div className="flex gap-2">
            {isAdmin && (
              <Button variant="secondary" size="sm" onClick={() => void handleExport()}>
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            )}
            <Link to="/leads/new">
              <Button size="sm">
                <Plus className="h-4 w-4" />
                New Lead
              </Button>
            </Link>
          </div>
        }
      />

      <div className="space-y-4">
        <LeadFiltersBar
          filters={filters}
          onChange={handleFilterChange}
          searchInput={searchInput}
          onSearchChange={handleSearchChange}
        />

        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <p className="text-center text-red-500">{error.message}</p>
        ) : (
          <>
            <LeadTable
              leads={data?.data ?? []}
              isAdmin={isAdmin}
              onDelete={setDeleteTarget}
            />
            {data && data.totalRecords > 0 && (
              <Pagination
                currentPage={data.currentPage}
                totalPages={data.totalPages}
                totalRecords={data.totalRecords}
                hasNextPage={data.hasNextPage}
                hasPrevPage={data.hasPrevPage}
                onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
              />
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={!!deleteTarget}
        title="Delete lead"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
};

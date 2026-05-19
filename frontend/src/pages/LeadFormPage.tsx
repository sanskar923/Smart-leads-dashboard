import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { LeadForm } from '../components/leads/LeadForm';
import { leadToFormData } from '../utils/leadUtils';
import { PageLoader } from '../components/ui/Spinner';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { leadService } from '../services/leadService';
import type { LeadFormData } from '../types/lead';

export const LeadFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: authService.getUsers,
  });

  const { data: lead, isLoading: leadLoading } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadService.getLead(id!),
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: (data: LeadFormData) =>
      isEdit ? leadService.updateLead(id!, data) : leadService.createLead(data),
    onSuccess: () => {
      showToast(isEdit ? 'Lead updated' : 'Lead created', 'success');
      void queryClient.invalidateQueries({ queryKey: ['leads'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      navigate('/leads');
    },
    onError: (err: Error) => showToast(err.message, 'error'),
  });

  if (usersLoading || (isEdit && leadLoading)) return <PageLoader />;

  return (
    <>
      <Navbar title={isEdit ? 'Edit Lead' : 'Create Lead'} subtitle="Fill in the lead information" />
      <div className="max-w-xl rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <LeadForm
          users={users ?? []}
          defaultValues={lead ? leadToFormData(lead) : undefined}
          onSubmit={async (data) => {
            await mutation.mutateAsync(data);
          }}
          isLoading={mutation.isPending}
          submitLabel={isEdit ? 'Update Lead' : 'Create Lead'}
        />
      </div>
    </>
  );
};

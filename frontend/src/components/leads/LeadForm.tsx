import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { User } from '../../types/auth';
import type { LeadFormData } from '../../types/lead';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
  assignedTo: z.string().min(1, 'Please assign a user'),
});

interface LeadFormProps {
  users: User[];
  defaultValues?: Partial<LeadFormData>;
  onSubmit: (data: LeadFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

const statusOptions = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const sourceOptions = [
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

export const LeadForm = ({
  users,
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = 'Save Lead',
}: LeadFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: 'New',
      source: 'Website',
      ...defaultValues,
    },
  });

  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.name} (${u.role})`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input label="Name" error={errors.name?.message} {...register('name')} />
      <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
      <Select
        label="Status"
        options={statusOptions}
        error={errors.status?.message}
        {...register('status')}
      />
      <Select
        label="Source"
        options={sourceOptions}
        error={errors.source?.message}
        {...register('source')}
      />
      <Select
        label="Assigned To"
        options={[{ value: '', label: 'Select user' }, ...userOptions]}
        error={errors.assignedTo?.message}
        {...register('assignedTo')}
      />
      <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  );
};

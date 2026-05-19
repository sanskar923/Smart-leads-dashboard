import { z } from 'zod';

const leadStatusEnum = z.enum(['New', 'Contacted', 'Qualified', 'Lost']);
const leadSourceEnum = z.enum(['Website', 'Instagram', 'Referral']);

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(150),
  email: z.string().email('Invalid email address'),
  status: leadStatusEnum.optional().default('New'),
  source: leadSourceEnum,
  assignedTo: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid assigned user ID'),
});

export const updateLeadSchema = z
  .object({
    name: z.string().min(2).max(150).optional(),
    email: z.string().email().optional(),
    status: leadStatusEnum.optional(),
    source: leadSourceEnum.optional(),
    assignedTo: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const leadQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  status: leadStatusEnum.optional(),
  source: leadSourceEnum.optional(),
  search: z.string().trim().optional(),
  sort: z.enum(['latest', 'oldest']).optional().default('latest'),
});

export const leadIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid lead ID'),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadQueryInput = z.infer<typeof leadQuerySchema>;

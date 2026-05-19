import type { Lead, LeadFormData } from '../types/lead';

export const leadToFormData = (lead: Lead): LeadFormData => ({
  name: lead.name,
  email: lead.email,
  status: lead.status,
  source: lead.source,
  assignedTo: lead.assignedTo._id,
});

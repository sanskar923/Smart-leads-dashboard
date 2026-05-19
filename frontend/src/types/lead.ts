export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type LeadSort = 'latest' | 'oldest';

export interface AssignedUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo: AssignedUser;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo: string;
}

export interface LeadFilters {
  page: number;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort: LeadSort;
}

export interface PaginatedLeadsResponse {
  success: boolean;
  data: Lead[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface DashboardStats {
  total: number;
  qualified: number;
  lost: number;
  contacted: number;
  new: number;
}

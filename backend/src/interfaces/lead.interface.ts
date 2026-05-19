import type { Document, Types } from 'mongoose';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type LeadSort = 'latest' | 'oldest';

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILeadDocument extends ILead, Document {
  _id: Types.ObjectId;
}

export interface ILeadPopulated extends Omit<ILead, 'assignedTo' | 'createdBy'> {
  _id: Types.ObjectId;
  assignedTo: {
    _id: Types.ObjectId;
    name: string;
    email: string;
    role: string;
  };
  createdBy: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  };
}

export interface LeadQueryParams {
  page?: string;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: LeadSort;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

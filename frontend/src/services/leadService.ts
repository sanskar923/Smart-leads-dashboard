import type { ApiResponse } from '../types/api';
import type {
  DashboardStats,
  Lead,
  LeadFilters,
  LeadFormData,
  PaginatedLeadsResponse,
} from '../types/lead';
import { api } from './api';

export const leadService = {
  getLeads: async (filters: LeadFilters): Promise<PaginatedLeadsResponse> => {
    const { data } = await api.get<PaginatedLeadsResponse>('/leads', {
      params: filters,
    });
    return data;
  },

  getLead: async (id: string): Promise<Lead> => {
    const { data } = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return data.data;
  },

  createLead: async (payload: LeadFormData): Promise<Lead> => {
    const { data } = await api.post<ApiResponse<Lead>>('/leads', payload);
    return data.data;
  },

  updateLead: async (id: string, payload: Partial<LeadFormData>): Promise<Lead> => {
    const { data } = await api.put<ApiResponse<Lead>>(`/leads/${id}`, payload);
    return data.data;
  },

  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<ApiResponse<DashboardStats>>('/leads/stats');
    return data.data;
  },

  exportCsv: async (filters: Omit<LeadFilters, 'page'>): Promise<Blob> => {
    const { data } = await api.get<Blob>('/leads/export', {
      params: filters,
      responseType: 'blob',
    });
    return data;
  },
};

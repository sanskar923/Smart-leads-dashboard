import type { ApiResponse } from '../types/api';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../types/auth';
import { api } from './api';

export const authService = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse['data']> => {
    const { data } = await api.post<AuthResponse>('/auth/register', credentials);
    return data.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse['data']> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data.data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    return data.data;
  },

  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get<ApiResponse<User[]>>('/auth/users');
    return data.data;
  },
};

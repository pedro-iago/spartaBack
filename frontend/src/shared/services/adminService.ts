import { apiClient } from '../api/apiClient';

export interface AdminDashboardDTO {
  totalUsers: number;
  totalStudents: number;
  totalPersonals: number;
  totalTrainings: number;
  pendingReviews: number;
  activeTrainings: number;
  archivedTrainings: number;
}

export interface AdminUserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export interface TimeSeriesDTO {
  date: string;
  value: number;
}

export const adminService = {
  /** GET /admin/dashboard */
  getDashboard: async (): Promise<AdminDashboardDTO> => {
    const { data } = await apiClient.get<AdminDashboardDTO>('/admin/dashboard');
    return data;
  },

  /** GET /admin/users */
  listUsers: async (): Promise<AdminUserDTO[]> => {
    const { data } = await apiClient.get<AdminUserDTO[]>('/admin/users');
    return data ?? [];
  },

  /** PUT /admin/users/{id}/role */
  updateUserRole: async (userId: string, newRole: string): Promise<void> => {
    await apiClient.put(`/admin/users/${userId}/role`, { newRole });
  },

  /** PUT /admin/users/{id}/status - alterna ativo/inativo */
  toggleUserStatus: async (userId: string): Promise<void> => {
    await apiClient.put(`/admin/users/${userId}/status`);
  },

  /** GET /admin/metrics/users?period=DAY|MONTH */
  getMetricsUsers: async (period = 'DAY'): Promise<TimeSeriesDTO[]> => {
    const { data } = await apiClient.get<TimeSeriesDTO[]>('/admin/metrics/users', { params: { period } });
    return data ?? [];
  },

  /** GET /admin/metrics/trainings?period=DAY|MONTH */
  getMetricsTrainings: async (period = 'DAY'): Promise<TimeSeriesDTO[]> => {
    const { data } = await apiClient.get<TimeSeriesDTO[]>('/admin/metrics/trainings', { params: { period } });
    return data ?? [];
  },

  /** GET /admin/metrics/sessions?period=DAY|MONTH */
  getMetricsSessions: async (period = 'DAY'): Promise<TimeSeriesDTO[]> => {
    const { data } = await apiClient.get<TimeSeriesDTO[]>('/admin/metrics/sessions', { params: { period } });
    return data ?? [];
  },

  /** GET /admin/metrics/active-students?period=DAY|MONTH */
  getMetricsActiveStudents: async (period = 'DAY'): Promise<TimeSeriesDTO[]> => {
    const { data } = await apiClient.get<TimeSeriesDTO[]>('/admin/metrics/active-students', { params: { period } });
    return data ?? [];
  },
};

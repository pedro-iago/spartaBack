import axios, { AxiosInstance, AxiosError } from 'axios';

const BASE_URL = (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || 'http://localhost:8080';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Interceptor de requisição: envia o token no header (backend aceita Authorization: Bearer)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@sparta:token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Interceptor de resposta: em 401/403 limpa sessão e redireciona para login
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('@sparta:token');
      localStorage.removeItem('@sparta:user');
      const path = window.location.hash?.replace('#', '') || window.location.pathname;
      if (path !== '/login' && !path.startsWith('/login')) {
        window.location.hash = '/login';
      }
    }
    return Promise.reject(error);
  }
);
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

// 1. Configuração da URL Base
// Tenta ler do arquivo .env (Vite), se não achar, usa localhost:8080 como fallback
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor de Requisição (Envia o Token)
apiClient.interceptors.request.use(
  (config: any) => { // Use 'any' ou InternalAxiosRequestConfig se for TS estrito
    const token = localStorage.getItem('@sparta:token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para debug (pode remover em produção)
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor de Resposta (Trata erros globais)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Se der erro de autorização (401) ou proibido (403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Sessão expirada ou acesso negado. Redirecionando para login...");
      
      // Opcional: Forçar logout visual
      // localStorage.removeItem('@sparta:token');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);
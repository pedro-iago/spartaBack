import { apiClient } from '../api/apiClient';
import { LoginResponseDTO, RegisterDTO } from '../types';

export const authService = {
  login: async (email: string, password: string) => {
    // Post para o Spring Boot
    const { data } = await apiClient.post<LoginResponseDTO>('/auth/login', { 
      email, 
      password 
    });
    return data;
  },

  register: async (payload: RegisterDTO) => {
    // O role geralmente é definido no backend ou fixo como STUDENT no registro público
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  }
};
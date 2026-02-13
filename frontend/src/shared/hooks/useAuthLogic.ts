import { useState } from 'react';
import { authService } from '../services/authService';
import { LoginResponseDTO } from '../types';

export const useAuthLogic = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<LoginResponseDTO> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await authService.login(email, password);
      
      // Salva token
      localStorage.setItem('@sparta:token', data.token);
      localStorage.setItem('@sparta:user', JSON.stringify({ 
        name: data.name, 
        role: data.role,
        email: data.email 
      }));
      
      return data;
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.status === 403 
        ? 'Credenciais inválidas.' 
        : 'Erro ao conectar com o servidor.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error
  };
};
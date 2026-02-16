import { apiClient } from '../api/apiClient';
import type { CreateTrainingDTO, TrainingResponseDTO } from '../types';

export const trainingService = {
  /** POST /trainings/request - Solicita novo treino (aluno) */
  createRequest: async (data: CreateTrainingDTO): Promise<TrainingResponseDTO> => {
    const { data: response } = await apiClient.post<TrainingResponseDTO>('/trainings/request', data);
    return response;
  },

  /** GET /trainings/my-active - Treino ativo do aluno logado */
  getMyActiveTraining: async (): Promise<TrainingResponseDTO | null> => {
    try {
      const { data } = await apiClient.get<TrainingResponseDTO>('/trainings/my-active');
      return data;
    } catch {
      return null;
    }
  },

  /** GET /trainings/pending - Lista treinos pendentes de aprovação (personal) */
  getPendingTrainings: async (): Promise<TrainingResponseDTO[]> => {
    const { data } = await apiClient.get<TrainingResponseDTO[]>('/trainings/pending');
    return data ?? [];
  },
};
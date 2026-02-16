import { apiClient } from '../api/apiClient';
import type { ApproveTrainingDTO, CreateTrainingDTO, PendingReviewDTO, TrainingResponseDTO, UpdateTrainingDTO } from '../types';

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

  /** GET /trainings/reviews/pending - Treinos pendentes com anamnese do aluno para avaliar */
  getPendingReviewsWithAnamnesis: async (): Promise<PendingReviewDTO[]> => {
    const { data } = await apiClient.get<PendingReviewDTO[]>('/trainings/reviews/pending');
    return data ?? [];
  },

  /** PUT /trainings/{id} - Atualiza treino (personal revisa sets) */
  updateTraining: async (trainingId: string, payload: UpdateTrainingDTO): Promise<TrainingResponseDTO> => {
    const { data } = await apiClient.put<TrainingResponseDTO>(`/trainings/${trainingId}`, payload);
    return data;
  },

  /** POST /trainings/{id}/approve - Aprova ou rejeita treino */
  approveTraining: async (trainingId: string, payload: ApproveTrainingDTO): Promise<TrainingResponseDTO> => {
    const { data } = await apiClient.post<TrainingResponseDTO>(`/trainings/${trainingId}/approve`, payload);
    return data;
  },
};
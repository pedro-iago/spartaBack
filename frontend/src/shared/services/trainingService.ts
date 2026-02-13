import { apiClient } from '../api/apiClient';
import type { StudentWorkoutPlanResponse, CreateTrainingDTO } from '../types';

export const trainingService = {
  createRequest: async (data: CreateTrainingDTO) => {
    const { data: response } = await apiClient.post('/trainings', data);
    return response;
  },

  /** Plano de treinos da semana (seg a dom) passado pelo personal. Endpoint: GET /student/workout-plan */
  getMyWorkoutPlan: async (): Promise<StudentWorkoutPlanResponse> => {
    const { data } = await apiClient.get<StudentWorkoutPlanResponse>('/student/workout-plan');
    return data;
  },
};
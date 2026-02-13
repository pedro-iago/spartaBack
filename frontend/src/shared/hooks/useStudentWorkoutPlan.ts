import { useState, useEffect, useMemo } from "react";
import type { ScheduledWorkout, DayOfWeek } from "@/shared/types";
import { trainingService } from "@/shared/services/trainingService";

const DIAS: Record<DayOfWeek, string> = {
  1: "Segunda",
  2: "Terça",
  3: "Quarta",
  4: "Quinta",
  5: "Sexta",
  6: "Sábado",
  7: "Domingo",
};

/** Retorna 1 (Seg) a 7 (Dom) a partir de Date */
export function getTodayDayOfWeek(): DayOfWeek {
  const d = new Date().getDay(); // 0=Dom, 1=Seg, ..., 6=Sáb
  return (d === 0 ? 7 : d) as DayOfWeek;
}

export function getDayLabel(dayOfWeek: DayOfWeek): string {
  return DIAS[dayOfWeek];
}

/** Ordenação Seg(1) a Dom(7) */
const ORDER: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 7];

/** Dados mock até o backend estar disponível */
const MOCK_PLAN: ScheduledWorkout[] = [
  { id: "1", dayOfWeek: 1, name: "Peito e Tríceps", durationMinutes: 50, completed: true },
  { id: "2", dayOfWeek: 2, name: "Costas e Bíceps", durationMinutes: 55, completed: true },
  { id: "3", dayOfWeek: 3, name: "Pernas", durationMinutes: 60, completed: false },
  { id: "4", dayOfWeek: 4, name: "Ombros e Abdômen", durationMinutes: 45, completed: false },
  { id: "5", dayOfWeek: 5, name: "Full Body", durationMinutes: 50, completed: false },
  { id: "6", dayOfWeek: 6, name: "Cardio leve", durationMinutes: 30, completed: false },
  // Domingo (7) sem treino = descanso
];

export interface UseStudentWorkoutPlanResult {
  /** Plano da semana ordenado Seg a Dom; dias sem treino não vêm no array (backend envia só os que têm treino) */
  weekPlan: ScheduledWorkout[];
  /** Treino do dia atual (null se for dia de descanso) */
  todayWorkout: ScheduledWorkout | null;
  /** Para exibir lista Seg a Dom: mescla dias 1–7 com treinos (undefined = descanso) */
  weekWithSlots: { dayOfWeek: DayOfWeek; label: string; workout: ScheduledWorkout | undefined }[];
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const USE_MOCK = true; // trocar para false quando o backend estiver pronto

export function useStudentWorkoutPlan(): UseStudentWorkoutPlanResult {
  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>(MOCK_PLAN);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlan = async () => {
    if (USE_MOCK) return;
    setIsLoading(true);
    try {
      const res = await trainingService.getMyWorkoutPlan();
      setScheduledWorkouts(res.scheduledWorkouts ?? []);
    } catch {
      setScheduledWorkouts(MOCK_PLAN);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const today = getTodayDayOfWeek();
  const todayWorkout = useMemo(
    () => scheduledWorkouts.find((w) => w.dayOfWeek === today) ?? null,
    [scheduledWorkouts, today]
  );

  const weekWithSlots = useMemo(
    () =>
      ORDER.map((dayOfWeek) => ({
        dayOfWeek,
        label: getDayLabel(dayOfWeek),
        workout: scheduledWorkouts.find((w) => w.dayOfWeek === dayOfWeek),
      })),
    [scheduledWorkouts]
  );

  return {
    weekPlan: [...scheduledWorkouts].sort((a, b) => a.dayOfWeek - b.dayOfWeek),
    todayWorkout,
    weekWithSlots,
    isLoading,
    refetch: fetchPlan,
  };
}

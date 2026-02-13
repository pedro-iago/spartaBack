import type { Workout } from "@/shared/types";

const STORAGE_KEY = "sparta_current_workout";

/**
 * Offline-first: persiste a ficha de treino no localStorage para que o usuário
 * não perca o treino se a conexão cair ou ao reabrir o app.
 */
export function getWorkoutFromStorage(): Workout | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Workout;
    if (!data?.id || !Array.isArray(data.exercises)) return null;
    return data;
  } catch {
    return null;
  }
}

export function setWorkoutInStorage(workout: Workout): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workout));
  } catch {
    // quota ou localStorage indisponível
  }
}

export function clearWorkoutFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

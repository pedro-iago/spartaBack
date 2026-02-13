import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSparta } from "@/shared/context/SpartaContext";
import { Card } from "@/ui/components/ui/card";
import { Button } from "@/ui/components/ui/button";
import { PageHeader } from "@/ui/components/ui/page-header";
import { FloatingNav, type FloatingNavItem } from "@/ui/components/ui/floating-nav";
import { PlayCircle, ArrowLeft, Flame, Clock, Dumbbell, Check, Home, ChefHat, User } from "lucide-react";
import { IMAGES } from "@/shared/constants/images";
import { getWorkoutFromStorage, setWorkoutInStorage } from "@/shared/utils/workoutStorage";
import type { Workout, Exercise } from "@/shared/types";
import { MuscleGroup } from "@/shared/types";

/** Dados exibidos na tela (apenas apresentação). Calorias quando vier da API no futuro. */
export interface WorkoutOverviewData {
  workout: Workout;
  /** Calorias estimadas */
  caloriesEstimated?: number;
  /** URL do avatar do instrutor ou indicador de contexto (opcional) */
  instructorAvatarUrl?: string;
}

/** Treino de demonstração quando o contexto ainda não tem currentWorkout (ex.: após login sem API). Exportado para ActiveWorkout. */
export const DEMO_WORKOUT: Workout = {
  id: "demo-1",
  name: "TREINO A - Peito e Tríceps",
  focalMuscles: "Peito e Tríceps",
  duration: 45,
  completedCount: 0,
  exercises: [
    {
      id: "ex-1",
      name: "Agachamento livre",
      sets: 4,
      reps: "10-12",
      muscleGroup: MuscleGroup.LEGS,
      image: IMAGES.WORKOUT_MAIN,
      equipment: "Barra",
    },
    {
      id: "ex-2",
      name: "Supino reto",
      sets: 4,
      reps: "10-12",
      muscleGroup: MuscleGroup.CHEST,
      image: IMAGES.WORKOUT_MAIN,
      technique: "Ponto de Falha",
      equipment: "Barra",
    },
    {
      id: "ex-3",
      name: "Remada curvada",
      sets: 3,
      reps: "12",
      muscleGroup: MuscleGroup.BACK,
      image: IMAGES.WORKOUT_MAIN,
      technique: "Drop Set",
      equipment: "Halteres",
    },
  ],
  isAiGenerated: true,
};

export interface WorkoutOverviewCallbacks {
  onBack: () => void;
  onStartWorkout: () => void;
  /** Ao marcar/desmarcar exercício como concluído (checkbox) */
  onToggleExerciseDone?: (exerciseId: string) => void;
  /** Ao clicar em um exercício da lista (abrir tela de execução) */
  onExerciseClick?: (exercise: Exercise, index: number) => void;
}

export interface WorkoutOverviewProps extends WorkoutOverviewData, WorkoutOverviewCallbacks {}

/**
 * Tela de visão geral do treino (definido pelo personal).
 * Header sticky, progress bar e lista com thumbnail, metadados, badge de técnica e checkbox.
 */
export function WorkoutOverviewScreen({
  workout,
  caloriesEstimated,
  instructorAvatarUrl,
  onBack,
  onStartWorkout,
  onToggleExerciseDone,
  onExerciseClick,
}: WorkoutOverviewProps) {
  const completedCount = useMemo(
    () => workout.exercises.filter((e) => e.done).length,
    [workout.exercises]
  );
  const totalCount = workout.exercises.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const heroImage = workout.exercises[0]?.image || IMAGES.WORKOUT_MAIN;

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-page-dark flex flex-col">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-1">
        <PageHeader
          title="Treino"
          subtitle="Visão geral"
          leftSlot={
            <button
              type="button"
              onClick={onBack}
              className="flex min-w-[44px] min-h-[44px] size-11 shrink-0 items-center justify-center rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors touch-manipulation active:scale-95"
              aria-label="Voltar"
            >
              <ArrowLeft className="size-5 sm:size-6" />
            </button>
          }
          rightSlot={
            instructorAvatarUrl ? (
              <img src={instructorAvatarUrl} alt="" className="size-10 rounded-full object-cover border-2 border-white/20 shrink-0" />
            ) : (
              <div className="size-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                <Dumbbell className="size-4 sm:size-5 text-primary" />
              </div>
            )
          }
        />

        <main className="flex-1 overflow-y-auto pb-[180px] sm:pb-[200px]">
          {/* Hero compacto */}
          <div className="relative w-full aspect-[3/1] max-h-[100px] sm:max-h-[120px] rounded-xl overflow-hidden bg-black/30 mb-4 sm:mb-5">
            <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>

          {/* Nome do treino + meta + progresso — card clean */}
          <div className="rounded-xl p-4 sm:p-5 mb-4 sm:mb-5 bg-white/[0.04] border border-white/[0.06]">
            <h2 className="text-base sm:text-lg font-semibold text-white leading-tight mb-2 sm:mb-3">
              {workout.name}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60 mb-3">
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-primary shrink-0" />
                {workout.duration} min
              </span>
              <span className="flex items-center gap-1.5">
                <Dumbbell className="size-3.5 text-primary shrink-0" />
                {workout.exercises.length} exercícios
              </span>
              {caloriesEstimated != null && (
                <span className="flex items-center gap-1.5">
                  <Flame className="size-3.5 text-primary shrink-0" />
                  {caloriesEstimated} kcal
                </span>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-white/50">
                <span>Progresso</span>
                <span>{completedCount}/{totalCount}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lista de exercícios — cards clean */}
          <div className="mb-4">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-white/50 mb-2 sm:mb-3">
              Sequência
            </h3>
            <div className="flex flex-col gap-2 sm:gap-3">
              {workout.exercises.map((ex, idx) => (
                <Card
                  key={ex.id}
                  variant="glass"
                  className={`overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] transition-all touch-manipulation active:scale-[0.99] ${
                    onExerciseClick ? "cursor-pointer hover:bg-white/[0.06]" : ""
                  }`}
                  onClick={() => onExerciseClick?.(ex, idx)}
                >
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                    <div className="shrink-0 size-12 sm:size-14 rounded-lg overflow-hidden bg-black/20 aspect-square">
                      <img
                        src={ex.image || IMAGES.WORKOUT_MAIN}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium text-sm sm:text-base leading-tight line-clamp-1">
                        {ex.name}
                      </p>
                      <p className="text-white/50 text-xs mt-0.5">
                        {ex.sets} × {ex.reps} reps
                      </p>
                      {ex.technique && (
                        <span className="inline-block mt-1 text-[10px] font-medium uppercase tracking-wide text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded">
                          {ex.technique}
                        </span>
                      )}
                    </div>
                    {onToggleExerciseDone && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleExerciseDone(ex.id);
                        }}
                        className={`shrink-0 min-w-[44px] min-h-[44px] size-11 rounded-full border-2 flex items-center justify-center transition-colors touch-manipulation active:scale-95 ${
                          ex.done
                            ? "bg-primary border-primary text-[#171512]"
                            : "border-white/20 text-white/40 hover:border-white/30 hover:text-white/60"
                        }`}
                        aria-label={ex.done ? "Desmarcar" : "Marcar como feito"}
                      >
                        {ex.done ? <Check className="size-5" /> : null}
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            {workout.exercises.length === 0 && (
              <p className="text-white/40 text-sm py-6 text-center rounded-xl border border-dashed border-white/10">
                Nenhum exercício neste treino.
              </p>
            )}
          </div>
        </main>

        {/* CTA fixo — acima da nav, padronizado com padding lateral */}
        <div
          className="fixed left-0 right-0 z-40 flex justify-center px-4"
          style={{ bottom: "calc(80px + max(0.5rem, env(safe-area-inset-bottom)))" }}
        >
          <div className="w-full max-w-4xl px-6 sm:px-10">
            <Button
              variant="default"
              size="lg"
              className="w-full h-12 px-6 text-[15px] font-semibold rounded-xl flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(213,159,57,0.3)] touch-manipulation active:scale-[0.98]"
              onClick={onStartWorkout}
            >
              <PlayCircle className="size-5 shrink-0" />
              Iniciar treino
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Container que injeta dados do contexto e navegação.
 * Mantém estado local de "done" por exercício para a progress bar e checkbox.
 */
const WorkoutOverview: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSparta();
  const workoutBase = user?.currentWorkout ?? getWorkoutFromStorage() ?? DEMO_WORKOUT;
  const [exerciseDone, setExerciseDone] = useState<Record<string, boolean>>({});

  const workout = useMemo(
    () => ({
      ...workoutBase,
      exercises: workoutBase.exercises.map((e) => ({
        ...e,
        done: exerciseDone[e.id] ?? e.done ?? false,
      })),
    }),
    [workoutBase, exerciseDone]
  );

  useEffect(() => {
    setWorkoutInStorage(workout);
  }, [workout]);

  const handleToggleDone = (exerciseId: string) => {
    setExerciseDone((prev) => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };

  const floatingNavItems: FloatingNavItem[] = [
    { icon: <Home />, label: "Início", onClick: () => navigate("/dashboard/student") },
    { icon: <Dumbbell />, label: "Treinos", onClick: () => navigate("/student/workouts") },
    { icon: <ChefHat />, label: "Dieta", onClick: () => navigate("/diet") },
    { icon: <User />, label: "Perfil", onClick: () => navigate("/dashboard/perfil") },
  ];

  return (
    <>
      <WorkoutOverviewScreen
        workout={workout}
        instructorAvatarUrl={IMAGES.INSTRUCTOR}
        onBack={() => navigate(-1)}
        onStartWorkout={() => navigate("/active-workout", { state: { workout, startTimer: true } })}
        onToggleExerciseDone={handleToggleDone}
        onExerciseClick={(_, index) => navigate("/active-workout", { state: { workout, startAt: index, startTimer: true } })}
      />
      <FloatingNav items={floatingNavItems} position="bottom-center" />
    </>
  );
};

export default WorkoutOverview;

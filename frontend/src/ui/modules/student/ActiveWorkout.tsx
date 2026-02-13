import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Clock, Minus, Plus } from "lucide-react";
import { useSparta } from "@/shared/context/SpartaContext";
import { DEMO_WORKOUT } from "./WorkoutOverview";
import { IMAGES } from "@/shared/constants/images";
import {
  getWorkoutFromStorage,
  clearWorkoutFromStorage,
} from "@/shared/utils/workoutStorage";
import { Input } from "@/ui/components/ui/input";
import { Skeleton } from "@/ui/components/ui/skeleton";
import type { Workout, Exercise } from "@/shared/types";

const DEFAULT_REST_SECONDS = 90;

// ---------------------------------------------------------------------------
// Componentes presentacionais (stateless, dados via props, sem lógica de domínio)
// ---------------------------------------------------------------------------

interface WorkoutHeaderProps {
  /** Título contextual discreto (ex.: "Strength Training") */
  title: string;
  /** Tempo decorrido em segundos; se undefined, não exibe cronômetro */
  elapsedSeconds?: number;
  /** Ao clicar na seta de voltar (volta à tela anterior) */
  onBack?: () => void;
}

export function WorkoutHeader({
  title,
  elapsedSeconds,
  onBack,
}: WorkoutHeaderProps) {
  const mm = elapsedSeconds != null ? Math.floor(elapsedSeconds / 60) : 0;
  const ss = elapsedSeconds != null ? elapsedSeconds % 60 : 0;
  const timeStr = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

  return (
    <div className="sticky top-0 z-20 w-full shrink-0 px-4 pt-4 sm:px-6 sm:pt-4 lg:px-8 pb-2">
      <div className="max-w-4xl mx-auto">
        <header className="page-header px-4 py-4 sm:px-6 sm:py-5 lg:px-8 flex items-center gap-3 mb-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex min-w-[44px] min-h-[44px] size-11 shrink-0 items-center justify-center rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors touch-manipulation active:scale-95"
              aria-label="Voltar"
            >
              <ArrowLeft className="size-5 sm:size-6" />
            </button>
          )}
          <h1 className="text-xl sm:text-2xl lg:text-3xl mb-0 truncate text-white font-bold min-w-0 flex-1">
            {title}
          </h1>
          {elapsedSeconds != null && (
            <span className="text-lg sm:text-xl font-mono tabular-nums shrink-0 text-primary font-semibold">
              {timeStr}
            </span>
          )}
        </header>
      </div>
    </div>
  );
}

interface ExerciseHeroProps {
  imageUrl: string;
  alt?: string;
  loading?: boolean;
  onLoad?: () => void;
}

export function ExerciseHero({
  imageUrl,
  alt = "",
  loading,
  onLoad,
}: ExerciseHeroProps) {
  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-video min-h-[40vh] max-h-[55vh] sm:max-h-[65vh] lg:max-h-[70vh] shrink-0 overflow-hidden bg-black/40 max-w-4xl mx-auto">
      {loading && (
        <div className="absolute inset-0 flex flex-col gap-3 p-4">
          <Skeleton className="flex-1 rounded-xl" />
          <Skeleton className="h-12 w-2/3 rounded-lg" />
          <Skeleton className="h-8 w-1/2 rounded-lg" />
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
        onLoad={onLoad}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24 sm:h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(15, 20, 22, 0.4) 40%, rgba(15, 20, 22, 0.85) 100%)",
        }}
      />
    </div>
  );
}

interface ExerciseTitleProps {
  /** Ex.: "15" (reps) */
  reps: string;
  /** Ex.: "PUSH-UPS" */
  exerciseName: string;
}

export function ExerciseTitle({ reps, exerciseName }: ExerciseTitleProps) {
  const nameUpper = exerciseName.replace(/\s+/g, " ").toUpperCase();
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 text-center max-w-4xl mx-auto">
      <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight uppercase leading-tight break-words">
        {reps} <span className="text-primary">{nameUpper}</span>
      </p>
    </div>
  );
}

interface PrimaryActionButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

/** CTA fixo no rodapé — mesmo padrão da tela de visão geral (thumb-friendly) */
export function PrimaryActionButton({
  label,
  onClick,
  disabled = false,
}: PrimaryActionButtonProps) {
  return (
    <div
      className="fixed left-0 right-0 z-40 flex justify-center px-4"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="w-full max-w-4xl">
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className="w-full min-h-[56px] h-14 rounded-xl font-semibold text-base flex items-center justify-center transition-all touch-manipulation active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed bg-primary hover:bg-primary/90 text-[#171512] shadow-[0_2px_12px_rgba(213,159,57,0.3)]"
        >
          {label}
        </button>
      </div>
    </div>
  );
}

interface NextExerciseItemProps {
  name: string;
  reps: string;
}

export function NextExerciseItem({ name, reps }: NextExerciseItemProps) {
  return (
    <div className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-white/5 border border-white/10 text-left">
      <span className="text-white font-medium text-sm sm:text-base truncate">
        {name}
      </span>
      <span className="text-white/60 text-xs sm:text-sm shrink-0 ml-2">
        {reps} reps
      </span>
    </div>
  );
}

interface NextExercisesListProps {
  exercises: { name: string; reps: string }[];
}

export function NextExercisesList({ exercises }: NextExercisesListProps) {
  if (exercises.length === 0) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 space-y-2 max-w-4xl mx-auto w-full">
      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/60 mb-3">
        Próximos exercícios
      </h3>
      <div className="space-y-2 sm:space-y-3">
        {exercises.map((item, i) => (
          <NextExerciseItem key={i} name={item.name} reps={item.reps} />
        ))}
      </div>
    </div>
  );
}

/** Cronômetro de descanso: overlay com contagem regressiva; ao chegar em 0 dispara vibração/som */
interface RestTimerOverlayProps {
  secondsLeft: number;
  onDismiss?: () => void;
}

export function RestTimerOverlay({
  secondsLeft,
  onDismiss,
}: RestTimerOverlayProps) {
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const text = `${m}:${String(s).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      <p className="text-white/70 text-sm uppercase tracking-wider mb-2">
        Descanso
      </p>
      <p className="text-5xl sm:text-6xl font-mono font-bold text-primary tabular-nums">
        {text}
      </p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="mt-6 text-sm text-white/60 hover:text-white underline"
        >
          Pular descanso
        </button>
      )}
    </div>
  );
}

/** Uma linha da tabela de séries: peso, reps, última sessão (cinza), botão série feita */
interface SetRowProps {
  setIndex: number;
  weight: string;
  reps: string;
  lastWeight?: number;
  lastReps?: number;
  done: boolean;
  onWeightChange: (v: string) => void;
  onRepsChange: (v: string) => void;
  onMarkDone: () => void;
}

export function SetRow({
  setIndex,
  weight,
  reps,
  lastWeight,
  lastReps,
  done,
  onWeightChange,
  onRepsChange,
  onMarkDone,
}: SetRowProps) {
  const stepWeight = (delta: number) => {
    const n = parseFloat(weight) || 0;
    const next = Math.max(0, n + delta);
    onWeightChange(next % 1 === 0 ? String(next) : next.toFixed(1));
  };
  const stepReps = (delta: number) => {
    const n = parseInt(reps, 10) || 0;
    onRepsChange(String(Math.max(0, n + delta)));
  };

  return (
    <div className="grid grid-cols-[auto_1fr_1fr_auto] sm:grid-cols-[auto_1fr_1fr_auto] gap-2 sm:gap-4 items-center py-3 border-b border-white/10 last:border-0">
      <span className="text-white/60 text-sm font-medium w-8">#{setIndex + 1}</span>
      <div>
        <div className="flex gap-1 items-center">
          <Input
            type="text"
            inputMode="decimal"
            placeholder="kg"
            value={weight}
            onChange={(e) => {
              const v = e.target.value.replace(/,/g, ".").replace(/[^0-9.]/g, "");
              const parts = v.split(".");
              const filtered = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : v;
              onWeightChange(filtered);
            }}
            className="bg-white/10 border-white/20 text-white h-10 flex-1 min-w-0"
          />
          <div className="flex h-10 shrink-0 rounded-xl border border-white/20 bg-white/[0.06] overflow-hidden">
            <button
              type="button"
              onClick={() => stepWeight(-2.5)}
              className="flex-1 min-w-[36px] h-full flex items-center justify-center text-white/50 hover:text-primary hover:bg-primary/10 transition-colors touch-manipulation active:scale-95 border-r border-white/15"
              aria-label="Diminuir peso"
            >
              <Minus className="size-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => stepWeight(2.5)}
              className="flex-1 min-w-[36px] h-full flex items-center justify-center text-white/50 hover:text-primary hover:bg-primary/10 transition-colors touch-manipulation active:scale-95"
              aria-label="Aumentar peso"
            >
              <Plus className="size-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
        {lastWeight != null && (
          <p className="text-xs text-white/40 mt-0.5">Última: {lastWeight} kg</p>
        )}
      </div>
      <div>
        <div className="flex gap-1 items-center">
          <Input
            type="text"
            inputMode="numeric"
            placeholder="reps"
            value={reps}
            onChange={(e) => onRepsChange(e.target.value.replace(/[^0-9]/g, ""))}
            className="bg-white/10 border-white/20 text-white h-10 flex-1 min-w-0"
          />
          <div className="flex h-10 shrink-0 rounded-xl border border-white/20 bg-white/[0.06] overflow-hidden">
            <button
              type="button"
              onClick={() => stepReps(-1)}
              className="flex-1 min-w-[36px] h-full flex items-center justify-center text-white/50 hover:text-primary hover:bg-primary/10 transition-colors touch-manipulation active:scale-95 border-r border-white/15"
              aria-label="Diminuir reps"
            >
              <Minus className="size-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => stepReps(1)}
              className="flex-1 min-w-[36px] h-full flex items-center justify-center text-white/50 hover:text-primary hover:bg-primary/10 transition-colors touch-manipulation active:scale-95"
              aria-label="Aumentar reps"
            >
              <Plus className="size-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
        {lastReps != null && (
          <p className="text-xs text-white/40 mt-0.5">Última: {lastReps} reps</p>
        )}
      </div>
      <button
        type="button"
        onClick={onMarkDone}
        className={`shrink-0 min-w-[44px] min-h-[44px] size-11 rounded-full border-2 flex items-center justify-center transition-colors touch-manipulation active:scale-95 ${
          done ? "bg-primary border-primary text-[#171512]" : "border-white/30 text-white/50 hover:border-primary/50"
        }`}
        aria-label={done ? "Série feita" : "Marcar série e iniciar descanso"}
      >
        {done ? <span className="text-sm font-bold">✓</span> : <Clock className="size-5" />}
      </button>
    </div>
  );
}

/** Tabela de séries com peso e reps + última sessão */
interface SetsTableProps {
  setsCount: number;
  setsLog: { weight: string; reps: string }[];
  setDone: boolean[];
  lastSession?: { weight: number; reps: number }[];
  onSetsLogChange: (
    index: number,
    field: "weight" | "reps",
    value: string,
  ) => void;
  onSetDone: (index: number) => void;
}

export function SetsTable({
  setsCount,
  setsLog,
  setDone,
  lastSession,
  onSetsLogChange,
  onSetDone,
}: SetsTableProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-4xl mx-auto w-full">
      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/60 mb-3">
        Registro de cargas
      </h3>
      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden divide-y divide-white/10">
        {Array.from({ length: setsCount }, (_, i) => (
          <div key={i} className="px-3 sm:px-4">
            <SetRow
              setIndex={i}
              weight={setsLog[i]?.weight ?? ""}
              reps={setsLog[i]?.reps ?? ""}
              lastWeight={lastSession?.[i]?.weight}
              lastReps={lastSession?.[i]?.reps}
              done={setDone[i] ?? false}
              onWeightChange={(v) => onSetsLogChange(i, "weight", v)}
              onRepsChange={(v) => onSetsLogChange(i, "reps", v)}
              onMarkDone={() => onSetDone(i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Container: estado da execução + cronômetro + descanso (apenas front-end)
// ---------------------------------------------------------------------------

/** Mock da última sessão (peso/reps por série) — no futuro virá da API */
function mockLastSession(
  setsCount: number,
): { weight: number; reps: number }[] {
  return Array.from({ length: setsCount }, () => ({ weight: 60, reps: 10 }));
}

export default function ActiveWorkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, completeWorkout } = useSparta();

  const state = (location.state || {}) as {
    workout?: Workout;
    startAt?: number;
    startTimer?: boolean;
  };

  const workout: Workout =
    state.workout ??
    user?.currentWorkout ??
    getWorkoutFromStorage() ??
    DEMO_WORKOUT;
  const startAt = Math.max(
    0,
    Math.min(state.startAt ?? 0, workout.exercises.length - 1),
  );
  const startTimer = state.startTimer === true;

  const [currentIndex, setCurrentIndex] = useState(startAt);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(startTimer);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [setsLog, setSetsLog] = useState<{ weight: string; reps: string }[]>(
    [],
  );
  const [setDone, setSetDone] = useState<boolean[]>([]);
  const [restSeconds, setRestSeconds] = useState(0);

  const exercises = workout.exercises;
  const activeExercise: Exercise | undefined = exercises[currentIndex];

  // Reset sets log e done ao trocar de exercício
  useEffect(() => {
    if (!activeExercise) return;
    setSetsLog(
      Array.from({ length: activeExercise.sets }, () => ({
        weight: "",
        reps: "",
      })),
    );
    setSetDone(Array(activeExercise.sets).fill(false));
    setHeroLoaded(false);
  }, [activeExercise?.id]);

  // Cronômetro do treino (tempo decorrido)
  useEffect(() => {
    if (!isTimerRunning) return;
    const id = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isTimerRunning]);

  // Cronômetro de descanso: regressivo; ao chegar em 0, vibração e fim
  useEffect(() => {
    if (restSeconds <= 0) return;
    const id = setInterval(() => {
      setRestSeconds((s) => {
        if (s <= 1) {
          if (typeof navigator !== "undefined" && navigator.vibrate)
            navigator.vibrate(200);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [restSeconds > 0]);

  const nextExercises = exercises
    .slice(currentIndex + 1, currentIndex + 4)
    .map((ex) => ({
      name: ex.name,
      reps: ex.reps,
    }));

  const handleSetDone = useCallback((index: number) => {
    setSetDone((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
    setRestSeconds(DEFAULT_REST_SECONDS);
  }, []);

  const handleSetsLogChange = useCallback(
    (index: number, field: "weight" | "reps", value: string) => {
      setSetsLog((prev) => {
        const next = [...prev];
        if (!next[index]) next[index] = { weight: "", reps: "" };
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    },
    [],
  );

  const handleNextOrFinish = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      completeWorkout();
      clearWorkoutFromStorage();
      navigate("/dashboard/student", { replace: true });
    }
  };

  if (!activeExercise) {
    return (
      <div className="min-h-screen bg-page-dark flex items-center justify-center p-6">
        <p className="text-white/70">Nenhum exercício nesta posição.</p>
        <button
          type="button"
          onClick={() => navigate("/student/workout")}
          className="mt-4 text-primary"
        >
          Voltar ao treino
        </button>
      </div>
    );
  }

  const heroImage = activeExercise.image || IMAGES.WORKOUT_MAIN;
  const contextualTitle =
    workout.focalMuscles || workout.name || "Strength Training";
  const lastSessionMock = mockLastSession(activeExercise.sets);

  return (
    <div className="min-h-screen bg-page-dark flex flex-col">
      <WorkoutHeader
        title={contextualTitle}
        elapsedSeconds={isTimerRunning ? elapsedSeconds : undefined}
        onBack={() => navigate(-1)}
      />

      <main className="flex-1 overflow-y-auto pb-[88px] sm:pb-24">
        <ExerciseHero
          imageUrl={heroImage}
          alt={activeExercise.name}
          loading={!heroLoaded}
          onLoad={() => setHeroLoaded(true)}
        />
        <ExerciseTitle
          reps={activeExercise.reps}
          exerciseName={activeExercise.name}
        />
        <SetsTable
          setsCount={activeExercise.sets}
          setsLog={setsLog}
          setDone={setDone}
          lastSession={lastSessionMock}
          onSetsLogChange={handleSetsLogChange}
          onSetDone={handleSetDone}
        />
        <NextExercisesList exercises={nextExercises} />
        <PrimaryActionButton
          label={
            currentIndex < exercises.length - 1
              ? "Próximo exercício"
              : "Concluir treino"
          }
          onClick={handleNextOrFinish}
        />
      </main>

      {restSeconds > 0 && (
        <RestTimerOverlay
          secondsLeft={restSeconds}
          onDismiss={() => setRestSeconds(0)}
        />
      )}
    </div>
  );
}

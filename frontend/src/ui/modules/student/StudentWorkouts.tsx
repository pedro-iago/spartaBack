import { Button } from "@/ui/components/ui/button";
import { PageHeader } from "@/ui/components/ui/page-header";
import { FloatingNav, type FloatingNavItem } from "@/ui/components/ui/floating-nav";
import {
  Dumbbell,
  PlayCircle,
  ChefHat,
  Home,
  User,
  Calendar,
  Clock,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useStudentWorkoutPlan, getDayLabel } from "@/shared/hooks/useStudentWorkoutPlan";
import { TREINO_HOJE_ILLUSTRATION_URL } from "@/shared/constants/images";

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m} min` : `${h}h`;
}

export function StudentWorkouts() {
  const navigate = useNavigate();
  const { todayWorkout, weekWithSlots, isLoading } = useStudentWorkoutPlan();

  const floatingNavItems: FloatingNavItem[] = [
    { icon: <Home />, label: "Início", onClick: () => navigate("/dashboard/student") },
    { icon: <Dumbbell />, label: "Treinos", onClick: () => navigate("/student/workouts") },
    { icon: <ChefHat />, label: "Dieta", onClick: () => navigate("/diet") },
    { icon: <User />, label: "Perfil", onClick: () => navigate("/dashboard/perfil") },
  ];

  return (
    <div className="min-h-screen bg-page-dark pb-20 sm:pb-24 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Treinos"
          subtitle="Treinos passados pelo seu personal"
          titleSize="large"
        />

        <div className="py-4 sm:py-5 lg:py-6 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Treino de hoje */}
          <div className="glass-card-3d rounded-2xl overflow-hidden">
            {TREINO_HOJE_ILLUSTRATION_URL && (
              <div className="relative w-full aspect-[3/1] sm:aspect-[4/1] max-h-[120px] sm:max-h-[140px] bg-black/30">
                <img
                  src={TREINO_HOJE_ILLUSTRATION_URL}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div
                  className="absolute inset-x-0 bottom-0 h-12 sm:h-14 pointer-events-none"
                  style={{
                    background: "linear-gradient(to bottom, transparent 0%, rgba(15, 20, 22, 0.6) 40%, rgba(15, 20, 22, 0.98) 100%)",
                  }}
                />
              </div>
            )}
            <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-primary/80 uppercase tracking-wider mb-1">Treino de hoje</p>
                {isLoading ? (
                  <p className="text-white/60 text-sm">Carregando...</p>
                ) : todayWorkout ? (
                  <>
                    <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight break-words">
                      {todayWorkout.name}
                    </h2>
                    <p className="text-white/60 text-sm mt-0.5">
                      {formatDuration(todayWorkout.durationMinutes)} (estimado)
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg sm:text-xl font-semibold text-white/80 tracking-tight">Descanso</h2>
                    <p className="text-white/60 text-sm mt-0.5">Nenhum treino previsto para hoje</p>
                  </>
                )}
              </div>
              <Dumbbell className="h-8 w-8 sm:h-9 sm:w-9 text-primary/50 shrink-0" />
            </div>
            {todayWorkout && (
              <>
                <div className="flex flex-wrap gap-3 mb-4 text-xs text-white/50">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary/60" />
                    {formatDuration(todayWorkout.durationMinutes)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-primary/60" />
                    {getDayLabel(todayWorkout.dayOfWeek)}
                  </span>
                </div>
                <Button
                  variant="default"
                  size="lg"
                  className="w-full rounded-xl font-medium"
                  onClick={() => navigate("/student/workout", { state: { scheduledWorkout: todayWorkout } })}
                >
                  <PlayCircle className="mr-2 size-4" />
                  Ver treino / Iniciar
                </Button>
              </>
            )}
            </div>
          </div>

          {/* Solicitar ajuste ao personal */}
          <div className="glass-card-3d rounded-2xl p-4 flex items-center justify-between gap-3 border border-white/10">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <MessageCircle className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Precisa de um ajuste?</p>
                <p className="text-[11px] text-white/50">Solicite alterações no seu plano de treino</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 border-primary/30 text-primary/90 hover:bg-primary/10"
              onClick={() => alert("Solicitação enviada! Seu personal será notificado e entrará em contato em breve.")}
            >
              Solicitar ajuste
            </Button>
          </div>

          {/* Semana: Segunda a Domingo */}
          <div className="glass-card-3d rounded-2xl p-4 sm:p-5">
            <h3 className="text-sm font-medium text-white/90 tracking-tight mb-3">Treinos da semana</h3>
            <p className="text-[11px] text-white/50 mb-3">Segunda a domingo — o personal define quantos dias de treino</p>
            <div className="space-y-1.5">
              {weekWithSlots.map(({ dayOfWeek, label, workout }) => (
                <div
                  key={dayOfWeek}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/[0.04] gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`size-1.5 rounded-full shrink-0 ${workout ? "bg-primary/50" : "bg-white/20"}`}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-white/95">
                        {label}
                      </p>
                      <p className="text-[11px] text-white/45">
                        {workout
                          ? `${workout.name} · ${formatDuration(workout.durationMinutes)}`
                          : "Descanso"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {workout?.completed && (
                      <span className="text-[10px] font-medium text-primary/80">Concluído</span>
                    )}
                    {workout && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/70 hover:text-white h-8 text-xs"
                        onClick={() =>
                          navigate("/student/workout", { state: { scheduledWorkout: workout } })
                        }
                      >
                        Ver
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FloatingNav items={floatingNavItems} position="bottom-center" />
    </div>
  );
}

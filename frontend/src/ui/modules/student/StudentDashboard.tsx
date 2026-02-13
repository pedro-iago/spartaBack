import { useState } from "react";
import { Card } from "@/ui/components/ui/card";
import { Button } from "@/ui/components/ui/button";
import { Badge } from "@/ui/components/ui/badge";
import { PageHeader } from "@/ui/components/ui/page-header";
import { FloatingNav, type FloatingNavItem } from "@/ui/components/ui/floating-nav";
import { 
  Flame, 
  Dumbbell, 
  PlayCircle, 
  ChefHat,
  TrendingUp, 
  Trophy,
  Home,
  Calendar,
  User,
  LogOut,
  ArrowUpRight
} from "lucide-react";
import { useNavigate } from "react-router";
import { TREINO_HOJE_ILLUSTRATION_URL } from "@/shared/constants/images";

export function StudentDashboard() {
  const navigate = useNavigate();
  const [currentStreak] = useState(7);

  const handleLogout = () => {
    localStorage.removeItem("@sparta:user");
    navigate("/", { replace: true });
    window.location.reload();
  };

  const floatingNavItems: FloatingNavItem[] = [
    { icon: <Home />, label: "Início", onClick: () => navigate("/dashboard/student") },
    { icon: <Dumbbell />, label: "Treinos", onClick: () => navigate("/student/workouts") },
    { icon: <ChefHat />, label: "Dieta", onClick: () => navigate("/diet") },
    { icon: <User />, label: "Perfil", onClick: () => navigate("/dashboard/perfil") },
  ];

  // Mock data
  const todayWorkout = {
    name: "Hypertrophy Push A",
    type: "Upper Body",
    duration: "60 min",
    exercises: 8,
  };

  const macros = {
    protein: { current: 120, target: 180, unit: "g" },
    carbs: { current: 180, target: 250, unit: "g" },
    fats: { current: 45, target: 60, unit: "g" },
    calories: { current: 1650, target: 2400, unit: "kcal" },
  };

  const recentWorkouts = [
    { name: "Leg Day", date: "Ontem", completed: true },
    { name: "Pull Workout", date: "2 dias atrás", completed: true },
    { name: "Cardio HIIT", date: "3 dias atrás", completed: true },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-page-dark pb-20 sm:pb-24 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Olá, Atleta! 💪"
          subtitle="Vamos dominar o dia"
          titleSize="large"
          rightSlot={
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="size-10 sm:size-11 min-h-[44px] min-w-[44px] text-white/60 hover:text-white touch-manipulation rounded-lg"
              title="Sair"
            >
              <LogOut className="size-5 sm:size-6" />
            </Button>
          }
          children={
            <div className="flex items-center gap-3 bg-white/[0.06] border border-white/10 p-3 sm:p-4 rounded-2xl">
              <div className="bg-primary/20 p-2.5 sm:p-3 rounded-full shrink-0 ring-1 ring-primary/30">
                <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-white/60">Sequência Atual</p>
                <p className="text-xl sm:text-2xl font-bold text-primary tabular-nums">{currentStreak} dias</p>
              </div>
              <div className="shrink-0 text-primary/70">
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
            </div>
          }
        />

        {/* Main Content */}
        <div className="py-4 sm:py-5 lg:py-6 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Today's Workout Card */}
        <Card variant="glass" className="overflow-hidden border border-white/10 rounded-2xl transition-shadow">
          <div
            className="relative min-h-[200px] sm:min-h-[220px] lg:min-h-[240px] p-4 sm:p-6 lg:p-6 rounded-xl bg-cover bg-center"
            style={
              TREINO_HOJE_ILLUSTRATION_URL
                ? {
                    backgroundImage: `url('${TREINO_HOJE_ILLUSTRATION_URL}')`,
                    backgroundColor: "#3d3529",
                  }
                : { background: "linear-gradient(135deg, rgba(213,159,57,0.25) 0%, rgba(213,159,57,0.05) 100%)" }
            }
          >
            {/* Overlay escuro para legibilidade do texto */}
            {TREINO_HOJE_ILLUSTRATION_URL && (
              <>
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.75) 100%)" }}
                  aria-hidden
                />
                {/* Transição suave entre imagem e conteúdo (semi-transparência, sem corte brusco) */}
                <div
                  className="absolute inset-x-0 bottom-0 h-24 sm:h-28 rounded-lg pointer-events-none"
                  style={{
                    background: "linear-gradient(to bottom, transparent 0%, rgba(15, 20, 22, 0.4) 40%, rgba(15, 20, 22, 0.85) 100%)",
                  }}
                  aria-hidden
                />
              </>
            )}
            <div className="relative z-10 flex items-start justify-between mb-4 gap-3">
              <div className="min-w-0 flex-1">
                <Badge className="bg-primary text-primary-foreground mb-2 text-xs">
                  TREINO DE HOJE
                </Badge>
                <h2 className="text-lg sm:text-2xl mb-1 break-words text-white">{todayWorkout.name}</h2>
                <p className="text-white/70 text-sm sm:text-base">{todayWorkout.type}</p>
              </div>
              <Dumbbell className="h-10 w-10 sm:h-12 sm:w-12 text-primary/40 shrink-0" />
            </div>
            
            <div className="relative z-10 flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <TrendingUp className="h-4 w-4 text-primary shrink-0" />
                <span>{todayWorkout.exercises} exercícios</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Calendar className="h-4 w-4 text-primary shrink-0" />
                <span>{todayWorkout.duration}</span>
              </div>
            </div>

            <Button
              variant="default"
              size="lg"
              className="relative z-10 w-full min-h-[48px] sm:min-h-12 touch-manipulation"
              onClick={() => navigate("/student/workout")}
            >
              <PlayCircle className="mr-2 size-4 sm:size-5" />
              INICIAR TREINO
            </Button>
          </div>
        </Card>

        {/* Dieta de Hoje */}
        <div className="glass-card-3d rounded-2xl p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-sm font-medium text-white/90 tracking-tight">
              Dieta de Hoje
            </h3>
            <button
              type="button"
              onClick={() => navigate("/diet")}
              className="flex size-10 sm:size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white/80 transition-colors min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 touch-manipulation"
              aria-label="Ver dieta"
            >
              <ArrowUpRight className="size-3.5" />
            </button>
          </div>
          {/* Calorias */}
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-2xl sm:text-3xl font-semibold text-white tabular-nums tracking-tight">
              {macros.calories.current.toLocaleString("pt-BR")}
            </span>
            <span className="text-xs text-white/50">
              de {macros.calories.target.toLocaleString("pt-BR")} kcal
            </span>
          </div>
          <p className="text-[11px] text-white/45 mb-3">Meta diária</p>
          <div className="h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden mb-4">
            <div
              className="h-full rounded-full bg-primary/70 transition-all duration-500"
              style={{ width: `${Math.min(100, (macros.calories.current / macros.calories.target) * 100)}%` }}
            />
          </div>
          {/* Proteína, Carboidratos, Gorduras */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-white/[0.04] rounded-lg p-2.5 flex flex-col gap-1">
              <span className="text-[10px] font-medium text-white/50 tracking-wider">Proteína</span>
              <span className="text-sm font-semibold text-white/95 tabular-nums">
                {macros.protein.current}/{macros.protein.target}
                <span className="text-[10px] font-normal text-white/50 ml-0.5">{macros.protein.unit}</span>
              </span>
              <div className="h-1 rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{ width: `${Math.min(100, (macros.protein.current / macros.protein.target) * 100)}%` }}
                />
              </div>
            </div>
            <div className="bg-white/[0.04] rounded-lg p-2.5 flex flex-col gap-1">
              <span className="text-[10px] font-medium text-white/50 tracking-wider">Carboidratos</span>
              <span className="text-sm font-semibold text-white/95 tabular-nums">
                {macros.carbs.current}/{macros.carbs.target}
                <span className="text-[10px] font-normal text-white/50 ml-0.5">{macros.carbs.unit}</span>
              </span>
              <div className="h-1 rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{ width: `${Math.min(100, (macros.carbs.current / macros.carbs.target) * 100)}%` }}
                />
              </div>
            </div>
            <div className="bg-white/[0.04] rounded-lg p-2.5 flex flex-col gap-1">
              <span className="text-[10px] font-medium text-white/50 tracking-wider">Gorduras</span>
              <span className="text-sm font-semibold text-white/95 tabular-nums">
                {macros.fats.current}/{macros.fats.target}
                <span className="text-[10px] font-normal text-white/50 ml-0.5">{macros.fats.unit}</span>
              </span>
              <div className="h-1 rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{ width: `${Math.min(100, (macros.fats.current / macros.fats.target) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Treinos Recentes */}
        <div className="glass-card-3d rounded-2xl p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-sm font-medium text-white/90 tracking-tight">
              Treinos Recentes
            </h3>
            <button
              type="button"
              onClick={() => navigate("/student/workouts")}
              className="flex size-10 sm:size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white/80 transition-colors min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 touch-manipulation"
              aria-label="Ver treinos"
            >
              <ArrowUpRight className="size-3.5" />
            </button>
          </div>
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-2xl sm:text-3xl font-semibold text-white tabular-nums tracking-tight">
              {recentWorkouts.filter((w) => w.completed).length}
            </span>
            <span className="text-xs text-white/50">
              de {recentWorkouts.length} concluídos
            </span>
          </div>
          <p className="text-[11px] text-white/45 mb-3">Última semana</p>
          <div className="space-y-1.5">
            {recentWorkouts.map((workout, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.04] gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`size-1.5 rounded-full shrink-0 ${workout.completed ? "bg-primary/80" : "bg-white/25"}`}
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate text-white/95">{workout.name}</p>
                    <p className="text-[11px] text-white/45">{workout.date}</p>
                  </div>
                </div>
                {workout.completed && (
                  <span className="text-[10px] font-medium text-primary/80">
                    Concluído
                  </span>
                )}
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
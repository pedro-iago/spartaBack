import { useState } from "react";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { PageHeader } from "@/ui/components/ui/page-header";
import { FloatingNav, type FloatingNavItem } from "@/ui/components/ui/floating-nav";
import {
  Users,
  Search,
  CheckCircle,
  Clock,
  FileText,
  Eye,
  ThumbsUp,
  Sparkles,
  LogOut,
  List,
  LayoutGrid,
} from "lucide-react";
import { useNavigate } from "react-router";

interface WorkoutReview {
  id: string;
  studentName: string;
  studentAvatar: string;
  workoutName: string;
  generatedBy: "AI";
  status: "draft" | "pending" | "active";
  createdAt: string;
  description: string;
}

export function TrainerDashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "draft" | "pending" | "active">("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const handleLogout = () => {
    localStorage.removeItem("@sparta:user");
    navigate("/", { replace: true });
    window.location.reload();
  };

  const floatingNavItems: FloatingNavItem[] = [
    { icon: <FileText />, label: "Revisões", onClick: () => {} },
    { icon: <Users />, label: "Meus Alunos", onClick: () => navigate("/dashboard/professional/students") },
    { icon: <Sparkles />, label: "IA Assistente", onClick: () => navigate("/assistant") },
    { icon: <LogOut />, label: "Sair", onClick: handleLogout },
  ];

  const mockReviews: WorkoutReview[] = [
    {
      id: "1",
      studentName: "Carlos Silva",
      studentAvatar: "CS",
      workoutName: "Hipertrofia Push A",
      generatedBy: "AI",
      status: "draft",
      createdAt: "Há 2 horas",
      description: "Treino de peito, ombros e tríceps focado em hipertrofia",
    },
    {
      id: "2",
      studentName: "Ana Santos",
      studentAvatar: "AS",
      workoutName: "Leg Day - Força",
      generatedBy: "AI",
      status: "pending",
      createdAt: "Há 5 horas",
      description: "Treino de pernas com foco em força e potência",
    },
    {
      id: "3",
      studentName: "João Pedro",
      studentAvatar: "JP",
      workoutName: "Pull Workout",
      generatedBy: "AI",
      status: "draft",
      createdAt: "Há 1 dia",
      description: "Treino de costas e bíceps para hipertrofia",
    },
    {
      id: "4",
      studentName: "Marina Costa",
      studentAvatar: "MC",
      workoutName: "HIIT Cardio",
      generatedBy: "AI",
      status: "active",
      createdAt: "Há 2 dias",
      description: "Treino cardiovascular de alta intensidade",
    },
    {
      id: "5",
      studentName: "Rafael Oliveira",
      studentAvatar: "RO",
      workoutName: "Upper Body - Strength",
      generatedBy: "AI",
      status: "pending",
      createdAt: "Há 3 horas",
      description: "Treino de membros superiores focado em força",
    },
  ];

  const stats = {
    totalStudents: 24,
    pendingReviews: mockReviews.filter(r => r.status === "draft" || r.status === "pending").length,
    activeWorkouts: mockReviews.filter(r => r.status === "active").length,
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft": return <span className="text-[11px] font-medium text-white/45">Draft</span>;
      case "pending": return <span className="text-[11px] font-medium text-primary/80">Pendente</span>;
      case "active": return <span className="text-[11px] font-medium text-primary/80">Ativo</span>;
      default: return null;
    }
  };

  const filteredReviews = filter === "all" 
    ? mockReviews 
    : mockReviews.filter(r => r.status === filter);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-page-dark">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Dashboard do Personal"
          subtitle="Gerencie treinos e acompanhe seus alunos"
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
        />

        <div className="py-5 sm:py-6 lg:py-8 pb-24">
          {/* Cards de estatísticas — em mobile 3 colunas compactas, em desktop 3 colunas confortáveis */}
          <section className="grid grid-cols-3 gap-2 sm:gap-4 mb-5 sm:mb-8" aria-label="Resumo">
            <div className="glass-card-3d rounded-xl sm:rounded-2xl p-3 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-medium text-white/50 truncate">Alunos</p>
                  <p className="text-lg sm:text-2xl font-semibold text-white/95 tabular-nums">{stats.totalStudents}</p>
                </div>
                <div className="hidden sm:block bg-white/[0.08] p-2 rounded-full shrink-0">
                  <Users className="size-5 text-primary/70" />
                </div>
              </div>
            </div>
            <div className="glass-card-3d rounded-xl sm:rounded-2xl p-3 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-medium text-white/50 truncate">Pendentes</p>
                  <p className="text-lg sm:text-2xl font-semibold text-primary/90 tabular-nums">{stats.pendingReviews}</p>
                </div>
                <div className="hidden sm:block bg-white/[0.08] p-2 rounded-full shrink-0">
                  <Clock className="size-5 text-primary/70" />
                </div>
              </div>
            </div>
            <div className="glass-card-3d rounded-xl sm:rounded-2xl p-3 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-medium text-white/50 truncate">Ativos</p>
                  <p className="text-lg sm:text-2xl font-semibold text-white/95 tabular-nums">{stats.activeWorkouts}</p>
                </div>
                <div className="hidden sm:block bg-white/[0.08] p-2 rounded-full shrink-0">
                  <CheckCircle className="size-5 text-primary/70" />
                </div>
              </div>
            </div>
          </section>

          {/* Busca e filtros */}
          <section className="mb-4 sm:mb-6" aria-label="Filtrar revisões">
            <div className="glass-card-3d rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex-1 w-full min-w-0 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/45 pointer-events-none" />
                <Input
                  placeholder="Buscar aluno ou treino..."
                  className="w-full pl-9 sm:pl-10 min-h-[44px] sm:min-h-0 h-10 bg-white/[0.06] border-white/[0.08] text-white placeholder:text-white/40 rounded-xl text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {(["all", "draft", "pending", "active"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`px-2.5 sm:px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 rounded-lg text-[11px] sm:text-xs font-medium transition-colors shrink-0 touch-manipulation ${
                      filter === f
                        ? "bg-primary/80 text-primary-foreground"
                        : "bg-white/[0.06] text-white/60 hover:text-white/80 border border-white/[0.06]"
                    }`}
                  >
                    {f === "all" ? "Todos" : f === "draft" ? "Draft" : f === "pending" ? "Pendentes" : "Ativos"}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Lista de revisões */}
          <section aria-label="Revisões para aprovar">
            <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
              <h2 className="text-xs sm:text-sm font-medium text-white/70">
                Revisões <span className="text-white/50 font-normal">({filteredReviews.length})</span>
              </h2>
              <div className="glass-card-3d rounded-xl p-0.5 flex" role="group" aria-label="Visualização">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center transition-colors touch-manipulation ${
                    viewMode === "list"
                      ? "bg-primary/80 text-primary-foreground"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.06]"
                  }`}
                  title="Lista"
                  aria-pressed={viewMode === "list"}
                >
                  <List className="size-4 sm:size-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center transition-colors touch-manipulation ${
                    viewMode === "grid"
                      ? "bg-primary/80 text-primary-foreground"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.06]"
                  }`}
                  title="Quadros"
                  aria-pressed={viewMode === "grid"}
                >
                  <LayoutGrid className="size-4 sm:size-4.5" />
                </button>
              </div>
            </div>
            <div
              className={
                viewMode === "list"
                  ? "space-y-2 sm:space-y-3"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3"
              }
            >
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="glass-card-3d rounded-xl sm:rounded-2xl p-3 sm:p-5 flex flex-col h-full"
                >
                  <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-start sm:justify-between flex-shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-white/[0.08] rounded-full size-9 sm:size-10 flex items-center justify-center shrink-0">
                        <span className="text-xs sm:text-sm font-semibold text-primary/80">{review.studentAvatar}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-white/95 truncate text-sm sm:text-base">{review.studentName}</h3>
                        <p className="text-[10px] sm:text-[11px] text-white/45">{review.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                      {getStatusLabel(review.status)}
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/[0.06] flex-1 min-h-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <Sparkles className="size-3.5 text-primary/60 shrink-0" />
                      <h4 className="font-medium text-white/90 text-xs sm:text-sm truncate">{review.workoutName}</h4>
                      <span className="text-[10px] font-medium text-white/45">IA</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-white/55 line-clamp-2">{review.description}</p>
                  </div>
                  <div className="mt-3 flex flex-row gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-white/70 hover:text-white hover:bg-white/[0.06] min-h-[44px] sm:min-h-8 h-auto py-2 text-xs sm:text-sm touch-manipulation"
                      onClick={() => navigate("/trainer/edit-workout")}
                    >
                      <Eye className="mr-2 size-3.5 shrink-0" />
                      Revisar
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 rounded-xl font-medium min-h-[44px] sm:min-h-8 h-auto py-2 text-xs sm:text-sm touch-manipulation"
                      onClick={() => navigate("/trainer/edit-workout")}
                    >
                      <ThumbsUp className="mr-2 size-3.5 shrink-0" />
                      Aprovar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <FloatingNav items={floatingNavItems} position="bottom-center" />
    </div>
  );
}
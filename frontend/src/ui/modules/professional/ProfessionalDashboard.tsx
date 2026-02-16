import { useState, useEffect } from "react";
import { Button } from "@/ui/components/ui/button";
import { PageHeader } from "@/ui/components/ui/page-header";
import { FloatingNav, type FloatingNavItem } from "@/ui/components/ui/floating-nav";
import {
  Users,
  CheckCircle,
  Clock,
  FileText,
  Eye,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router";
import { trainingService } from "@/shared/services/trainingService";
import type { PendingReviewDTO } from "@/shared/types";

export function TrainerDashboard() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<PendingReviewDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await trainingService.getPendingReviewsWithAnamnesis();
        setReviews(list);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("@sparta:user");
    navigate("/", { replace: true });
    window.location.reload();
  };

  const isAdmin = (() => {
    try {
      const u = localStorage.getItem("@sparta:user");
      return u ? JSON.parse(u).role === "ADMIN" : false;
    } catch { return false; }
  })();

  const scrollTo = (id: string) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const floatingNavItems: FloatingNavItem[] = [
    { icon: <FileText />, label: "Anamneses", onClick: scrollTo("section-anamneses") },
    { icon: <Clock />, label: "Solicitações", onClick: () => navigate("/dashboard/professional/solicitacoes") },
    { icon: <Users />, label: "Meus Alunos", onClick: () => navigate("/dashboard/professional/students") },
    { icon: <Sparkles />, label: "Assistente", onClick: () => navigate("/assistant") },
  ];

  const stats = {
    totalStudents: reviews.length,
    pendingReviews: reviews.filter((r) => r.training.status === "PENDING_REVIEW" || r.training.status === "DRAFT").length,
    activeWorkouts: reviews.filter((r) => r.training.status === "ACTIVE").length,
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-page-dark">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Dashboard do Personal"
          subtitle="Gerencie treinos e acompanhe seus alunos"
          rightSlot={
            <div className="flex items-center gap-1">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/admin")}
                  className="text-[11px] text-white/40 hover:text-white/60 mr-2"
                  title="Voltar ao painel Admin"
                >
                  ← Admin
                </button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="size-10 sm:size-11 min-h-[44px] min-w-[44px] text-white/60 hover:text-white touch-manipulation rounded-lg"
                title="Sair"
              >
                <LogOut className="size-5 sm:size-6" />
              </Button>
            </div>
          }
        />

        <div className="py-5 sm:py-6 lg:py-8 pb-24">
          {/* Resumo (estatísticas) */}
          <section className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 sm:mb-10" aria-label="Resumo">
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

          {/* ——— 1. ANAMNESES (só anamnese, sem treino) ——— */}
          <section id="section-anamneses" className="mb-10 sm:mb-12" aria-label="Anamneses para avaliar">
            <h2 className="text-base sm:text-lg font-semibold text-white/95 flex items-center gap-2 mb-1">
              <FileText className="size-5 text-primary/70 shrink-0" />
              Anamneses para avaliar
            </h2>
            <p className="text-xs sm:text-sm text-white/50 mb-4">Dados de saúde e objetivo dos alunos.</p>
            {loading ? (
              <div className="text-center text-white/50 py-8">Carregando...</div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {reviews.filter((r) => r.anamnesis != null).length === 0 ? (
                  <div className="glass-card-3d rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
                    <FileText className="size-10 text-white/30 mx-auto mb-2" />
                    <p className="text-sm text-white/70">Nenhuma anamnese pendente</p>
                  </div>
                ) : (
                  reviews
                    .filter((r) => r.anamnesis != null)
                    .map((item) => {
                      const t = item.training;
                      const a = item.anamnesis!;
                      const initials = t.userName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "?";
                      return (
                        <div key={`anam-${t.id}`} className="glass-card-3d rounded-xl sm:rounded-2xl p-4 sm:p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-white/[0.08] rounded-full size-9 flex items-center justify-center shrink-0">
                              <span className="text-xs font-semibold text-primary/80">{initials}</span>
                            </div>
                            <div>
                              <h3 className="font-medium text-white/95 text-sm">{t.userName}</h3>
                              <p className="text-[11px] text-white/45">Anamnese</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-auto text-xs"
                              onClick={() => document.getElementById("section-solicitacoes")?.scrollIntoView({ behavior: "smooth" })}
                            >
                              Ver solicitação
                            </Button>
                          </div>
                          <ul className="text-[11px] sm:text-xs text-white/60 space-y-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                            {a.goal && <li><span className="text-white/45">Objetivo:</span> {a.goal}</li>}
                            {a.age != null && <li><span className="text-white/45">Idade:</span> {a.age} anos</li>}
                            {a.weight != null && <li><span className="text-white/45">Peso:</span> {a.weight} kg</li>}
                            {a.height != null && <li><span className="text-white/45">Altura:</span> {a.height} m</li>}
                            {a.activityLevel && <li><span className="text-white/45">Atividade:</span> {a.activityLevel}</li>}
                            {a.daysPerWeekAvailable != null && <li><span className="text-white/45">Dias/semana:</span> {a.daysPerWeekAvailable}</li>}
                            {a.injuries && <li className="sm:col-span-2"><span className="text-white/45">Lesões:</span> {a.injuries}</li>}
                            {a.medicalConditions && <li className="sm:col-span-2"><span className="text-white/45">Condições médicas:</span> {a.medicalConditions}</li>}
                          </ul>
                        </div>
                      );
                    })
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      <FloatingNav items={floatingNavItems} position="bottom-center" />
    </div>
  );
}
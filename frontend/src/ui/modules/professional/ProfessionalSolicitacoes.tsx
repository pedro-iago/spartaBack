import { useState, useEffect } from "react";
import { Button } from "@/ui/components/ui/button";
import { PageHeader } from "@/ui/components/ui/page-header";
import { FloatingNav, type FloatingNavItem } from "@/ui/components/ui/floating-nav";
import {
  ArrowLeft,
  Clock,
  Eye,
  ThumbsUp,
  Sparkles,
  LogOut,
  List,
  LayoutGrid,
  FileText,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";
import { trainingService } from "@/shared/services/trainingService";
import type { PendingReviewDTO } from "@/shared/types";

export function ProfessionalSolicitacoes() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "draft" | "pending" | "active">("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
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
    localStorage.removeItem("@sparta:token");
    navigate("/login", { replace: true });
    window.location.reload();
  };

  const isAdmin = (() => {
    try {
      const u = localStorage.getItem("@sparta:user");
      return u ? JSON.parse(u).role === "ADMIN" : false;
    } catch { return false; }
  })();

  const mapStatus = (s: string): "draft" | "pending" | "active" => {
    if (s === "ACTIVE") return "active";
    if (s === "PENDING_REVIEW" || s === "PENDING_APPROVAL") return "pending";
    return "draft";
  };

  const getStatusLabel = (status: string) => {
    const s = mapStatus(status);
    if (s === "draft") return <span className="text-[11px] font-medium text-white/45">Draft</span>;
    if (s === "pending") return <span className="text-[11px] font-medium text-primary/80">Pendente</span>;
    if (s === "active") return <span className="text-[11px] font-medium text-primary/80">Ativo</span>;
    return null;
  };

  const filteredReviews = filter === "all"
    ? reviews
    : reviews.filter((r) => mapStatus(r.training.status) === filter);

  const floatingNavItems: FloatingNavItem[] = [
    { icon: <FileText />, label: "Anamneses", onClick: () => navigate("/dashboard/professional") },
    { icon: <Clock />, label: "Solicitações", onClick: () => {} },
    { icon: <Users />, label: "Meus Alunos", onClick: () => navigate("/dashboard/professional/students") },
    { icon: <Sparkles />, label: "Assistente", onClick: () => navigate("/assistant") },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-page-dark">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Solicitações de treino"
          subtitle="Pedidos de treino para revisar e aprovar"
          leftSlot={
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard/professional")}
              className="size-10 sm:size-11 min-h-[44px] min-w-[44px] text-white/70 hover:text-white touch-manipulation rounded-lg shrink-0"
              aria-label="Voltar ao dashboard"
            >
              <ArrowLeft className="size-5 sm:size-6" />
            </Button>
          }
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

        <div className="py-4 sm:py-6 pb-24">
          <div className="mb-3 sm:mb-4 flex flex-wrap gap-2 items-center">
            {(["all", "draft", "pending", "active"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-2.5 sm:px-3 py-2 min-h-[44px] sm:min-h-[36px] rounded-lg text-[11px] sm:text-xs font-medium transition-colors touch-manipulation ${
                  filter === f ? "bg-primary/80 text-primary-foreground" : "bg-white/[0.06] text-white/60 hover:text-white/80"
                }`}
              >
                {f === "all" ? "Todos" : f === "draft" ? "Draft" : f === "pending" ? "Pendentes" : "Ativos"}
              </button>
            ))}
            <div className="ml-auto glass-card-3d rounded-xl p-0.5 flex">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-2 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 rounded-lg flex items-center justify-center transition-colors touch-manipulation ${
                  viewMode === "list" ? "bg-primary/80 text-primary-foreground" : "text-white/50 hover:text-white/80"
                }`}
                title="Lista"
              >
                <List className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-2 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 rounded-lg flex items-center justify-center transition-colors touch-manipulation ${
                  viewMode === "grid" ? "bg-primary/80 text-primary-foreground" : "text-white/50 hover:text-white/80"
                }`}
                title="Quadros"
              >
                <LayoutGrid className="size-4" />
              </button>
            </div>
          </div>

          <div className={viewMode === "list" ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"}>
            {loading ? (
              <div className="text-center text-white/50 py-8">Carregando...</div>
            ) : filteredReviews.length === 0 ? (
              <div className="glass-card-3d rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
                <Sparkles className="size-10 text-white/30 mx-auto mb-2" />
                <p className="text-sm text-white/70">Nenhuma solicitação de treino pendente</p>
                <p className="text-xs text-white/50 mt-1">Quando um aluno pedir um treino, aparecerá aqui.</p>
              </div>
            ) : (
              filteredReviews.map((item) => {
                const t = item.training;
                const initials = t.userName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "?";
                const created = t.createdAt ? new Date(t.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "";
                return (
                  <div key={t.id} className="glass-card-3d rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="bg-white/[0.08] rounded-full size-9 sm:size-10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-primary/80">{initials}</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-white/95 truncate text-sm">{t.userName}</h3>
                          <p className="text-[10px] text-white/45">{created}</p>
                        </div>
                      </div>
                      {getStatusLabel(t.status)}
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sparkles className="size-3.5 text-primary/60 shrink-0" />
                      <span className="font-medium text-white/90 text-xs">Treino {t.focus}</span>
                      <span className="text-[10px] text-white/45">IA</span>
                    </div>
                    <p className="text-[11px] text-white/55 line-clamp-2 mb-3">{t.limitations || "Sem observações"}</p>
                    <div className="mt-auto flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-xs min-h-[44px] sm:min-h-8"
                        onClick={() => navigate("/trainer/edit-workout", { state: { trainingId: t.id, training: t } })}
                      >
                        <Eye className="mr-1.5 size-3.5" />
                        Revisar
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 text-xs min-h-[44px] sm:min-h-8"
                        onClick={() => navigate("/trainer/edit-workout", { state: { trainingId: t.id, training: t } })}
                      >
                        <ThumbsUp className="mr-1.5 size-3.5" />
                        Aprovar
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <FloatingNav items={floatingNavItems} position="bottom-center" />
    </div>
  );
}

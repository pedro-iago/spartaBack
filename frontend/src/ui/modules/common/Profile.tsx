import React from "react";
import { useNavigate } from "react-router-dom";
import { useSparta } from "@/shared/context/SpartaContext";
import { PageHeader } from "@/ui/components/ui/page-header";
import { Button } from "@/ui/components/ui/button";
import { LogOut, Target, TrendingUp, Calendar } from "lucide-react";
import { Goal } from "@/shared/types";

const GOAL_LABELS: Record<Goal, string> = {
  [Goal.WEIGHT_LOSS]: "Perda de peso",
  [Goal.HYPERTROPHY]: "Hipertrofia",
  [Goal.CONDITIONING]: "Condicionamento",
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSparta();

  const handleLogout = () => {
    localStorage.removeItem("@sparta:user");
    navigate("/login", { replace: true });
    window.location.reload();
  };

  const displayName = user?.name?.trim() || "Atleta";
  const initials = displayName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <div className="min-h-screen min-h-[100dvh] bg-page-dark flex flex-col pb-24">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-1">
        <PageHeader
          title="Meu perfil"
          subtitle="Seus dados e preferências"
          titleSize="large"
        />

        <div className="py-4 sm:py-5 space-y-5 sm:space-y-6">
          {/* Avatar e nome */}
          <div className="rounded-2xl p-5 sm:p-6 bg-white/[0.04] border border-white/[0.06]">
            <div className="flex items-center gap-4 sm:gap-6">
              <div
                className="size-20 sm:size-24 rounded-full shrink-0 overflow-hidden bg-white/[0.08] border-2 border-white/10"
                style={
                  user?.avatarUrl
                    ? { backgroundImage: `url('${user.avatarUrl}')`, backgroundSize: "cover" }
                    : undefined
                }
              >
                {!user?.avatarUrl && (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary/80">{initials}</span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-semibold text-white truncate">
                  {displayName}
                </h2>
                <p className="text-sm text-white/50 mt-0.5">Membro ativo</p>
              </div>
            </div>
          </div>

          {/* Objetivo, nível, frequência */}
          <div className="rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.06]">
            <div className="p-4 sm:p-5 border-b border-white/[0.06] flex justify-between items-center gap-3">
              <span className="text-sm text-white/50 flex items-center gap-2">
                <Target className="size-4 text-primary/60" />
                Objetivo
              </span>
              <span className="text-sm font-semibold text-white/90">
                {user?.goal != null ? GOAL_LABELS[user.goal as Goal] : "—"}
              </span>
            </div>
            <div className="p-4 sm:p-5 border-b border-white/[0.06] flex justify-between items-center gap-3">
              <span className="text-sm text-white/50 flex items-center gap-2">
                <TrendingUp className="size-4 text-primary/60" />
                Nível
              </span>
              <span className="text-sm font-semibold text-white/90">{user?.level ?? "—"}</span>
            </div>
            <div className="p-4 sm:p-5 flex justify-between items-center gap-3">
              <span className="text-sm text-white/50 flex items-center gap-2">
                <Calendar className="size-4 text-primary/60" />
                Frequência
              </span>
              <span className="text-sm font-semibold text-white/90">
                {user?.frequency != null ? `${user.frequency}x / semana` : "—"}
              </span>
            </div>
          </div>

          {/* Sair */}
          <div className="rounded-2xl p-5 sm:p-6 bg-white/[0.04] border border-white/[0.06]">
            <Button
              variant="ghost"
              className="w-full justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 rounded-xl h-12 font-semibold"
              onClick={handleLogout}
            >
              <LogOut className="size-4 shrink-0" />
              Sair do sistema
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

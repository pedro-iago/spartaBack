import { useRef } from "react";
import { useNavigate } from "react-router";
import { useSparta } from "@/shared/context/SpartaContext";
import { Button } from "@/ui/components/ui/button";
import { PageHeader } from "@/ui/components/ui/page-header";
import { FloatingNav, type FloatingNavItem } from "@/ui/components/ui/floating-nav";
import {
  Home,
  Dumbbell,
  ChefHat,
  User,
  Target,
  Calendar,
  TrendingUp,
  LogOut,
  Activity,
  CreditCard,
  Camera,
  RefreshCw,
  CalendarCheck,
  BarChart3,
  ChevronRight,
  Flame,
} from "lucide-react";
import { Goal } from "@/shared/types";
import { IMAGES } from "@/shared/constants/images";

const MOCK_PROFILE = {
  plan: "Premium",
  planExpiration: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
  frequency: 4,
  goal: Goal.HYPERTROPHY,
  level: "Iniciante",
  bio: {
    peso: 78,
    altura: 175,
    gordura: 16,
    muscular: 35,
    agua: 58,
    visceral: 4,
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    nextDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

const GOAL_LABELS: Record<Goal, string> = {
  [Goal.WEIGHT_LOSS]: "Perda de peso",
  [Goal.HYPERTROPHY]: "Hipertrofia",
  [Goal.CONDITIONING]: "Condicionamento",
};

export function StudentProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useSparta();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const floatingNavItems: FloatingNavItem[] = [
    { icon: <Home />, label: "Início", onClick: () => navigate("/dashboard/student") },
    { icon: <Dumbbell />, label: "Treinos", onClick: () => navigate("/student/workouts") },
    { icon: <ChefHat />, label: "Dieta", onClick: () => navigate("/diet") },
    { icon: <User />, label: "Perfil", onClick: () => navigate("/dashboard/perfil") },
  ];

  const displayName = user?.name?.trim() || "Atleta";
  const initials = displayName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";
  const goalLabel = GOAL_LABELS[(user?.goal as Goal) || MOCK_PROFILE.goal];
  const levelLabel = user?.level ?? MOCK_PROFILE.level;
  const frequency = user?.frequency ?? MOCK_PROFILE.frequency;
  const plan = user?.plan ?? MOCK_PROFILE.plan;
  const planExpiration = (user?.planExpiration || MOCK_PROFILE.planExpiration)
    ? new Date(user?.planExpiration || MOCK_PROFILE.planExpiration).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
    : "—";
  const bio = user?.bio ?? MOCK_PROFILE.bio;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateUser({ avatarUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem("@sparta:user");
    navigate("/login", { replace: true });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-page-dark pb-28 sm:pb-24 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Meu perfil"
          subtitle="Seus dados e preferências"
          titleSize="large"
        />

        <div className="py-4 sm:py-5 lg:py-6 space-y-5 sm:space-y-6">
          {/* Foto e dados básicos */}
          <div className="glass-card-3d rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page-dark rounded-full"
              >
                <div className="size-24 sm:size-28 rounded-full overflow-hidden bg-white/[0.08] border-2 border-white/10 group-hover:border-primary/40 transition-colors">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-bold text-primary/80">{initials}</span>
                    </div>
                  )}
                </div>
                <span className="absolute bottom-0 right-0 size-9 rounded-full bg-primary flex items-center justify-center text-[#171512] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="size-4" />
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </button>
              <div className="flex-1 text-center sm:text-left min-w-0">
                <h2 className="text-xl sm:text-2xl font-semibold text-white/95 truncate">
                  {displayName}
                </h2>
                <p className="text-sm text-white/50 mt-0.5">Aluno</p>
                <p className="text-xs text-white/40 mt-2">Toque na foto para alterar</p>
              </div>
            </div>
          </div>

          {/* Plano atual e vencimento */}
          <div className="glass-card-3d rounded-2xl p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2 mb-4">
              <CreditCard className="size-4 text-primary/80" />
              Plano
            </h3>
            <div className="space-y-0">
              <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                <span className="text-sm text-white/50">Plano atual</span>
                <span className="text-sm font-medium text-white/90">{plan}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-white/50">Vencimento</span>
                <span className="text-sm font-medium text-white/90">{planExpiration}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-4 rounded-xl text-white/60 hover:text-white/90 text-xs"
              onClick={() => alert("Em breve! Entre em contato com seu personal para renovar o plano.")}
            >
              <RefreshCw className="size-4 mr-2 opacity-70" />
              Vamos renovar?
            </Button>
          </div>

          {/* Frequência e objetivo */}
          <div className="glass-card-3d rounded-2xl p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2 mb-4">
              <Target className="size-4 text-primary/80" />
              Treino
            </h3>
            <div className="space-y-0">
              <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                <span className="text-sm text-white/50 flex items-center gap-2">
                  <TrendingUp className="size-3.5 text-primary/60" />
                  Nível
                </span>
                <span className="text-sm font-medium text-white/90">{levelLabel}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                <span className="text-sm text-white/50 flex items-center gap-2">
                  <Calendar className="size-3.5 text-primary/60" />
                  Frequência
                </span>
                <span className="text-sm font-medium text-white/90">{frequency}x por semana</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-white/50 flex items-center gap-2">
                  <Target className="size-3.5 text-primary/60" />
                  Objetivo
                </span>
                <span className="text-sm font-medium text-white/90">{goalLabel}</span>
              </div>
            </div>
          </div>

          {/* Registro de treino (preview) */}
          <div className="glass-card-3d rounded-2xl p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2 mb-1">
              <BarChart3 className="size-4 text-primary/80" />
              Registro de treino
            </h3>
            <p className="text-xs text-white/50 mb-4">
              Veja padrões no seu histórico de treino
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl bg-white/[0.06] border border-white/10 p-4 flex flex-col items-center gap-1">
                <Flame className="size-5 text-primary/80" />
                <span className="text-xl font-bold text-white">4</span>
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Sequência semanal</span>
              </div>
              <div className="rounded-xl bg-white/[0.06] border border-white/10 p-4 flex flex-col items-center gap-1">
                <Dumbbell className="size-5 text-primary/80" />
                <span className="text-xl font-bold text-white">12</span>
                <span className="text-[10px] text-white/50 uppercase tracking-wider">treinos este mês</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/perfil/historico")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 transition-colors font-medium text-sm"
            >
              Ver histórico completo
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Bioimpedância */}
          <div className="glass-card-3d rounded-2xl p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2 mb-4">
              <Activity className="size-4 text-primary/80" />
              Bioimpedância
            </h3>
            {bio && (Object.keys(bio).filter((k) => !["date", "nextDate"].includes(k)).length > 0 || bio.date || bio.nextDate) ? (
              <>
                {(bio.date || bio.nextDate) && (
                  <div className="flex flex-wrap gap-4 sm:gap-6 mb-4 pb-4 border-b border-white/[0.06]">
                    {bio.date && (
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="size-4 text-primary/60" />
                        <div>
                          <p className="text-[10px] text-white/45 uppercase tracking-wider">Realizada em</p>
                          <p className="text-sm font-medium text-white/90">
                            {new Date(bio.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    )}
                    {bio.nextDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-primary/60" />
                        <div>
                          <p className="text-[10px] text-white/45 uppercase tracking-wider">Próxima em</p>
                          <p className="text-sm font-medium text-primary/90">
                            {new Date(bio.nextDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {bio.peso != null && (
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                    <p className="text-[10px] text-white/45 uppercase tracking-wider">Peso</p>
                    <p className="text-sm font-semibold text-white/90 mt-0.5">{bio.peso} kg</p>
                  </div>
                )}
                {bio.altura != null && (
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                    <p className="text-[10px] text-white/45 uppercase tracking-wider">Altura</p>
                    <p className="text-sm font-semibold text-white/90 mt-0.5">{bio.altura} cm</p>
                  </div>
                )}
                {bio.peso != null && bio.altura != null && (
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                    <p className="text-[10px] text-white/45 uppercase tracking-wider">IMC</p>
                    <p className="text-sm font-semibold text-white/90 mt-0.5">
                      {(bio.peso / Math.pow(bio.altura / 100, 2)).toFixed(1)} kg/m²
                    </p>
                  </div>
                )}
                {bio.gordura != null && (
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                    <p className="text-[10px] text-white/45 uppercase tracking-wider">% Gordura</p>
                    <p className="text-sm font-semibold text-white/90 mt-0.5">{bio.gordura}%</p>
                  </div>
                )}
                {bio.muscular != null && (
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                    <p className="text-[10px] text-white/45 uppercase tracking-wider">Massa muscular</p>
                    <p className="text-sm font-semibold text-white/90 mt-0.5">{bio.muscular} kg</p>
                  </div>
                )}
                {bio.agua != null && (
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                    <p className="text-[10px] text-white/45 uppercase tracking-wider">% Água</p>
                    <p className="text-sm font-semibold text-white/90 mt-0.5">{bio.agua}%</p>
                  </div>
                )}
                {bio.visceral != null && (
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                    <p className="text-[10px] text-white/45 uppercase tracking-wider">Gordura visceral</p>
                    <p className="text-sm font-semibold text-white/90 mt-0.5">{bio.visceral}</p>
                  </div>
                )}
              </div>

                {/* Composição corporal */}
                {bio?.gordura != null && (
                  <div className="mt-6 pt-6 border-t border-white/[0.06]">
                    <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-2 text-center">
                      Composição corporal
                    </h4>
                    <p className="text-[11px] text-white/50 mb-4 text-center">
                      Sua classificação (% de massa gorda)
                    </p>
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex justify-center w-full min-h-[180px] sm:min-h-[200px]">
                        <img
                          src={IMAGES.COMPOSICAO_CORPORAL}
                          alt="Composição corporal"
                          className="h-44 sm:h-52 w-auto object-contain opacity-90"
                        />
                      </div>
                      <div className="text-center mt-4">
                        <p className="text-sm font-semibold text-primary">
                          {bio.gordura < 14 ? "Excelente" : bio.gordura < 18 ? "Bom" : bio.gordura < 25 ? "Melhor que a média" : bio.gordura < 30 ? "Média" : "Acima da média"}
                        </p>
                        <p className="text-xs text-white/50 mt-1">{bio.gordura}% gordura corporal</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-white/45 py-2">
                Nenhum dado de bioimpedância registrado. O personal pode adicionar na sua ficha.
              </p>
            )}
          </div>

          {/* Conta */}
          <div className="glass-card-3d rounded-2xl p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-white/90 mb-3">Conta</h3>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-white/70 hover:text-white hover:bg-white/[0.06] rounded-xl h-11"
              onClick={handleLogout}
            >
              <LogOut className="size-4 shrink-0" />
              Sair da conta
            </Button>
          </div>
        </div>
      </div>

      <FloatingNav items={floatingNavItems} position="bottom-center" />
    </div>
  );
}

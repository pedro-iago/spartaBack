import { Button } from "@/ui/components/ui/button";
import { PageHeader } from "@/ui/components/ui/page-header";
import { FloatingNav, type FloatingNavItem } from "@/ui/components/ui/floating-nav";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  BarChart3,
  FileText,
  Download,
  TrendingUp,
  Dumbbell,
  Users,
  DollarSign,
  LayoutDashboard,
  Settings,
  LogOut,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router";

// Mock data para relatórios
const workoutsByMonth = [
  { month: "Jan", treinos: 420, alunos: 38 },
  { month: "Fev", treinos: 580, alunos: 45 },
  { month: "Mar", treinos: 720, alunos: 52 },
  { month: "Abr", treinos: 890, alunos: 61 },
  { month: "Mai", treinos: 1050, alunos: 74 },
  { month: "Jun", treinos: 1240, alunos: 86 },
];

const engagementByWeek = [
  { week: "Sem 1", sessões: 312, conclusão: 94 },
  { week: "Sem 2", sessões: 298, conclusão: 91 },
  { week: "Sem 3", sessões: 335, conclusão: 96 },
  { week: "Sem 4", sessões: 358, conclusão: 97 },
];

export function AdminReports() {
  const navigate = useNavigate();

  const floatingNavItems: FloatingNavItem[] = [
    { icon: <LayoutDashboard />, label: "Dashboard", onClick: () => navigate("/dashboard/admin") },
    { icon: <Users />, label: "Usuários", onClick: () => navigate("/admin/users") },
    { icon: <BarChart3 />, label: "Relatórios", onClick: () => navigate("/admin/reports") },
    { icon: <Settings />, label: "Configurações", onClick: () => navigate("/admin/settings") },
  ];

  const reportStats = {
    treinosMes: 1240,
    treinosCrescimento: 18,
    receitaMes: 31000,
    receitaCrescimento: 24.5,
    conclusaoMedia: 95,
    novosAlunos: 23,
  };

  const BarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-white/[0.1] bg-[#1c1c1c]/95 backdrop-blur-sm p-2.5 shadow-lg">
          <p className="text-xs font-medium text-white/90 mb-1">{payload[0].payload.month}</p>
          <p className="text-xs text-primary/90">Treinos: {payload[0].value}</p>
          <p className="text-[11px] text-white/50">Alunos ativos: {payload[0].payload.alunos}</p>
        </div>
      );
    }
    return null;
  };

  const LineTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="rounded-xl border border-white/[0.1] bg-[#1c1c1c]/95 backdrop-blur-sm p-2.5 shadow-lg">
          <p className="text-xs font-medium text-white/90 mb-1">{p.week}</p>
          <p className="text-xs text-primary/90">Sessões: {p.sessões}</p>
          <p className="text-[11px] text-white/50">Conclusão: {p.conclusão}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-page-dark">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Relatórios"
          subtitle="Relatórios e análises da plataforma"
          rightSlot={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-white/60 hover:text-white flex items-center gap-2"
              title="Sair"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline text-sm">Sair</span>
            </Button>
          }
        />
        <div className="py-5 sm:py-6 lg:py-8 pb-24 space-y-6 lg:space-y-8">
          {/* Cards de resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="glass-card-3d rounded-2xl p-4 sm:p-5 border border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-white/50">Treinos no mês</p>
                <div className="bg-white/[0.08] p-2 rounded-full">
                  <Dumbbell className="size-4 text-primary/70" />
                </div>
              </div>
              <p className="text-xl font-semibold text-white/95 tabular-nums">{reportStats.treinosMes.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs mt-0.5">
                <TrendingUp className="size-3.5 text-primary/70" />
                <span className="text-primary/80">+{reportStats.treinosCrescimento}%</span>
                <span className="text-white/45">vs mês anterior</span>
              </div>
            </div>
            <div className="glass-card-3d rounded-2xl p-4 sm:p-5 border border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-white/50">Receita (mês)</p>
                <div className="bg-white/[0.08] p-2 rounded-full">
                  <DollarSign className="size-4 text-primary/70" />
                </div>
              </div>
              <p className="text-xl font-semibold text-white/95 tabular-nums">R$ {reportStats.receitaMes.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs mt-0.5">
                <TrendingUp className="size-3.5 text-primary/70" />
                <span className="text-primary/80">+{reportStats.receitaCrescimento}%</span>
                <span className="text-white/45">vs mês anterior</span>
              </div>
            </div>
            <div className="glass-card-3d rounded-2xl p-4 sm:p-5 border border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-white/50">Taxa de conclusão</p>
                <div className="bg-white/[0.08] p-2 rounded-full">
                  <FileText className="size-4 text-primary/70" />
                </div>
              </div>
              <p className="text-xl font-semibold text-white/95 tabular-nums">{reportStats.conclusaoMedia}%</p>
              <p className="text-[11px] text-white/45 mt-0.5">Treinos finalizados</p>
            </div>
            <div className="glass-card-3d rounded-2xl p-4 sm:p-5 border border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-white/50">Novos alunos</p>
                <div className="bg-white/[0.08] p-2 rounded-full">
                  <Users className="size-4 text-primary/70" />
                </div>
              </div>
              <p className="text-xl font-semibold text-white/95 tabular-nums">{reportStats.novosAlunos}</p>
              <p className="text-[11px] text-white/45 mt-0.5">Últimos 30 dias</p>
            </div>
          </div>

          {/* Gráfico: Treinos por mês */}
          <div className="glass-card-3d rounded-2xl p-4 sm:p-5 border border-white/10">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-medium text-white/90 tracking-tight">Treinos realizados por mês</h3>
                <p className="text-[11px] text-white/45 mt-0.5">Evolução de treinos e alunos ativos</p>
              </div>
              <div className="flex items-center gap-1.5 text-white/50 text-xs">
                <Calendar className="size-3.5" />
                Últimos 6 meses
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={workoutsByMonth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#A1A1AA" style={{ fontSize: "12px" }} />
                <YAxis stroke="#A1A1AA" style={{ fontSize: "12px" }} />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="treinos" fill="#D59F39" radius={[4, 4, 0, 0]} name="Treinos" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico: Engajamento semanal */}
          <div className="glass-card-3d rounded-2xl p-4 sm:p-5 border border-white/10">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-white/90 tracking-tight">Engajamento semanal</h3>
              <p className="text-[11px] text-white/45 mt-0.5">Sessões de treino e taxa de conclusão no mês atual</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={engagementByWeek} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="week" stroke="#A1A1AA" style={{ fontSize: "12px" }} />
                <YAxis stroke="#A1A1AA" style={{ fontSize: "12px" }} />
                <Tooltip content={<LineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="sessões"
                  stroke="#D59F39"
                  strokeWidth={2}
                  dot={{ fill: "#D59F39", strokeWidth: 0 }}
                  name="Sessões"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Exportar relatório */}
          <div className="glass-card-3d rounded-2xl p-4 sm:p-5 border border-white/10">
            <h3 className="text-sm font-medium text-white/90 tracking-tight mb-1">Exportar relatório</h3>
            <p className="text-[11px] text-white/45 mb-4">
              Baixe relatórios em PDF ou planilha para análise externa.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                className="text-white/80 border-white/20 hover:bg-white/10 hover:text-white"
              >
                <Download className="size-4 mr-2" />
                Exportar PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-white/80 border-white/20 hover:bg-white/10 hover:text-white"
              >
                <FileText className="size-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FloatingNav items={floatingNavItems} position="bottom-center" />
    </div>
  );
}

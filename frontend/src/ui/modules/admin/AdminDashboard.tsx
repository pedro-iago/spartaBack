import { useState, useEffect } from "react";
import { Button } from "@/ui/components/ui/button";
import { PageHeader } from "@/ui/components/ui/page-header";
import { FloatingNav, type FloatingNavItem } from "@/ui/components/ui/floating-nav";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  Users,
  TrendingUp,
  Activity,
  UserCheck,
  Ban,
  LogOut,
  LayoutDashboard,
  Settings,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router";
import { adminService, type AdminDashboardDTO, type AdminUserDTO } from "@/shared/services/adminService";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<AdminDashboardDTO | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminUserDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [dash, users] = await Promise.all([
          adminService.getDashboard(),
          adminService.listUsers(),
        ]);
        if (!cancelled) {
          setDashboard(dash);
          setRecentUsers(users.slice(0, 10));
        }
      } catch {
        if (!cancelled) setRecentUsers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const floatingNavItems: FloatingNavItem[] = [
    { icon: <LayoutDashboard />, label: "Dashboard", onClick: () => navigate("/dashboard/admin") },
    { icon: <Users />, label: "Usuários", onClick: () => navigate("/admin/users") },
    { icon: <BarChart3 />, label: "Relatórios", onClick: () => navigate("/admin/reports") },
    { icon: <Settings />, label: "Configurações", onClick: () => navigate("/admin/settings") },
  ];

  const revenueData = dashboard
    ? [
        { month: "Usuários", revenue: dashboard.totalUsers, users: dashboard.totalUsers },
        { month: "Treinos", revenue: dashboard.totalTrainings, users: dashboard.activeTrainings },
      ]
    : [];

  const stats = dashboard
    ? {
        mrr: 0,
        activeStudents: dashboard.totalStudents,
        activeTrainers: dashboard.totalPersonals,
        growth: 0,
      }
    : { mrr: 0, activeStudents: 0, activeTrainers: 0, growth: 0 };

  const roleLabel = (role: string) => {
    if (role === "ADMIN") return "Admin";
    if (role === "PERSONAL") return "Personal";
    return "Aluno";
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-white/[0.1] bg-[#1c1c1c]/95 backdrop-blur-sm p-2.5 shadow-lg">
          <p className="text-xs font-medium text-white/90 mb-0.5">{payload[0].payload.month}</p>
          <p className="text-xs text-primary/90">Receita: R$ {payload[0].value.toLocaleString()}</p>
          <p className="text-[11px] text-white/50">Usuários: {payload[0].payload.users}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-page-dark">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Dashboard Administrativo"
          subtitle="Visão geral da plataforma e métricas"
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
          {/* Porta de entrada: Admin pode acessar área Aluno e área Personal */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white/90 hover:bg-white/10"
              onClick={() => navigate("/dashboard/student")}
            >
              Ir para página Aluno
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white/90 hover:bg-white/10"
              onClick={() => navigate("/dashboard/professional")}
            >
              Ir para página Personal
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="glass-card-3d rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-white/50">Usuários</p>
                <div className="bg-white/[0.08] p-2 rounded-full">
                  <DollarSign className="size-4 text-primary/70" />
                </div>
              </div>
              <p className="text-xl font-semibold text-white/95 tabular-nums">{stats.activeStudents + stats.activeTrainers}</p>
              <div className="flex items-center gap-1 text-xs mt-0.5">
                <span className="text-white/45">Total na plataforma</span>
              </div>
            </div>
            <div className="glass-card-3d rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-white/50">Alunos ativos</p>
                <div className="bg-white/[0.08] p-2 rounded-full">
                  <Users className="size-4 text-primary/70" />
                </div>
              </div>
              <p className="text-xl font-semibold text-white/95 tabular-nums">{stats.activeStudents}</p>
              <p className="text-[11px] text-white/45 mt-0.5">Total de estudantes</p>
            </div>
            <div className="glass-card-3d rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-white/50">Personais ativos</p>
                <div className="bg-white/[0.08] p-2 rounded-full">
                  <UserCheck className="size-4 text-primary/70" />
                </div>
              </div>
              <p className="text-xl font-semibold text-white/95 tabular-nums">{stats.activeTrainers}</p>
              <p className="text-[11px] text-white/45 mt-0.5">Total de treinadores</p>
            </div>
            <div className="glass-card-3d rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-white/50">Crescimento</p>
                <div className="bg-white/[0.08] p-2 rounded-full">
                  <Activity className="size-4 text-primary/70" />
                </div>
              </div>
              <p className="text-xl font-semibold text-white/95 tabular-nums">{stats.growth}%</p>
              <p className="text-[11px] text-white/45 mt-0.5">Últimos 30 dias</p>
            </div>
          </div>

          <div className="glass-card-3d rounded-2xl p-4 sm:p-5">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-white/90 tracking-tight">Resumo</h3>
              <p className="text-[11px] text-white/45 mt-0.5">
                Usuários e treinos (dados do backend)
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData.length ? revenueData : [{ month: "-", revenue: 0, users: 0 }]}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="month" 
                  stroke="#A1A1AA"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#A1A1AA"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FACC15"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card-3d rounded-2xl p-4 sm:p-5">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-white/90 tracking-tight">Usuários recentes</h3>
              <p className="text-[11px] text-white/45 mt-0.5">
                Últimos usuários cadastrados na plataforma
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.08] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/[0.04] hover:bg-white/[0.04] border-white/[0.06]">
                    <TableHead className="text-xs font-medium text-white/50">Nome</TableHead>
                    <TableHead className="text-xs font-medium text-white/50">Email</TableHead>
                    <TableHead className="text-xs font-medium text-white/50">Tipo</TableHead>
                    <TableHead className="text-xs font-medium text-white/50">Status</TableHead>
                    <TableHead className="text-xs font-medium text-white/50">Data</TableHead>
                    <TableHead className="text-right text-xs font-medium text-white/50">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow className="border-white/[0.06]">
                      <TableCell colSpan={6} className="text-center text-white/50 py-8">Carregando...</TableCell>
                    </TableRow>
                  ) : (
                  recentUsers.map((user) => (
                    <TableRow key={user.id} className="border-white/[0.06]">
                      <TableCell className="font-medium text-white/90 text-sm">{user.name}</TableCell>
                      <TableCell className="text-white/60 text-sm">{user.email}</TableCell>
                      <TableCell>
                        <span className={`text-[11px] font-medium ${user.role === "PERSONAL" ? "text-primary/80" : user.role === "ADMIN" ? "text-primary" : "text-white/50"}`}>
                          {roleLabel(user.role)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`text-[11px] font-medium ${user.active ? "text-primary/80" : "text-white/45"}`}>
                          {user.active ? "Ativo" : "Inativo"}
                        </span>
                      </TableCell>
                      <TableCell className="text-white/50 text-sm">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white/50 hover:text-white/80">
                            <UserCheck className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white/50 hover:text-destructive/80">
                            <Ban className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <FloatingNav items={floatingNavItems} position="bottom-center" />
    </div>
  );
}
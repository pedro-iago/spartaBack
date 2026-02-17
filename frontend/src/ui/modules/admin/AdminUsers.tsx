import { useState, useEffect, useMemo } from "react";
import { Button } from "@/ui/components/ui/button";
import { PageHeader } from "@/ui/components/ui/page-header";
import { FloatingNav, type FloatingNavItem } from "@/ui/components/ui/floating-nav";
import { Input } from "@/ui/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/ui/table";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  LayoutDashboard,
  Settings,
  BarChart3,
  LogOut,
  Search,
  MoreHorizontal,
  Ban,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router";
import { adminService, type AdminUserDTO } from "@/shared/services/adminService";

export function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const list = await adminService.listUsers();
        setUsers(list);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.trim().toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, search]);

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.active).length,
      inactive: users.filter((u) => !u.active).length,
      newThisMonth: 0,
    }),
    [users],
  );

  const roleLabel = (role: string) =>
    role === "ADMIN" ? "Admin" : role === "PERSONAL" ? "Personal" : "Aluno";

  const handleToggleStatus = async (user: AdminUserDTO) => {
    try {
      await adminService.toggleUserStatus(user.id);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, active: !u.active } : u)));
    } catch {
      console.error("Erro ao alterar status");
    }
  };

  const floatingNavItems: FloatingNavItem[] = [
    { icon: <LayoutDashboard />, label: "Dashboard", onClick: () => navigate("/dashboard/admin") },
    { icon: <Users />, label: "Usuários", onClick: () => navigate("/admin/users") },
    { icon: <BarChart3 />, label: "Relatórios", onClick: () => navigate("/admin/reports") },
    { icon: <Settings />, label: "Configurações", onClick: () => navigate("/admin/settings") },
  ];

  return (
    <div className="min-h-screen bg-page-dark">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Usuários"
          subtitle="Gerencie alunos, profissionais e administradores"
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
                <p className="text-xs font-medium text-white/50">Total de usuários</p>
                <div className="bg-white/[0.08] p-2 rounded-full">
                  <Users className="size-4 text-primary/70" />
                </div>
              </div>
              <p className="text-xl font-semibold text-white/95 tabular-nums">{stats.total}</p>
              <p className="text-[11px] text-white/45 mt-0.5">Cadastrados na plataforma</p>
            </div>
            <div className="glass-card-3d rounded-2xl p-4 sm:p-5 border border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-white/50">Ativos</p>
                <div className="bg-white/[0.08] p-2 rounded-full">
                  <UserCheck className="size-4 text-primary/70" />
                </div>
              </div>
              <p className="text-xl font-semibold text-white/95 tabular-nums">{stats.active}</p>
              <p className="text-[11px] text-white/45 mt-0.5">Com acesso liberado</p>
            </div>
            <div className="glass-card-3d rounded-2xl p-4 sm:p-5 border border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-white/50">Inativos</p>
                <div className="bg-white/[0.08] p-2 rounded-full">
                  <UserX className="size-4 text-primary/70" />
                </div>
              </div>
              <p className="text-xl font-semibold text-white/95 tabular-nums">{stats.inactive}</p>
              <p className="text-[11px] text-white/45 mt-0.5">Contas desativadas</p>
            </div>
            <div className="glass-card-3d rounded-2xl p-4 sm:p-5 border border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-white/50">Novos este mês</p>
                <div className="bg-white/[0.08] p-2 rounded-full">
                  <UserPlus className="size-4 text-primary/70" />
                </div>
              </div>
              <p className="text-xl font-semibold text-white/95 tabular-nums">{stats.newThisMonth}</p>
              <p className="text-[11px] text-white/45 mt-0.5">Últimos 30 dias</p>
            </div>
          </div>

          {/* Busca e tabela */}
          <div className="glass-card-3d rounded-2xl p-4 sm:p-5 border border-white/10">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-sm font-medium text-white/90 tracking-tight">Lista de usuários</h3>
                <p className="text-[11px] text-white/45 mt-0.5">
                  Busque por nome ou e-mail (apenas frontend)
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                <Input
                  type="search"
                  placeholder="Buscar usuários..."
                  className="pl-9 bg-white/[0.06] border-white/10 text-white placeholder:text-white/40 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.08] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/[0.04] hover:bg-white/[0.04] border-white/[0.06]">
                    <TableHead className="text-xs font-medium text-white/50">Nome</TableHead>
                    <TableHead className="text-xs font-medium text-white/50">E-mail</TableHead>
                    <TableHead className="text-xs font-medium text-white/50">Tipo</TableHead>
                    <TableHead className="text-xs font-medium text-white/50">Status</TableHead>
                    <TableHead className="text-xs font-medium text-white/50">Cadastro</TableHead>
                    <TableHead className="text-right text-xs font-medium text-white/50">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow className="border-white/[0.06]">
                      <TableCell colSpan={6} className="text-center text-white/50 py-8">Carregando...</TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-white/[0.06]">
                        <TableCell className="font-medium text-white/90 text-sm">{user.name}</TableCell>
                        <TableCell className="text-white/60 text-sm flex items-center gap-1.5">
                          <Mail className="size-3.5 text-white/40 shrink-0" />
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                              user.role === "ADMIN"
                                ? "bg-primary/20 text-primary"
                                : user.role === "PERSONAL"
                                  ? "bg-white/10 text-white/80"
                                  : "text-white/50"
                            }`}
                          >
                            {roleLabel(user.role)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-[11px] font-medium ${
                              user.active ? "text-primary/80" : "text-white/45"
                            }`}
                          >
                            {user.active ? "Ativo" : "Inativo"}
                          </span>
                        </TableCell>
                        <TableCell className="text-white/50 text-sm">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-white/50 hover:text-white/80"
                              title="Ver detalhes"
                            >
                              <MoreHorizontal className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-white/50 hover:text-destructive/80"
                              title={user.active ? "Desativar" : "Ativar"}
                              onClick={() => handleToggleStatus(user)}
                            >
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

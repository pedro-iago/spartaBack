import { Button } from "@/ui/components/ui/button";
import { PageHeader } from "@/ui/components/ui/page-header";
import { FloatingNav, type FloatingNavItem } from "@/ui/components/ui/floating-nav";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";
import { Switch } from "@/ui/components/ui/switch";
import {
  LayoutDashboard,
  Settings,
  BarChart3,
  Users,
  LogOut,
  Building2,
  Globe,
  Bell,
  Mail,
  Shield,
  Palette,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router";

export function AdminSettings() {
  const navigate = useNavigate();

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
          title="Configurações"
          subtitle="Preferências da academia e da plataforma"
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
          {/* Geral */}
          <div className="glass-card-3d rounded-2xl p-4 sm:p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/[0.08] p-2 rounded-full">
                <Building2 className="size-4 text-primary/70" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/90 tracking-tight">Geral</h3>
                <p className="text-[11px] text-white/45">Dados da academia e região</p>
              </div>
            </div>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label className="text-white/70 text-sm">Nome da academia</Label>
                <Input
                  placeholder="Ex: Sparta Fitness"
                  defaultValue="Sparta Fitness"
                  className="bg-white/[0.06] border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70 text-sm flex items-center gap-1.5">
                  <Globe className="size-3.5" />
                  Fuso horário
                </Label>
                <Input
                  placeholder="America/Sao_Paulo"
                  defaultValue="America/Sao_Paulo"
                  className="bg-white/[0.06] border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <Button size="sm" className="text-white/90">
                <Save className="size-4 mr-2" />
                Salvar geral
              </Button>
            </div>
          </div>

          {/* Notificações */}
          <div className="glass-card-3d rounded-2xl p-4 sm:p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/[0.08] p-2 rounded-full">
                <Bell className="size-4 text-primary/70" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/90 tracking-tight">Notificações</h3>
                <p className="text-[11px] text-white/45">Alertas e comunicações (apenas frontend)</p>
              </div>
            </div>
            <div className="space-y-4 max-w-md">
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-white/50" />
                  <div>
                    <p className="text-sm font-medium text-white/90">E-mail para relatórios</p>
                    <p className="text-[11px] text-white/45">Receber resumo semanal por e-mail</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <div>
                  <p className="text-sm font-medium text-white/90">Novos cadastros</p>
                  <p className="text-[11px] text-white/45">Aviso quando um novo usuário se cadastrar</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <div>
                  <p className="text-sm font-medium text-white/90">Alertas de pagamento</p>
                  <p className="text-[11px] text-white/45">Notificar sobre pagamentos pendentes</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          {/* Segurança */}
          <div className="glass-card-3d rounded-2xl p-4 sm:p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/[0.08] p-2 rounded-full">
                <Shield className="size-4 text-primary/70" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/90 tracking-tight">Segurança</h3>
                <p className="text-[11px] text-white/45">Senha e acesso (apenas frontend)</p>
              </div>
            </div>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label className="text-white/70 text-sm">Senha atual</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/[0.06] border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70 text-sm">Nova senha</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/[0.06] border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70 text-sm">Confirmar nova senha</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/[0.06] border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <Button variant="outline" size="sm" className="text-white/80 border-white/20 hover:bg-white/10">
                <Shield className="size-4 mr-2" />
                Alterar senha
              </Button>
            </div>
          </div>

          {/* Aparência */}
          <div className="glass-card-3d rounded-2xl p-4 sm:p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/[0.08] p-2 rounded-full">
                <Palette className="size-4 text-primary/70" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/90 tracking-tight">Aparência</h3>
                <p className="text-[11px] text-white/45">Tema da interface (apenas frontend)</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-3 max-w-md">
              <div>
                <p className="text-sm font-medium text-white/90">Modo escuro</p>
                <p className="text-[11px] text-white/45">Usar tema escuro na área admin</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>

      <FloatingNav items={floatingNavItems} position="bottom-center" />
    </div>
  );
}

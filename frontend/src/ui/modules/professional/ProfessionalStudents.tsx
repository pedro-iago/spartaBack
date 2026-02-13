import { useState } from "react";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { PageHeader } from "@/ui/components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/ui/components/ui/sheet";
import {
  Users,
  Search,
  FileText,
  Sparkles,
  LogOut,
  Eye,
  ChevronRight,
  Plus,
  Mail,
  Phone,
  Calendar,
  Target,
  ArrowDownAZ,
  Filter,
  List,
  LayoutGrid,
  User,
  UserPlus,
  Activity,
  Scale,
} from "lucide-react";
import { FloatingNav, type FloatingNavItem } from "@/ui/components/ui/floating-nav";
import { useNavigate } from "react-router";

interface Bioimpedancia {
  peso?: number;
  altura?: number;
  gordura?: number;
  muscular?: number;
  agua?: number;
  visceral?: number;
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  email: string;
  plan: string;
  status: "active" | "inactive" | "pending";
  frequency: number;
  lastWorkout?: string;
  phone?: string;
  birthDate?: string;
  goal?: string;
  bio?: Bioimpedancia;
}

const MOCK_STUDENTS: Student[] = [
  { id: "1", name: "Carlos Silva", avatar: "CS", email: "carlos.silva@email.com", plan: "Premium", status: "active", frequency: 4, lastWorkout: "Hoje", phone: "(11) 98765-4321", birthDate: "15/03/1990", goal: "Hipertrofia", bio: { peso: 82, altura: 178, gordura: 18, muscular: 38, agua: 58, visceral: 5 } },
  { id: "2", name: "Ana Santos", avatar: "AS", email: "ana.santos@email.com", plan: "Básico", status: "active", frequency: 3, lastWorkout: "Ontem", phone: "(11) 91234-5678", birthDate: "22/07/1995", goal: "Emagrecimento" },
  { id: "3", name: "João Pedro", avatar: "JP", email: "joao.pedro@email.com", plan: "Premium", status: "active", frequency: 5, lastWorkout: "Há 2 dias", phone: "(21) 99876-5432", birthDate: "10/11/1988", goal: "Força" },
  { id: "4", name: "Marina Costa", avatar: "MC", email: "marina.costa@email.com", plan: "Premium", status: "active", frequency: 4, lastWorkout: "Há 3 dias", phone: "(31) 97654-3210", birthDate: "05/01/1992", goal: "Condicionamento" },
  { id: "5", name: "Rafael Oliveira", avatar: "RO", email: "rafael.oliveira@email.com", plan: "Básico", status: "pending", frequency: 2, lastWorkout: "—", phone: "(11) 96543-2109", birthDate: "18/09/1985", goal: "Hipertrofia" },
  { id: "6", name: "Fernanda Lima", avatar: "FL", email: "fernanda.lima@email.com", plan: "Básico", status: "inactive", frequency: 3, lastWorkout: "Há 1 semana", phone: "(41) 95432-1098", birthDate: "30/12/1993", goal: "Emagrecimento" },
];

const FREQUENCY_OPTIONS = [2, 3, 4, 5] as const;

const PLAN_OPTIONS = [
  { value: "Básico", label: "Básico", price: "49,99" },
  { value: "Premium", label: "Premium", price: "89,99" },
] as const;

export function ProfessionalStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newStudentOpen, setNewStudentOpen] = useState(false);
  const [newStudentPlan, setNewStudentPlan] = useState<string>("");
  const [newStudentFrequency, setNewStudentFrequency] = useState<string>("");
  const [newStudentGoal, setNewStudentGoal] = useState<string>("");
  const [bioPeso, setBioPeso] = useState("");
  const [bioAltura, setBioAltura] = useState("");
  const [bioGordura, setBioGordura] = useState("");
  const [bioMuscular, setBioMuscular] = useState("");
  const [bioAgua, setBioAgua] = useState("");
  const [bioVisceral, setBioVisceral] = useState("");
  const [editingBioFor, setEditingBioFor] = useState<string | null>(null);
  const [bioEditForm, setBioEditForm] = useState<Bioimpedancia>({});
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "pending">("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [frequencyFilter, setFrequencyFilter] = useState<string>("all");
  const [sortAlphabetical, setSortAlphabetical] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const floatingNavItems: FloatingNavItem[] = [
    { icon: <FileText />, label: "Revisões", onClick: () => navigate("/dashboard/professional") },
    { icon: <Users />, label: "Meus Alunos", onClick: () => {} },
    { icon: <Sparkles />, label: "IA Assistente", onClick: () => navigate("/assistant") },
    {
      icon: <LogOut />,
      label: "Sair",
      onClick: () => {
        localStorage.removeItem("@sparta:user");
        navigate("/login", { replace: true });
        window.location.reload();
      },
    },
  ];

  const filteredStudents = (() => {
    let list = students.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== "all") list = list.filter((s) => s.status === statusFilter);
    if (planFilter !== "all") list = list.filter((s) => s.plan === planFilter);
    if (frequencyFilter !== "all") list = list.filter((s) => s.frequency === Number(frequencyFilter));
    if (sortAlphabetical) {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    }
    return list;
  })();

  const updateStudentBio = (studentId: string, bio: Bioimpedancia) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, bio } : s)));
    if (selectedStudent?.id === studentId) {
      setSelectedStudent((prev) => (prev ? { ...prev, bio } : null));
    }
    setEditingBioFor(null);
    setBioEditForm({});
  };

  const getStatusLabel = (status: Student["status"]) => {
    switch (status) {
      case "active": return <span className="text-[11px] font-medium text-primary/80">Ativo</span>;
      case "pending": return <span className="text-[11px] font-medium text-white/50">Pendente</span>;
      case "inactive": return <span className="text-[11px] font-medium text-white/40">Inativo</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-page-dark">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Meus alunos"
          subtitle="Lista de alunos vinculados ao seu perfil"
          rightSlot={
            <Button
              size="icon"
              className="size-10 sm:size-11 rounded-full min-h-[44px] min-w-[44px] touch-manipulation"
              variant="default"
              onClick={() => setNewStudentOpen(true)}
              title="Registrar novo aluno"
            >
              <Plus className="size-5" />
            </Button>
          }
        />
        <div className="py-5 sm:py-6 lg:py-8 pb-28 sm:pb-24">
          {/* Barra de busca */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
            <div className="flex-1 w-full sm:max-w-md relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/45 pointer-events-none" />
              <Input
                placeholder="Buscar por nome ou e-mail..."
                className="pl-11 bg-white/[0.06] border-white/[0.08] text-white placeholder:text-white/40 h-12 sm:h-11 min-h-[48px] rounded-xl text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="text-sm text-white/50 whitespace-nowrap hidden sm:inline">
              {filteredStudents.length} {filteredStudents.length === 1 ? "aluno" : "alunos"}
            </span>
          </div>

          {/* Filtros — scroll horizontal no mobile */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="size-4 shrink-0 text-white/60" />
              <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Filtros</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 no-scrollbar sm:overflow-visible sm:flex-wrap">
              <div className="flex shrink-0 items-center gap-2">
                <div className="flex rounded-xl border border-white/10 bg-white/[0.04] p-1 gap-1">
                  {(["all", "active", "inactive", "pending"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setStatusFilter(value)}
                      className={`px-4 py-2.5 sm:px-3 sm:py-2 text-xs font-medium rounded-lg transition-colors touch-manipulation min-h-[44px] sm:min-h-0 whitespace-nowrap ${
                        statusFilter === value
                          ? "bg-primary text-primary-foreground"
                          : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      {value === "all" ? "Todos" : value === "active" ? "Ativos" : value === "inactive" ? "Inativos" : "Pendentes"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-[140px] sm:w-[130px] h-11 sm:h-9 min-h-[44px] sm:min-h-0 text-xs bg-white/[0.06] border-white/10 rounded-xl">
                    <SelectValue placeholder="Plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {PLAN_OPTIONS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
                  <SelectTrigger className="w-[140px] sm:w-[130px] h-11 sm:h-9 min-h-[44px] sm:min-h-0 text-xs bg-white/[0.06] border-white/10 rounded-xl">
                    <SelectValue placeholder="Por semana" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {FREQUENCY_OPTIONS.map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}x por semana
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <button
                type="button"
                onClick={() => setSortAlphabetical((v) => !v)}
                className={`flex shrink-0 items-center gap-2 px-4 py-2.5 sm:px-3 sm:py-2 min-h-[44px] sm:min-h-9 text-xs font-medium rounded-xl border transition-colors touch-manipulation ${
                  sortAlphabetical
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : "border-white/10 bg-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.08]"
                }`}
                title={sortAlphabetical ? "Desativar ordem alfabética" : "Ordenar A–Z"}
              >
                <ArrowDownAZ className="size-4 shrink-0" />
                A–Z
              </button>
            </div>
          </div>

          {/* Lista de alunos */}
          <section aria-label="Lista de alunos">
            <div className="flex items-center justify-between gap-4 mb-4 sm:mb-5">
              <h2 className="text-sm font-medium text-white/80">
                Alunos <span className="text-white/50 font-normal">({filteredStudents.length})</span>
              </h2>
              <div className="flex rounded-xl border border-white/10 bg-white/[0.04] p-1 gap-1" role="group" aria-label="Visualização">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors touch-manipulation ${
                    viewMode === "list"
                      ? "bg-primary/80 text-primary-foreground"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.06]"
                  }`}
                  title="Lista"
                  aria-pressed={viewMode === "list"}
                >
                  <List className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors touch-manipulation ${
                    viewMode === "grid"
                      ? "bg-primary/80 text-primary-foreground"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.06]"
                  }`}
                  title="Quadros"
                  aria-pressed={viewMode === "grid"}
                >
                  <LayoutGrid className="size-5" />
                </button>
              </div>
            </div>
            <div
              className={
                viewMode === "list"
                  ? "space-y-4 sm:space-y-4"
                  : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
              }
            >
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="glass-card-3d rounded-2xl p-5 sm:p-6 flex flex-col min-w-0 border border-white/5"
                >
                  <div className="flex flex-col gap-4 sm:gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="bg-white/[0.08] rounded-full size-12 sm:size-14 flex items-center justify-center shrink-0 border border-white/5">
                        <span className="text-base font-semibold text-primary/80">{student.avatar}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-white text-base sm:text-lg truncate">{student.name}</h3>
                        <p className="text-sm text-white/50 truncate mt-0.5">{student.email}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-white/45">
                          <span>{student.plan}</span>
                          <span>{student.frequency}x/semana</span>
                          {student.lastWorkout && student.lastWorkout !== "—" && (
                            <span>Último: {student.lastWorkout}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
                      {getStatusLabel(student.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/70 hover:text-white hover:bg-white/5 h-11 min-h-[44px] px-4 text-sm shrink-0 touch-manipulation rounded-xl"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Eye className="size-4 mr-2" />
                        Ver
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {filteredStudents.length === 0 && (
            <div className="text-center py-16 sm:py-20 px-6 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.03]">
              <Users className="size-12 mx-auto mb-3 text-white/30" />
              <p className="text-white/70 font-medium text-sm">
                Nenhum aluno encontrado
              </p>
              <p className="text-xs text-white/45 mt-1">
                {search ? `Não há resultados para "${search}".` : "Registre um novo aluno para começar."}
              </p>
              {!search && (
                <Button variant="default" size="sm" className="mt-4 rounded-xl font-medium" onClick={() => setNewStudentOpen(true)}>
                  <Plus className="size-4 mr-2" />
                  Registrar aluno
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <FloatingNav items={floatingNavItems} position="bottom-center" />

      {/* Sheet - Dados do cliente */}
      <Sheet open={!!selectedStudent} onOpenChange={(open) => { if (!open) { setSelectedStudent(null); setEditingBioFor(null); setBioEditForm({}); } }}>
        <SheetContent
          side="right"
          className="w-[100vw] sm:w-full sm:max-w-md !bg-[#171717] border-l border-border p-0 flex flex-col overflow-hidden"
        >
          <div className="flex flex-col h-full overflow-hidden">
            <SheetHeader className="p-4 sm:p-6 pb-2 border-b border-border shrink-0">
              <SheetTitle className="text-lg sm:text-xl">Dados do aluno</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                Informações do cliente vinculado ao seu perfil
              </SheetDescription>
            </SheetHeader>

            {selectedStudent && (
              <>
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0 bg-[#252525] border border-white/10">
                      <span className="font-bold text-lg sm:text-xl text-primary">{selectedStudent.avatar}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base sm:text-lg text-foreground truncate">{selectedStudent.name}</h3>
                      <div className="mt-1.5">{getStatusLabel(selectedStudent.status)}</div>
                    </div>
                  </div>

                  <dl className="space-y-4 sm:space-y-5">
                    <div className="grid gap-1">
                      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 shrink-0" /> E-mail
                      </dt>
                      <dd className="text-sm sm:text-base text-foreground break-all">{selectedStudent.email}</dd>
                    </div>
                    {selectedStudent.phone && (
                      <div className="grid gap-1">
                        <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 shrink-0" /> Telefone
                        </dt>
                        <dd className="text-sm sm:text-base text-foreground">{selectedStudent.phone}</dd>
                      </div>
                    )}
                    {selectedStudent.birthDate && (
                      <div className="grid gap-1">
                        <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 shrink-0" /> Data de nasc.
                        </dt>
                        <dd className="text-sm sm:text-base text-foreground">{selectedStudent.birthDate}</dd>
                      </div>
                    )}
                    <div className="grid gap-1">
                      <dt className="text-xs font-medium text-white/45">Plano</dt>
                      <dd className="text-sm text-white/85">{selectedStudent.plan}</dd>
                    </div>
                    <div className="grid gap-1">
                      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Frequência</dt>
                      <dd className="text-sm sm:text-base text-foreground">{selectedStudent.frequency}x por semana</dd>
                    </div>
                    {selectedStudent.goal && (
                      <div className="grid gap-1">
                        <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Target className="h-3.5 w-3.5 shrink-0" /> Objetivo
                        </dt>
                        <dd className="text-sm sm:text-base text-foreground">{selectedStudent.goal}</dd>
                      </div>
                    )}
                    {selectedStudent.lastWorkout && selectedStudent.lastWorkout !== "—" && (
                      <div className="grid gap-1 pt-3 border-t border-border">
                        <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Último treino</dt>
                        <dd className="text-sm sm:text-base text-foreground">{selectedStudent.lastWorkout}</dd>
                      </div>
                    )}

                    {/* Bioimpedância */}
                    <div className="pt-4 mt-4 border-t border-border">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                          <Activity className="size-3.5" /> Bioimpedância
                        </h4>
                        {!selectedStudent.bio && editingBioFor !== selectedStudent.id ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:bg-primary/10 h-8 text-xs"
                            onClick={() => {
                              setEditingBioFor(selectedStudent.id);
                              setBioEditForm({});
                            }}
                          >
                            <Plus className="size-3.5 mr-1.5" />
                            Adicionar
                          </Button>
                        ) : selectedStudent.bio && editingBioFor !== selectedStudent.id ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white/60 hover:text-white h-8 text-xs"
                            onClick={() => {
                              setEditingBioFor(selectedStudent.id);
                              setBioEditForm(selectedStudent.bio || {});
                            }}
                          >
                            Editar
                          </Button>
                        ) : null}
                      </div>

                      {editingBioFor === selectedStudent.id ? (
                        <div className="space-y-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-medium text-white/60">Peso (kg)</label>
                              <Input
                                type="number"
                                placeholder="kg"
                                value={bioEditForm.peso ?? ""}
                                onChange={(e) => setBioEditForm((f) => ({ ...f, peso: e.target.value ? Number(e.target.value) : undefined }))}
                                className="h-9 rounded-lg bg-white/[0.06] border-white/10 text-white text-sm placeholder:text-white/40"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-medium text-white/60">Altura (cm)</label>
                              <Input
                                type="number"
                                placeholder="cm"
                                value={bioEditForm.altura ?? ""}
                                onChange={(e) => setBioEditForm((f) => ({ ...f, altura: e.target.value ? Number(e.target.value) : undefined }))}
                                className="h-9 rounded-lg bg-white/[0.06] border-white/10 text-white text-sm placeholder:text-white/40"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-medium text-white/60">% Gordura</label>
                              <Input
                                type="number"
                                placeholder="%"
                                value={bioEditForm.gordura ?? ""}
                                onChange={(e) => setBioEditForm((f) => ({ ...f, gordura: e.target.value ? Number(e.target.value) : undefined }))}
                                className="h-9 rounded-lg bg-white/[0.06] border-white/10 text-white text-sm placeholder:text-white/40"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-medium text-white/60">Massa muscular (kg)</label>
                              <Input
                                type="number"
                                placeholder="kg"
                                value={bioEditForm.muscular ?? ""}
                                onChange={(e) => setBioEditForm((f) => ({ ...f, muscular: e.target.value ? Number(e.target.value) : undefined }))}
                                className="h-9 rounded-lg bg-white/[0.06] border-white/10 text-white text-sm placeholder:text-white/40"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-medium text-white/60">% Água</label>
                              <Input
                                type="number"
                                placeholder="%"
                                value={bioEditForm.agua ?? ""}
                                onChange={(e) => setBioEditForm((f) => ({ ...f, agua: e.target.value ? Number(e.target.value) : undefined }))}
                                className="h-9 rounded-lg bg-white/[0.06] border-white/10 text-white text-sm placeholder:text-white/40"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-medium text-white/60">Gordura visceral</label>
                              <Input
                                type="number"
                                placeholder="nível"
                                value={bioEditForm.visceral ?? ""}
                                onChange={(e) => setBioEditForm((f) => ({ ...f, visceral: e.target.value ? Number(e.target.value) : undefined }))}
                                className="h-9 rounded-lg bg-white/[0.06] border-white/10 text-white text-sm placeholder:text-white/40"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-1 text-white/60"
                              onClick={() => { setEditingBioFor(null); setBioEditForm({}); }}
                            >
                              Cancelar
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              className="flex-1"
                              onClick={() => updateStudentBio(selectedStudent.id, bioEditForm)}
                            >
                              Salvar
                            </Button>
                          </div>
                        </div>
                      ) : selectedStudent.bio && Object.keys(selectedStudent.bio).length > 0 ? (
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          {selectedStudent.bio.peso != null && <><dt className="text-white/50">Peso</dt><dd className="text-foreground">{selectedStudent.bio.peso} kg</dd></>}
                          {selectedStudent.bio.altura != null && <><dt className="text-white/50">Altura</dt><dd className="text-foreground">{selectedStudent.bio.altura} cm</dd></>}
                          {selectedStudent.bio.peso != null && selectedStudent.bio.altura != null && (
                            <><dt className="text-white/50">IMC</dt><dd className="text-foreground">{(selectedStudent.bio.peso / Math.pow(selectedStudent.bio.altura / 100, 2)).toFixed(1)} kg/m²</dd></>
                          )}
                          {selectedStudent.bio.gordura != null && <><dt className="text-white/50">% Gordura</dt><dd className="text-foreground">{selectedStudent.bio.gordura}%</dd></>}
                          {selectedStudent.bio.muscular != null && <><dt className="text-white/50">Massa muscular</dt><dd className="text-foreground">{selectedStudent.bio.muscular} kg</dd></>}
                          {selectedStudent.bio.agua != null && <><dt className="text-white/50">% Água</dt><dd className="text-foreground">{selectedStudent.bio.agua}%</dd></>}
                          {selectedStudent.bio.visceral != null && <><dt className="text-white/50">Gordura visceral</dt><dd className="text-foreground">{selectedStudent.bio.visceral}</dd></>}
                        </dl>
                      ) : !selectedStudent.bio && editingBioFor !== selectedStudent.id ? (
                        <p className="text-xs text-white/45">Nenhum dado de bioimpedância registrado.</p>
                      ) : null}
                    </div>
                  </dl>
                </div>

                <div className="p-4 sm:p-6 pt-4 border-t border-border shrink-0 bg-[#171717]">
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="w-full min-h-[2.75rem] sm:min-h-[3rem] rounded-xl font-semibold text-sm sm:text-base text-[#171512] transition-transform duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717] hover:brightness-110"
                    style={{
                      background: "linear-gradient(145deg, #e8c85c, #c9a227)",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -2px 6px rgba(0,0,0,0.15)",
                    }}
                  >
                    Confirmar
                  </button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Sheet - Registrar novo aluno */}
      <Sheet open={newStudentOpen} onOpenChange={setNewStudentOpen}>
        <SheetContent
          side="right"
          className="w-[100vw] sm:w-full sm:max-w-lg !bg-[#0f1416] border-l border-white/10 p-0 flex flex-col overflow-hidden"
        >
          <div className="flex flex-col h-full overflow-hidden">
            <SheetHeader className="p-5 sm:p-6 pb-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3 mb-1">
                <div className="size-11 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <UserPlus className="size-6 text-primary" />
                </div>
                <div>
                  <SheetTitle className="text-lg sm:text-xl text-white font-semibold">
                    Registrar novo aluno
                  </SheetTitle>
                  <SheetDescription className="text-sm text-white/50 mt-0.5">
                    Preencha os dados para vincular ao seu perfil
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Dados pessoais */}
              <section>
                <h4 className="text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User className="size-3.5" />
                  Dados pessoais
                </h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/80">Nome completo</label>
                    <Input
                      placeholder="Ex.: Maria Silva"
                      className="h-11 rounded-xl bg-white/[0.06] border-white/10 text-white placeholder:text-white/40 focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/80 flex items-center gap-2">
                      <Mail className="size-3.5" /> E-mail
                    </label>
                    <Input
                      type="email"
                      placeholder="email@exemplo.com"
                      className="h-11 rounded-xl bg-white/[0.06] border-white/10 text-white placeholder:text-white/40 focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/80 flex items-center gap-2">
                      <Phone className="size-3.5" /> Telefone
                    </label>
                    <Input
                      placeholder="(11) 99999-9999"
                      className="h-11 rounded-xl bg-white/[0.06] border-white/10 text-white placeholder:text-white/40 focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/80 flex items-center gap-2">
                      <Calendar className="size-3.5" /> Data de nascimento
                    </label>
                    <Input
                      placeholder="DD/MM/AAAA"
                      className="h-11 rounded-xl bg-white/[0.06] border-white/10 text-white placeholder:text-white/40 focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
              </section>

              {/* Plano e treino */}
              <section>
                <h4 className="text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Target className="size-3.5" />
                  Plano e treino
                </h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/80">Plano</label>
                    <Select value={newStudentPlan || undefined} onValueChange={setNewStudentPlan}>
                      <SelectTrigger className="h-11 rounded-xl bg-white/[0.06] border-white/10 text-white [&>span]:text-white/90">
                        <SelectValue placeholder="Selecione o plano" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1f22] border-white/10">
                        {PLAN_OPTIONS.map((plan) => (
                          <SelectItem
                            key={plan.value}
                            value={plan.value}
                            className="text-white/90 focus:bg-primary/20 focus:text-white"
                          >
                            <span className="font-medium">{plan.label}</span>
                            <span className="text-white/50 ml-2">— R$ {plan.price}/mês</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/80">Frequência de treinos</label>
                    <Select value={newStudentFrequency || undefined} onValueChange={setNewStudentFrequency}>
                      <SelectTrigger className="h-11 rounded-xl bg-white/[0.06] border-white/10 text-white [&>span]:text-white/90">
                        <SelectValue placeholder="Treinos por semana" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1f22] border-white/10">
                        {FREQUENCY_OPTIONS.map((n) => (
                          <SelectItem
                            key={n}
                            value={String(n)}
                            className="text-white/90 focus:bg-primary/20 focus:text-white"
                          >
                            {n}x por semana
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/80">Objetivo</label>
                    <Select value={newStudentGoal || undefined} onValueChange={setNewStudentGoal}>
                      <SelectTrigger className="h-11 rounded-xl bg-white/[0.06] border-white/10 text-white [&>span]:text-white/90">
                        <SelectValue placeholder="Ex.: Hipertrofia, Emagrecimento" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1f22] border-white/10">
                        <SelectItem value="hipertrofia" className="text-white/90 focus:bg-primary/20 focus:text-white">Hipertrofia</SelectItem>
                        <SelectItem value="emagrecimento" className="text-white/90 focus:bg-primary/20 focus:text-white">Emagrecimento</SelectItem>
                        <SelectItem value="forca" className="text-white/90 focus:bg-primary/20 focus:text-white">Força</SelectItem>
                        <SelectItem value="condicionamento" className="text-white/90 focus:bg-primary/20 focus:text-white">Condicionamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              {/* Bioimpedância */}
              <section>
                <h4 className="text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Activity className="size-3.5" />
                  Bioimpedância
                </h4>
                <p className="text-[11px] text-white/45 mb-3">
                  Opcional — o aluno pode fazer a avaliação em outro momento
                </p>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/80 flex items-center gap-2">
                      <Scale className="size-3.5" /> Peso
                    </label>
                    <Input
                      type="number"
                      placeholder="kg"
                      value={bioPeso}
                      onChange={(e) => setBioPeso(e.target.value)}
                      className="h-11 rounded-xl bg-white/[0.06] border-white/10 text-white placeholder:text-white/40 focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/80">Altura</label>
                    <Input
                      type="number"
                      placeholder="cm"
                      value={bioAltura}
                      onChange={(e) => setBioAltura(e.target.value)}
                      className="h-11 rounded-xl bg-white/[0.06] border-white/10 text-white placeholder:text-white/40 focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/80">% Gordura</label>
                    <Input
                      type="number"
                      placeholder="%"
                      value={bioGordura}
                      onChange={(e) => setBioGordura(e.target.value)}
                      className="h-11 rounded-xl bg-white/[0.06] border-white/10 text-white placeholder:text-white/40 focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/80">Massa muscular</label>
                    <Input
                      type="number"
                      placeholder="kg"
                      value={bioMuscular}
                      onChange={(e) => setBioMuscular(e.target.value)}
                      className="h-11 rounded-xl bg-white/[0.06] border-white/10 text-white placeholder:text-white/40 focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/80">% Água corp.</label>
                    <Input
                      type="number"
                      placeholder="%"
                      value={bioAgua}
                      onChange={(e) => setBioAgua(e.target.value)}
                      className="h-11 rounded-xl bg-white/[0.06] border-white/10 text-white placeholder:text-white/40 focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/80">Gordura visceral</label>
                    <Input
                      type="number"
                      placeholder="nível"
                      value={bioVisceral}
                      onChange={(e) => setBioVisceral(e.target.value)}
                      className="h-11 rounded-xl bg-white/[0.06] border-white/10 text-white placeholder:text-white/40 focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
                {bioPeso && bioAltura && Number(bioPeso) > 0 && Number(bioAltura) > 0 && (
                  <p className="text-[11px] text-primary/80 mt-2">
                    IMC: {(Number(bioPeso) / Math.pow(Number(bioAltura) / 100, 2)).toFixed(1)} kg/m²
                  </p>
                )}
              </section>
            </div>

            <div className="p-5 sm:p-6 pt-4 border-t border-white/10 shrink-0 space-y-3">
              <Button
                variant="default"
                size="lg"
                className="w-full h-12 rounded-xl font-semibold"
                onClick={() => setNewStudentOpen(false)}
              >
                <UserPlus className="size-5 mr-2" />
                Registrar aluno
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-white/60 hover:text-white"
                onClick={() => setNewStudentOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

import { useNavigate, useLocation } from "react-router";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/ui/components/ui/button";
import { PageHeader } from "@/ui/components/ui/page-header";
import { Input } from "@/ui/components/ui/input";
import { trainingService } from "@/shared/services/trainingService";
import type { UpdateTrainingSetDTO } from "@/shared/types";
import {
  ArrowLeft,
  LogOut,
  Sparkles,
  ThumbsUp,
  Settings2,
  Loader2,
} from "lucide-react";
import type { TrainingResponseDTO, TrainingSetDTO } from "@/shared/types";

type LocationState = { trainingId?: string; training?: TrainingResponseDTO } | null;

/** Um set editável no formulário (espelha TrainingSetDTO para exibição + submit) */
type EditableSet = {
  id: string | null;
  exerciseId: string;
  exerciseName: string;
  dayLetter: string;
  exerciseOrder: number;
  sets: number;
  reps: string;
  restSeconds: number;
  loadPrescription: string;
  technique: string;
  notes: string;
};

function toEditableSet(s: TrainingSetDTO): EditableSet {
  return {
    id: typeof s.id === "string" ? s.id : s.id != null ? String(s.id) : null,
    exerciseId: s.exerciseId ?? "",
    exerciseName: s.exerciseName ?? "",
    dayLetter: s.dayLetter ?? "",
    exerciseOrder: s.exerciseOrder ?? 0,
    sets: s.sets ?? 0,
    reps: s.reps ?? "",
    restSeconds: s.restSeconds ?? 90,
    loadPrescription: s.loadPrescription ?? "",
    technique: s.technique ?? "",
    notes: s.notes ?? "",
  };
}

function toUpdateSet(s: EditableSet): UpdateTrainingSetDTO {
  return {
    id: s.id,
    exerciseId: s.exerciseId,
    dayLetter: s.dayLetter,
    exerciseOrder: s.exerciseOrder,
    sets: s.sets,
    reps: s.reps,
    restSeconds: s.restSeconds,
    loadPrescription: s.loadPrescription,
    technique: s.technique,
    notes: s.notes,
  };
}

export default function InstructorReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? null;
  const trainingId = state?.trainingId ?? null;
  const training = state?.training ?? null;

  const initialEditableSets = useMemo(
    () => (training?.sets ?? []).map(toEditableSet),
    [training?.id]
  );
  const [editableSets, setEditableSets] = useState<EditableSet[]>(initialEditableSets);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditableSets((training?.sets ?? []).map(toEditableSet));
  }, [training?.id]);

  const updateSet = (index: number, field: keyof EditableSet, value: string | number) => {
    setEditableSets((prev) => {
      const next = [...prev];
      if (!next[index]) return prev;
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSaveManual = async () => {
    if (!trainingId || editableSets.length === 0) {
      toast.info("Nenhuma alteração ou treino sem exercícios.");
      return;
    }
    setSaving(true);
    try {
      const payload = { sets: editableSets.map(toUpdateSet) };
      const updated = await trainingService.updateTraining(trainingId, payload);
      setEditableSets((updated.sets ?? []).map(toEditableSet));
      toast.success("Treino salvo com sucesso.");
    } catch (e: unknown) {
      const msg = e && typeof e === "object" && "message" in e ? String((e as { message: unknown }).message) : "Erro ao salvar.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

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

  if (!trainingId || !training) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-page-dark">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="Revisão de treino"
            subtitle="Treino não encontrado"
            leftSlot={
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard/professional/solicitacoes")}
                className="size-10 sm:size-11 min-h-[44px] min-w-[44px] text-white/70 hover:text-white touch-manipulation rounded-lg shrink-0"
                aria-label="Voltar"
              >
                <ArrowLeft className="size-5 sm:size-6" />
              </Button>
            }
          />
          <div className="glass-card-3d rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
            <p className="text-white/80 mb-4">Selecione um treino na página de Solicitações para revisar.</p>
            <Button
              variant="default"
              onClick={() => navigate("/dashboard/professional/solicitacoes")}
              className="min-h-[44px]"
            >
              Ir para Solicitações
          </Button>
        </div>
        </div>
      </div>
    );
  }

  const initials = training.userName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "?";
  const sets = editableSets;

  return (
    <div className="min-h-screen min-h-[100dvh] bg-page-dark">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Revisão de treino"
          subtitle={training.userName}
          leftSlot={
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard/professional/solicitacoes")}
              className="size-10 sm:size-11 min-h-[44px] min-w-[44px] text-white/70 hover:text-white touch-manipulation rounded-lg shrink-0"
              aria-label="Voltar às solicitações"
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

        <main className="pb-28">
          {/* Card do aluno */}
          <section className="mb-6">
            <div className="glass-card-3d rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center gap-4">
              <div className="bg-white/[0.08] rounded-full size-12 sm:size-14 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-primary/80">{initials}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-white/95 truncate">{training.userName}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] sm:text-xs text-white/50">
                  <span>Nível: {training.level}</span>
                  <span>•</span>
                  <span>Foco: {training.focus}</span>
                  <span>•</span>
                  <span>{training.daysPerWeek} dias/sem</span>
                </div>
                {training.limitations && (
                  <p className="text-[11px] text-white/45 mt-1 line-clamp-2">{training.limitations}</p>
                )}
              </div>
            </div>
          </section>

          {/* Lista de exercícios / sets */}
          <section>
            <h3 className="text-sm font-medium text-white/70 mb-3">Exercícios do treino</h3>
            {sets.length === 0 ? (
              <div className="glass-card-3d rounded-xl sm:rounded-2xl p-6 text-center">
                <Sparkles className="size-10 text-white/30 mx-auto mb-2" />
                <p className="text-sm text-white/60">Treino ainda sem exercícios (aguardando IA ou em draft).</p>
                <p className="text-xs text-white/40 mt-1">Você pode aprovar para ativar ou aguardar a geração pela IA.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sets.map((set: EditableSet, idx: number) => (
                  <div
                    key={set.id ?? `e-${idx}`}
                    className="glass-card-3d rounded-xl sm:rounded-2xl p-4 sm:p-5 border-l-4 border-primary/60"
                  >
                    <h4 className="font-medium text-white/90 text-sm sm:text-base mb-3 truncate">{set.exerciseName}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-medium text-white/45">Séries</label>
                        <Input
                          type="number"
                          min={1}
                          value={set.sets}
                          onChange={(e) => updateSet(idx, "sets", e.target.value === "" ? 0 : Number(e.target.value))}
                          className="h-9 sm:h-10 bg-white/[0.06] border-white/[0.08] text-white text-center font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-medium text-white/45">Reps</label>
                        <Input
                          type="text"
                          value={set.reps}
                          onChange={(e) => updateSet(idx, "reps", e.target.value)}
                          className="h-9 sm:h-10 bg-white/[0.06] border-white/[0.08] text-white text-center font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-medium text-white/45">Desc. (s)</label>
                        <Input
                          type="number"
                          min={0}
                          value={set.restSeconds}
                          onChange={(e) => updateSet(idx, "restSeconds", e.target.value === "" ? 0 : Number(e.target.value))}
                          className="h-9 sm:h-10 bg-white/[0.06] border-white/[0.08] text-white text-center font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-medium text-white/45">Dia</label>
                        <Input
                          type="text"
                          value={set.dayLetter}
                          className="h-9 sm:h-10 bg-white/[0.06] border-white/[0.08] text-white text-center"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Ações fixas no rodapé */}
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-page-dark/95 backdrop-blur border-t border-white/[0.06] p-4 safe-area-pb">
          <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 min-h-[44px] text-white/70 hover:text-white hover:bg-white/[0.06] border border-white/[0.08]"
              onClick={handleSaveManual}
              disabled={saving}
            >
              {saving ? <Loader2 className="mr-2 size-4 shrink-0 animate-spin" /> : <Settings2 className="mr-2 size-4 shrink-0" />}
              {saving ? "Salvando…" : "Ajustar manualmente"}
            </Button>
            <Button
              variant="default"
              className="flex-1 min-h-[44px] font-medium"
              onClick={() => navigate("/dashboard/professional/solicitacoes")}
              disabled={saving}
            >
              <ThumbsUp className="mr-2 size-4 shrink-0" />
              Aprovar treino
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}

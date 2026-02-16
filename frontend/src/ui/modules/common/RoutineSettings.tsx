import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/ui/components/ui/page-header";
import { Button } from "@/ui/components/ui/button";
import { Card } from "@/ui/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useSparta } from "@/shared/context/SpartaContext";
import { ExperienceLevel } from "@/shared/types";
import { trainingService } from "@/shared/services/trainingService";

const RoutineSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useSparta();
  const [loading, setLoading] = useState(false);
  const [limitations, setLimitations] = useState("");

  const handleGenerateProtocol = async () => {
    setLoading(true);
    try {
      const levelMap: Record<string, string> = {
        [ExperienceLevel.BEGINNER]: "BEGINNER",
        [ExperienceLevel.INTERMEDIATE]: "INTERMEDIATE",
        [ExperienceLevel.ADVANCED]: "ADVANCED",
      };
      await trainingService.createRequest({
        level: levelMap[user.level ?? ""] ?? "BEGINNER",
        focus: (user.goal as string) ?? "HYPERTROPHY",
        daysPerWeek: user.frequency ?? 3,
        limitations: limitations || "Nenhuma",
      });
      alert("Solicitação enviada! Seu personal irá analisar.");
      navigate("/dashboard/student");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-page-dark flex flex-col items-center justify-center p-8 text-center text-white">
        <Loader2 className="size-12 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium text-white/80">Enviando ao personal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-page-dark flex flex-col text-white">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Anamnese"
          subtitle="Dias por semana, nível e limitações"
          leftSlot={
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex min-w-[44px] min-h-[44px] size-11 shrink-0 items-center justify-center rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors touch-manipulation"
              aria-label="Voltar"
            >
              <ArrowLeft className="size-5 sm:size-6" />
            </button>
          }
        />
      </div>

      <main className="flex-1 overflow-y-auto pb-28 pt-2">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8">
          {/* Frequência */}
          <Card variant="glass" className="rounded-2xl border border-white/10 p-4 sm:p-5">
            <h2 className="text-sm font-medium text-white/90 tracking-tight mb-1">Dias por semana</h2>
            <p className="text-xs text-white/50 mb-4">Quantos dias você tem disponível?</p>
            <div className="grid grid-cols-6 gap-2">
              {[2, 3, 4, 5, 6, 7].map((num) => (
                <label key={num} className="cursor-pointer">
                  <input
                    type="radio"
                    name="days"
                    className="peer sr-only"
                    checked={user.frequency === num}
                    onChange={() => updateUser({ frequency: num })}
                  />
                  <div className="h-14 rounded-xl bg-white/[0.06] border border-white/10 peer-checked:border-primary peer-checked:bg-primary/10 flex items-center justify-center font-semibold text-lg text-white/90 peer-checked:text-primary transition-all">
                    {num}
                  </div>
                </label>
              ))}
            </div>
          </Card>

          {/* Nível */}
          <Card variant="glass" className="rounded-2xl border border-white/10 p-4 sm:p-5">
            <h2 className="text-sm font-medium text-white/90 tracking-tight mb-4">Nível de experiência</h2>
            <div className="flex flex-col gap-3">
              {[
                { id: ExperienceLevel.BEGINNER, label: "Iniciante", desc: "Nunca treinei ou parei há muito tempo" },
                { id: ExperienceLevel.INTERMEDIATE, label: "Intermediário", desc: "Treino regularmente há 6 meses+" },
                { id: ExperienceLevel.ADVANCED, label: "Avançado", desc: "Atleta ou treino intenso há anos" },
              ].map((level) => (
                <label key={level.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="level"
                    className="peer sr-only"
                    checked={user.level === level.id}
                    onChange={() => updateUser({ level: level.id })}
                  />
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 peer-checked:border-primary peer-checked:bg-primary/5 flex items-center gap-4 transition-all">
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm text-white/90 block">{level.label}</span>
                      <span className="text-xs text-white/50">{level.desc}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          {/* Limitações */}
          <Card variant="glass" className="rounded-2xl border border-white/10 p-4 sm:p-5">
            <h2 className="text-sm font-medium text-white/90 tracking-tight mb-1">Histórico de lesões</h2>
            <p className="text-xs text-white/50 mb-3">Possui alguma limitação, dor ou cirurgia?</p>
            <textarea
              className="w-full rounded-xl bg-white/[0.06] border border-white/10 p-3 text-white text-sm placeholder:text-white/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[100px]"
              placeholder="Ex: Tenho condromalácia no joelho esquerdo, dor no ombro..."
              value={limitations}
              onChange={(e) => setLimitations(e.target.value)}
            />
          </Card>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-page-dark border-t border-white/5">
        <div className="w-full max-w-4xl mx-auto">
          <Button
            size="lg"
            className="w-full rounded-xl font-semibold uppercase min-h-12"
            onClick={handleGenerateProtocol}
          >
            Enviar para análise
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoutineSettings;
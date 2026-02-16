import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/ui/components/ui/page-header";
import { Button } from "@/ui/components/ui/button";
import { Card } from "@/ui/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";
import { useSparta } from "@/shared/context/SpartaContext";
import { Goal } from "@/shared/types";
import { IMAGES } from "@/shared/constants/images";

const GoalSelection: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useSparta();

  const goals = [
    { id: Goal.WEIGHT_LOSS, title: "Emagrecimento", desc: "Queima calórica acelerada", img: IMAGES.GOAL_WEIGHT_LOSS },
    { id: Goal.HYPERTROPHY, title: "Hipertrofia", desc: "Ganho de massa e força bruta", img: IMAGES.GOAL_HYPERTROPHY },
    { id: Goal.CONDITIONING, title: "Condicionamento", desc: "Resistência e saúde funcional", img: IMAGES.GOAL_CONDITIONING },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-page-dark flex flex-col">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Qual seu objetivo?"
          subtitle="Escolha para continuar a anamnese"
          titleSize="large"
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
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
          {goals.map((goal) => (
            <label key={goal.id} className="block cursor-pointer">
              <input
                type="radio"
                name="goal"
                className="peer sr-only"
                value={goal.id}
                checked={user?.goal === goal.id}
                onChange={() => updateUser({ goal: goal.id })}
              />
              <Card
                variant="glass"
                className="relative h-36 sm:h-40 overflow-hidden rounded-2xl border border-white/10 peer-checked:border-primary peer-checked:bg-primary/5 transition-all touch-manipulation active:scale-[0.99]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center grayscale peer-checked:grayscale-0 opacity-60 peer-checked:opacity-80 transition-all"
                  style={{ backgroundImage: `url('${goal.img}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="relative z-10 h-full flex items-end justify-between p-4 sm:p-5">
                  <div>
                    <h3 className="text-white text-lg sm:text-xl font-semibold tracking-tight">{goal.title}</h3>
                    <p className="text-white/60 text-xs sm:text-sm mt-0.5">{goal.desc}</p>
                  </div>
                  {user?.goal === goal.id && (
                    <div className="size-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="size-4 text-[#171512]" />
                    </div>
                  )}
                </div>
              </Card>
            </label>
          ))}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-page-dark border-t border-white/5 safe-area-pb">
        <div className="w-full max-w-4xl mx-auto">
          <Button
            size="lg"
            className="w-full rounded-xl font-semibold uppercase min-h-12"
            onClick={() => navigate("/routine")}
          >
            Confirmar objetivo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoalSelection;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSparta } from "@/shared/context/SpartaContext";
import { Button } from "@/ui/components/ui/button";
import { PageHeader } from "@/ui/components/ui/page-header";
import { Progress } from "@/ui/components/ui/progress";
import { FloatingNav, type FloatingNavItem } from "@/ui/components/ui/floating-nav";
import {
  Home,
  Dumbbell,
  ChefHat,
  User,
  CheckCircle2,
  Plus,
  Camera,
  MessageCircle,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { IMAGES } from "@/shared/constants/images";
import type { Meal, MealVariation } from "@/shared/types";

type MacroTab = "calories" | "protein" | "carbs" | "fat";

const TAB_CONFIG: { key: MacroTab; label: string; unit: string }[] = [
  { key: "calories", label: "Calorias", unit: "kcal" },
  { key: "protein", label: "Proteína", unit: "g" },
  { key: "fat", label: "Gordura", unit: "g" },
  { key: "carbs", label: "Carbos", unit: "g" },
];

// Mock: nutricionista responsável
const NUTRITIONIST = {
  name: "Dra. Ana Costa",
  avatar: IMAGES.INSTRUCTOR,
  crn: "CRN 12345",
};

// Mock: restrições alimentares do cliente
const DIETARY_RESTRICTIONS = ["Glúten", "Lactose", "Amendoim"];

// Mock: refeições do plano com 3 variações cada
const MOCK_MEALS_WITH_VARIATIONS: (Meal & { variations: MealVariation[] })[] = [
  {
    id: "1",
    name: "Café da manhã",
    calories: 450,
    protein: 22,
    carbs: 52,
    fat: 18,
    time: "08:00",
    completed: true,
    variations: [
      { id: "v1-1", name: "Omelete + pão integral", calories: 450, protein: 22, carbs: 52, fat: 18 },
      { id: "v1-2", name: "Aveia + banana + mel", calories: 380, protein: 12, carbs: 68, fat: 8 },
      { id: "v1-3", name: "Tapioca + ovo + queijo", calories: 420, protein: 20, carbs: 45, fat: 16 },
    ],
  },
  {
    id: "2",
    name: "Almoço",
    calories: 650,
    protein: 45,
    carbs: 65,
    fat: 22,
    time: "12:30",
    completed: false,
    variations: [
      { id: "v2-1", name: "Frango grelhado + arroz + salada", calories: 650, protein: 45, carbs: 65, fat: 22 },
      { id: "v2-2", name: "Peixe + batata-doce + brócolis", calories: 580, protein: 42, carbs: 52, fat: 18 },
      { id: "v2-3", name: "Carne magra + quinoa + legumes", calories: 620, protein: 48, carbs: 58, fat: 20 },
    ],
  },
  {
    id: "3",
    name: "Jantar",
    calories: 480,
    protein: 38,
    carbs: 42,
    fat: 18,
    time: "19:00",
    completed: false,
    variations: [
      { id: "v3-1", name: "Salada com frango + abacate", calories: 480, protein: 38, carbs: 42, fat: 18 },
      { id: "v3-2", name: "Omelete de claras + vegetais", calories: 320, protein: 35, carbs: 18, fat: 14 },
      { id: "v3-3", name: "Sopa de legumes + frango", calories: 400, protein: 32, carbs: 38, fat: 12 },
    ],
  },
];

const DailyDiet: React.FC = () => {
  const navigate = useNavigate();
  const { meals: mealsFromContext, user } = useSparta();
  const [activeTab, setActiveTab] = useState<MacroTab>("calories");
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<Record<string, string>>({});

  // Combina refeições do contexto (registradas) com plano mock
  const displayMeals = mealsFromContext.length > 0
    ? mealsFromContext
    : MOCK_MEALS_WITH_VARIATIONS;

  const floatingNavItems: FloatingNavItem[] = [
    { icon: <Home />, label: "Início", onClick: () => navigate("/dashboard/student") },
    { icon: <Dumbbell />, label: "Treinos", onClick: () => navigate("/student/workouts") },
    { icon: <ChefHat />, label: "Dieta", onClick: () => navigate("/diet") },
    { icon: <User />, label: "Perfil", onClick: () => navigate("/dashboard/perfil") },
  ];

  const streakDays = 24;
  const targets = { calories: 2400, protein: 180, carbs: 200, fat: 60 };
  const totals = displayMeals.reduce(
    (acc, m) => ({
      calories: acc.calories + (m.completed ? m.calories : 0),
      protein: acc.protein + (m.completed ? m.protein : 0),
      carbs: acc.carbs + (m.completed ? m.carbs : 0),
      fat: acc.fat + (m.completed ? m.fat : 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const macros = [
    { label: "PROT", key: "protein" as const },
    { label: "CARB", key: "carbs" as const },
    { label: "GORD", key: "fat" as const },
  ];

  const currentValue = totals[activeTab];
  const currentTarget = targets[activeTab];
  const currentUnit = TAB_CONFIG.find((t) => t.key === activeTab)?.unit ?? "kcal";
  const progressPercent = currentTarget > 0 ? Math.min(100, Math.round((currentValue / currentTarget) * 100)) : 0;
  const left = Math.max(0, currentTarget - currentValue);
  const dateLabel = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "short" });

  const handleRequestReview = (mealId: string) => {
    // TODO: Abrir modal ou enviar para nutricionista
    alert(`Solicitação de revisão enviada para a refeição. A nutricionista ${NUTRITIONIST.name} será notificada.`);
  };

  return (
    <div className="min-h-screen bg-page-dark pb-24 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Nutrição Diária"
          subtitle="Sua dieta e macros do dia"
          titleSize="large"
        />

        <div className="py-4 space-y-5">
          {/* Card progresso — "Come bem há X dias" */}
          <div className="glass-card-3d rounded-2xl p-4 sm:p-5 flex items-center gap-4 border border-white/10">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/70">Olá, {user?.name?.split(" ")[0] || "Atleta"}!</p>
              <p className="text-xl sm:text-2xl font-bold text-primary mt-0.5">
                Come bem há {streakDays} dias
              </p>
            </div>
            <div className="size-14 sm:size-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <ChefHat className="size-7 sm:size-8 text-primary" />
            </div>
          </div>

          {/* Evitar — restrições alimentares */}
          <div>
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Evitar</h3>
            <div className="flex flex-wrap gap-2">
              {DIETARY_RESTRICTIONS.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/10"
                >
                  {r}
                </span>
              ))}
              <button
                type="button"
                className="inline-flex items-center justify-center size-8 rounded-full bg-white/10 border border-white/10 text-white/60 hover:bg-white/15 hover:text-white transition-colors"
                aria-label="Adicionar restrição"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          {/* Nutricionista responsável */}
          <div className="glass-card-3d rounded-2xl p-4 flex items-center gap-3 border border-white/10">
            <img
              src={NUTRITIONIST.avatar}
              alt=""
              className="size-12 rounded-full object-cover border-2 border-primary/30 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-primary/80 uppercase tracking-wider">Nutricionista</p>
              <p className="text-sm font-semibold text-white truncate">{NUTRITIONIST.name}</p>
              <p className="text-[11px] text-white/50">{NUTRITIONIST.crn}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 text-white/70 hover:text-white text-xs"
              onClick={() => {}}
            >
              <MessageCircle className="size-4 mr-1" />
              Contatar
            </Button>
          </div>

          {/* Data + macros compacto */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-base font-bold text-white capitalize">{dateLabel}</p>
            <div className="flex items-center gap-1 rounded-xl bg-white/[0.06] p-1">
              {TAB_CONFIG.slice(1).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                    activeTab === key ? "bg-primary text-[#171512]" : "text-white/60 hover:text-white/90"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Medidor circular */}
          <div className="flex justify-center">
            <div
              className="relative flex size-36 sm:size-40 items-center justify-center rounded-full p-2"
              style={{
                background: `conic-gradient(rgb(213 159 57) 0deg, ${progressPercent * 3.6}deg, rgba(255,255,255,0.08) ${progressPercent * 3.6}deg)`,
              }}
            >
              <div className="flex size-full flex-col items-center justify-center rounded-full bg-page-dark">
                <span className="text-xl sm:text-2xl font-bold tabular-nums text-white">
                  {activeTab === "calories" ? currentValue.toLocaleString("pt-BR") : currentValue}
                </span>
                <span className="text-[10px] text-white/50">{currentUnit}</span>
              </div>
            </div>
          </div>

          {/* Refeições com 3 variações + câmera em cada refeição */}
          <div className="relative">
            <h2 className="text-sm font-bold text-white mb-3">Refeições do dia</h2>
            <div className="space-y-3">
              {(displayMeals as (Meal & { variations?: MealVariation[] })[]).map((meal) => {
                const variations = meal.variations || [{ id: meal.id, name: meal.name, calories: meal.calories, protein: meal.protein, carbs: meal.carbs, fat: meal.fat }];
                const isExpanded = expandedMealId === meal.id;
                return (
                  <div
                    key={meal.id}
                    className="glass-card-3d rounded-2xl overflow-hidden border border-white/10"
                  >
                    <div className="p-4 flex items-center gap-3">
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-between gap-3 text-left min-w-0"
                        onClick={() => setExpandedMealId(isExpanded ? null : meal.id)}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-white">{meal.name}</h3>
                            <span className="text-[10px] text-white/45">{meal.time}</span>
                          </div>
                          <p className="text-[11px] text-primary/80 mt-0.5">
                            {meal.calories} kcal · {variations.length} opções
                          </p>
                        </div>
                        <div className={`shrink-0 flex items-center gap-2 ${meal.completed ? "text-primary" : "text-white/40"}`}>
                          {meal.completed ? <CheckCircle2 className="size-5" /> : null}
                          <span className={`text-xs ${isExpanded ? "rotate-180" : ""} transition-transform`}>▼</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/meal-scan", { state: { mealId: meal.id, mealName: meal.name } });
                        }}
                        className="shrink-0 size-9 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-white/60 hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-colors"
                        aria-label={`Registrar foto do ${meal.name}`}
                        title={`Registrar foto do ${meal.name}`}
                      >
                        <Camera className="size-4" />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 space-y-3 border-t border-white/5">
                        {variations.slice(0, 3).map((v) => (
                          <div
                            key={v.id}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                              selectedVariation[meal.id] === v.id
                                ? "bg-primary/15 border border-primary/30"
                                : "bg-white/[0.04] border border-transparent hover:bg-white/[0.06]"
                            }`}
                            onClick={() => setSelectedVariation((prev) => ({ ...prev, [meal.id]: v.id }))}
                          >
                            <div className="size-10 rounded-lg bg-white/10 shrink-0 flex items-center justify-center">
                              <ChefHat className="size-5 text-primary/70" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-white/90 truncate">{v.name}</p>
                              <p className="text-[11px] text-white/50">{v.calories} kcal · {v.protein}g prot</p>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2 pt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-xs text-white/70 hover:text-white"
                            onClick={() => handleRequestReview(meal.id)}
                          >
                            <RotateCcw className="size-3.5 mr-1" />
                            Solicitar revisão
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs border-primary/30 text-primary/90 hover:bg-primary/10"
                            onClick={() => handleRequestReview(meal.id)}
                          >
                            Substituir
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Galeria de fotos da dieta enviada pelo cliente */}
          <div>
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
              Galeria de fotos da dieta enviada pelo cliente
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <img
                  src={IMAGES.FOOD_1}
                  alt="Dieta 1"
                  className="w-full aspect-square object-cover rounded-xl border border-white/10"
                />
                <img
                  src={IMAGES.FOOD_2}
                  alt="Dieta 2"
                  className="w-full aspect-square object-cover rounded-xl border border-white/10"
                />
                <img
                  src={IMAGES.FOOD_3}
                  alt="Dieta 3"
                  className="w-full aspect-square object-cover rounded-xl border border-white/10"
                />
                <img
                  src={IMAGES.FOOD_4}
                  alt="Dieta 4"
                  className="w-full aspect-square object-cover rounded-xl border border-white/10"
                />
              </div>
              <button
                type="button"
                onClick={() => navigate("/diet/photos")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white/80 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors font-medium text-sm"
              >
                Ver mais
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <FloatingNav items={floatingNavItems} position="bottom-center" />
    </div>
  );
};

export default DailyDiet;

import React, { useState, useRef } from "react";
import { PageHeader } from "@/ui/components/ui/page-header";
import { useNavigate, useLocation } from "react-router-dom";
import { useSparta } from "@/shared/context/SpartaContext";
import { Meal } from "@/shared/types";
import { IMAGES } from "@/shared/constants/images";
import { FloatingNav, type FloatingNavItem } from "@/ui/components/ui/floating-nav";
import { Home, Dumbbell, ChefHat, User, RotateCcw, CheckCircle, ArrowLeft, Camera } from "lucide-react";

// Mock: alternativas após análise (3 variações)
const MOCK_ALTERNATIVES = [
  { id: "alt-1", name: "Abacate Haas", calories: 160, unit: "100g", image: IMAGES.MEAL_PLACEHOLDER },
  { id: "alt-2", name: "Morango Orgânico", calories: 33, unit: "100g", image: IMAGES.MEAL_PLACEHOLDER },
  { id: "alt-3", name: "Tomate Cereja", calories: 18, unit: "100g", image: IMAGES.MEAL_PLACEHOLDER },
];

type MealScanState = { mealId?: string; mealName?: string } | null;

const MealScan: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addMeal, addDietPhoto } = useSparta();
  const mealInfo = (location.state as MealScanState) ?? null;
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ name: string; calories: number; protein: number; carbs: number; fat: number } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const floatingNavItems: FloatingNavItem[] = [
    { icon: <Home />, label: "Início", onClick: () => navigate("/dashboard/student") },
    { icon: <Dumbbell />, label: "Treinos", onClick: () => navigate("/student/workouts") },
    { icon: <ChefHat />, label: "Dieta", onClick: () => navigate("/diet") },
    { icon: <User />, label: "Perfil", onClick: () => navigate("/dashboard/perfil") },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setImagePreview(reader.result as string);
      setAnalyzing(true);
      setResult(null);
      try {
        setTimeout(() => {
          setResult({
            name: "Abacaxi",
            calories: 82,
            protein: 0.9,
            carbs: 22,
            fat: 0.2,
          });
          setAnalyzing(false);
        }, 2000);
      } catch (err) {
        console.error("Analysis failed", err);
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const confirmMeal = () => {
    if (!result) return;
    const newMeal: Meal = {
      id: Math.random().toString(),
      name: result.name,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      completed: true,
    };
    addMeal(newMeal);
    if (imagePreview && mealInfo?.mealId && mealInfo?.mealName) {
      addDietPhoto({
        id: `photo-${Date.now()}`,
        mealId: mealInfo.mealId,
        mealName: mealInfo.mealName,
        imageUrl: imagePreview,
        createdAt: new Date().toISOString(),
      });
    } else if (imagePreview) {
      addDietPhoto({
        id: `photo-${Date.now()}`,
        mealId: newMeal.id,
        mealName: mealInfo?.mealName ?? result.name,
        imageUrl: imagePreview,
        createdAt: new Date().toISOString(),
      });
    }
    navigate("/diet");
  };

  const handleRequestReview = () => {
    alert("Solicitação de revisão enviada ao nutricionista. Você será notificado.");
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-page-dark flex flex-col pb-24">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex-1 flex flex-col">
        <PageHeader
          title={analyzing ? "Analisando..." : mealInfo?.mealName ? `Foto: ${mealInfo.mealName}` : "Registro por Foto"}
          subtitle={analyzing ? "Identificando alimentos" : mealInfo?.mealName ? `Envie foto do seu ${mealInfo.mealName.toLowerCase()}` : "Envie uma foto da sua refeição"}
          leftSlot={
            <button
              onClick={() => navigate("/diet")}
              className="text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="size-5" />
            </button>
          }
        />

        <main className="flex-1 flex flex-col gap-5 pb-6">
          {/* Área de captura */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10">
            {imagePreview ? (
              <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-60"
                style={{ backgroundImage: `url('${IMAGES.MEAL_PLACEHOLDER}')` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
            {analyzing && <div className="scan-line" />}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-4/5 h-4/5 border-2 border-dashed border-white/30 rounded-2xl" />
            </div>

            <div className="absolute bottom-4 left-0 right-0 px-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-primary hover:bg-primary/90 text-[#171512] font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
              >
                <Camera className="size-5" />
                {imagePreview ? "Nova foto" : "Capturar ou escolher foto"}
              </button>
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Resultado da análise */}
          {result && (
            <div className="space-y-5">
              {/* Card do item identificado */}
              <div className="glass-card-3d rounded-2xl p-4 flex items-center gap-4 border border-white/10">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt=""
                    className="size-16 sm:size-20 rounded-xl object-cover shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-white">{result.name}</p>
                  <p className="text-2xl font-bold text-primary">{result.calories} kcal / 100g</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-success/20 border border-success/30">
                  <CheckCircle className="size-4 text-success" />
                  <span className="text-[10px] font-bold text-success uppercase">Analisado</span>
                </div>
              </div>

              {/* Valores nutricionais */}
              <div className="glass-card-3d rounded-2xl p-4 border border-white/10">
                <h3 className="text-sm font-bold text-white mb-3">Valores nutricionais (100g)</h3>
                <div className="space-y-3">
                  {[
                    { label: "Proteína", value: result.protein, color: "bg-primary" },
                    { label: "Gorduras", value: result.fat, color: "bg-amber-500" },
                    { label: "Carboidratos", value: result.carbs, color: "bg-amber-400/80" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/70">{label}</span>
                        <span className="text-white font-medium">{value} g</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{ width: `${Math.min(100, (value / 50) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outras opções (3 variações) */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Outras opções</h3>
                <div className="grid grid-cols-3 gap-2">
                  {MOCK_ALTERNATIVES.map((alt) => (
                    <button
                      key={alt.id}
                      type="button"
                      className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/[0.06] border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-colors"
                    >
                      <div className="size-12 rounded-lg overflow-hidden bg-white/10">
                        <img src={alt.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[10px] font-medium text-white/90 text-center line-clamp-2">
                        {alt.name}
                      </p>
                      <p className="text-[9px] text-primary/80">{alt.calories} kcal</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleRequestReview}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/20 text-white/80 hover:bg-white/5 text-sm font-medium"
                >
                  <RotateCcw className="size-4" />
                  Solicitar revisão
                </button>
                <button
                  type="button"
                  onClick={confirmMeal}
                  className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-[#171512] font-bold hover:bg-primary/90 transition-colors"
                >
                  <CheckCircle className="size-5" />
                  Confirmar registro
                </button>
              </div>
            </div>
          )}

          {!result && !analyzing && (
            <p className="text-center text-sm text-white/50 py-4">
              Tire uma foto da sua refeição para análise automática
            </p>
          )}
        </main>
      </div>

      <FloatingNav items={floatingNavItems} position="bottom-center" />
    </div>
  );
};

export default MealScan;

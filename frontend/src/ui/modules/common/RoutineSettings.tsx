import React, { useState } from 'react';
import { PageHeader } from "@/ui/components/ui/page-header";
import { useNavigate } from 'react-router-dom';
import { useSparta } from '../../../shared/context/SpartaContext';
import { ExperienceLevel } from '../../../shared/types';
import { trainingService } from '../../../shared/services/trainingService';

const RoutineSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useSparta(); 
  const [loading, setLoading] = useState(false);
  // 🔥 NOVO: Estado local para limitações (já que não estava no user global ainda)
  const [limitations, setLimitations] = useState("");

  const handleGenerateProtocol = async () => {
    setLoading(true);
    try {
      // 1. Envia os dados REAIS para o Java
      await trainingService.createRequest({
          level: user.level,
          focus: user.goal, // Vem da tela anterior (GoalSelection)
          daysPerWeek: user.frequency,
          limitations: limitations || "Nenhuma" // Envia o texto digitado
      });

      alert("Solicitação enviada! Seu personal irá analisar.");
      // Depois de pedir, vai para o dashboard (que vai estar vazio ou com status 'Em análise')
      navigate('/dashboard');
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full bg-background-dark flex flex-col items-center justify-center p-8 text-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
        <h2 className="text-xl font-bold uppercase">Enviando ao Personal...</h2>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-background-dark text-white">
      <div className="sticky top-0 z-20 p-4 max-w-4xl mx-auto w-full">
        <PageHeader
          title="Anamnese"
          leftSlot={
            <button onClick={() => navigate(-1)} className="text-white flex items-center justify-center size-10 rounded-full hover:bg-white/5 transition-colors" aria-label="Voltar">
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          }
        />
      </div>
      
      <main className="flex-1 overflow-y-auto pb-24 p-6 space-y-8">
        
        {/* Frequência */}
        <div>
          <h1 className="text-xl font-bold uppercase mb-2">Dias por Semana</h1>
          <p className="text-white/50 text-sm mb-4">Quantos dias você tem disponível?</p>
          <div className="grid grid-cols-6 gap-2">
            {[2,3,4,5,6,7].map(num => (
              <label key={num} className="cursor-pointer group relative">
                <input 
                  type="radio" 
                  name="days" 
                  className="peer sr-only"
                  checked={user.frequency === num}
                  onChange={() => updateUser({ frequency: num })}
                />
                <div className="h-14 rounded bg-surface-dark border border-white/10 peer-checked:border-primary peer-checked:text-primary flex items-center justify-center font-bold text-lg">
                  {num}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Nível */}
        <div>
          <h2 className="text-xl font-bold uppercase mb-4">Nível de Experiência</h2>
          <div className="flex flex-col gap-3">
            {[
              { id: ExperienceLevel.BEGINNER, label: 'Iniciante', icon: 'stat_minus_1', desc: 'Nunca treinei ou parei há muito tempo' },
              { id: ExperienceLevel.INTERMEDIATE, label: 'Intermediário', icon: 'equal', desc: 'Treino regularmente há 6 meses+' },
              { id: ExperienceLevel.ADVANCED, label: 'Avançado', icon: 'stat_1', desc: 'Atleta ou treino intenso há anos' }
            ].map(level => (
              <label key={level.id} className="cursor-pointer relative">
                <input 
                  type="radio" 
                  name="level" 
                  className="peer sr-only"
                  checked={user.level === level.id}
                  onChange={() => updateUser({ level: level.id })}
                />
                <div className="p-4 rounded bg-surface-dark border border-white/10 peer-checked:border-primary peer-checked:bg-primary/5 flex items-center gap-4 transition-all">
                  <span className="material-symbols-outlined text-white/50">{level.icon}</span>
                  <div className="flex flex-col">
                      <span className="font-bold uppercase text-sm">{level.label}</span>
                      <span className="text-xs text-white/40">{level.desc}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 🔥 NOVO CAMPO: Limitações (Crucial para a IA) */}
        <div>
            <h2 className="text-xl font-bold uppercase mb-2">Histórico de Lesões</h2>
            <p className="text-white/50 text-sm mb-2">Possui alguma limitação, dor ou cirurgia?</p>
            <textarea 
                className="w-full bg-surface-dark border border-white/10 rounded-lg p-3 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[100px]"
                placeholder="Ex: Tenho condromalácia no joelho esquerdo, dor no ombro..."
                value={limitations}
                onChange={(e) => setLimitations(e.target.value)}
            />
        </div>

      </main>

      <div className="fixed bottom-0 w-full p-6 bg-background-dark border-t border-white/5">
        <button onClick={handleGenerateProtocol} className="w-full bg-primary text-black font-bold uppercase py-4 rounded-lg">
          Enviar para Análise
        </button>
      </div>
    </div>
  );
};

export default RoutineSettings;
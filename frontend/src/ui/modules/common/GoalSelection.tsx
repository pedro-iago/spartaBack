import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from "@/ui/components/ui/page-header";
// 🔥 CORREÇÃO: Caminho atualizado para a pasta shared
import { useSparta } from '../../../shared/context/SpartaContext';
import { Goal } from '../../../shared/types';
import { IMAGES } from '../../../shared/constants/images';

const GoalSelection: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useSparta();

  const goals = [
    { id: Goal.WEIGHT_LOSS, title: 'Emagrecimento', desc: 'Queima calórica acelerada', img: IMAGES.GOAL_WEIGHT_LOSS },
    { id: Goal.HYPERTROPHY, title: 'Hipertrofia', desc: 'Ganho de massa e força bruta', img: IMAGES.GOAL_HYPERTROPHY },
    { id: Goal.CONDITIONING, title: 'Condicionamento', desc: 'Resistência e saúde funcional', img: IMAGES.GOAL_CONDITIONING }
  ];

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background-dark">
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4 max-w-4xl mx-auto w-full">
        <PageHeader
          title="Qual seu objetivo?"
          titleSize="large"
          leftSlot={
            <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 text-white transition-colors" aria-label="Voltar">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
          }
          className="mb-6 sm:mb-8"
        />
      </div>

      <main className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 pb-24 space-y-4 sm:space-y-5 overflow-y-auto no-scrollbar max-w-4xl mx-auto w-full">
        {goals.map((goal) => (
          <label key={goal.id} className="group relative flex flex-col justify-end h-36 sm:h-40 lg:h-44 w-full rounded-lg cursor-pointer overflow-hidden transition-all duration-300 border-2 border-white/5 bg-surface-dark hover:border-white/20 active:scale-[0.98]">
            <input 
              className="peer sr-only" 
              name="goal" 
              type="radio" 
              value={goal.id} 
              checked={user?.goal === goal.id} 
              onChange={() => updateUser({ goal: goal.id })} 
            />
            <div className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-[50%] transition-all duration-500 scale-100 group-hover:scale-105" style={{backgroundImage: `url('${goal.img}')`}}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90"></div>
            {/* Transição suave entre imagem e texto (semi-transparência, sem corte brusco) */}
            <div
              className="absolute inset-x-0 bottom-0 h-20 pointer-events-none rounded-lg"
              style={{
                background: "linear-gradient(to bottom, transparent 0%, rgba(15, 20, 22, 0.4) 40%, rgba(15, 20, 22, 0.85) 100%)",
              }}
            />
            <div className="absolute inset-0 border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 transition-all rounded-lg z-20 pointer-events-none"></div>
            <div className="relative z-10 p-4 sm:p-5 flex items-end justify-between w-full">
              <div className="flex flex-col gap-1">
                <h3 className="text-white text-lg sm:text-xl font-bold uppercase tracking-tight group-hover:text-primary transition-colors">{goal.title}</h3>
                <p className="text-gray-300 text-xs sm:text-sm font-medium tracking-wide">{goal.desc}</p>
              </div>
              {user?.goal === goal.id && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] text-black font-bold">check</span>
                </div>
              )}
            </div>
          </label>
        ))}
      </main>

      <footer className="absolute bottom-0 left-0 w-full p-4 sm:p-6 bg-background-dark z-30">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/routine')} 
            className="w-full h-12 sm:h-14 bg-primary text-black font-black uppercase tracking-widest rounded-lg text-sm sm:text-base flex items-center justify-center"
          >
          Confirmar Objetivo
          </button>
        </div>
      </footer>
    </div>
  );
};

export default GoalSelection;
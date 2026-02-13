import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSparta } from '../../../shared/context/SpartaContext';
import { PageHeader } from "@/ui/components/ui/page-header";
import { IMAGES } from '../../../shared/constants/images';

const InstructorReview: React.FC = () => {
  const navigate = useNavigate();
  // Busca user do contexto
  const { user } = useSparta();

  if (!user) return <div className="text-white p-4">Carregando...</div>;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#171512]">
      <div className="sticky top-0 z-50 px-4 py-4 max-w-4xl mx-auto w-full">
        <PageHeader
          title="Revisão Técnica"
          leftSlot={
            <button onClick={() => navigate('/dashboard')} className="text-white flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors" aria-label="Voltar">
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
          }
          rightSlot={
            <button className="text-white flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors" aria-label="Mais opções">
              <span className="material-symbols-outlined text-2xl">more_vert</span>
            </button>
          }
        />
      </div>

      <main className="flex-1 overflow-y-auto pb-36 bg-[#171512]">
        <section className="p-4 sm:p-6 lg:p-8 border-b border-border-dark bg-[#171512] max-w-4xl mx-auto">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="relative size-14 sm:size-16 shrink-0 rounded-lg overflow-hidden border border-white/10">
              <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url('${IMAGES.INSTRUCTOR}')`}}></div>
              <div
                className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                style={{
                  background: "linear-gradient(to bottom, transparent 0%, rgba(15, 20, 22, 0.5) 60%, rgba(15, 20, 22, 0.9) 100%)",
                }}
              />
            </div>
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h1 className="text-xl font-bold leading-tight truncate text-white uppercase">{user.name}</h1>
                <span className="bg-[#333] text-[10px] font-bold px-1.5 py-0.5 rounded text-gray-400 border border-white/5 uppercase tracking-wider">{user.level}</span>
              </div>
              <p className="text-primary text-sm font-medium mt-1 uppercase">Foco: {user.goal}</p>
            </div>
          </div>
        </section>

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6 p-3 rounded bg-primary/10 border border-primary/20">
            <span className="material-symbols-outlined text-primary">psychology</span>
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-widest">Análise Biométrica</p>
              <p className="text-white text-sm font-medium">Sugestão de Carga Progressiva detectada.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {user.currentWorkout?.exercises.map((ex, idx) => (
              <article key={ex.id || idx} className="bg-card-dark rounded-lg p-4 border-l-4 border-primary shadow-lg relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4 relative z-10 uppercase">
                  <h3 className="text-lg font-bold text-white tracking-tight">{ex.name}</h3>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold text-center">Séries</label>
                    <input className="w-full bg-input-dark border border-border-dark rounded text-center text-white font-mono text-lg font-bold py-2 chiseled-input" type="number" defaultValue={ex.sets} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold text-center">Reps</label>
                    <input className="w-full bg-input-dark border border-border-dark rounded text-center text-white font-mono text-lg font-bold py-2 chiseled-input" type="text" defaultValue={ex.reps} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold text-center">Kg</label>
                    <input className="w-full bg-input-dark border border-border-dark rounded text-center text-primary font-mono text-lg font-bold py-2 chiseled-input" type="number" defaultValue="60" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold text-center">Desc.</label>
                    <input className="w-full bg-input-dark border border-border-dark rounded text-center text-gray-400 font-mono text-lg font-bold py-2 chiseled-input" type="number" defaultValue="90" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <footer className="absolute bottom-0 w-full bg-[#171512]/95 backdrop-blur-md border-t border-border-dark p-4 z-50">
        <div className="flex flex-col gap-3">
          <button className="w-full flex items-center justify-center gap-2 bg-transparent border border-gray-600 hover:border-white hover:text-white text-gray-400 py-3.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all">
            <span className="material-symbols-outlined text-lg">tune</span>Ajustar Manualmente
          </button>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:brightness-110 text-black py-4 rounded-lg text-base font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(213,159,57,0.3)] transition-all transform active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-xl">verified</span>Aprovar Treino
          </button>
        </div>
      </footer>
    </div>
  );
};

export default InstructorReview;
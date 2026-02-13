import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from "@/ui/components/ui/page-header";

const Subscription: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-dark h-full overflow-y-auto no-scrollbar flex flex-col items-center">
      <div className="w-full max-w-md bg-background-dark min-h-full flex flex-col relative">
        <div className="sticky top-0 z-10 px-4 py-4">
          <PageHeader
            title="Planos"
            leftSlot={
              <button onClick={() => navigate('/dashboard')} className="text-white flex size-10 shrink-0 items-center justify-center rounded-lg hover:bg-white/5 transition-colors" aria-label="Voltar">
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
            }
          />
        </div>

        <main className="flex-1 flex flex-col px-5 pb-8">
          <div className="mb-6 mt-2 text-center">
            <h1 className="text-white text-3xl font-black uppercase leading-tight tracking-tight mb-2">Escolha seu<br/><span className="text-primary">Caminho</span></h1>
            <p className="text-[#b6aea0] text-sm font-light">Comprometa-se com a excelência. Cancele a qualquer momento.</p>
          </div>

          <div className="mb-8">
            <div className="flex h-12 w-full items-center justify-center rounded-lg bg-[#25221d] border border-[#37322a] p-1 shadow-inner">
              <label className="flex cursor-pointer h-full grow items-center justify-center rounded-md transition-all duration-200 bg-[#37322a] shadow-sm">
                <span className="text-xs font-bold tracking-widest uppercase text-white">Mensal</span>
              </label>
              <label className="flex cursor-pointer h-full grow items-center justify-center rounded-md transition-all duration-200 relative">
                <span className="text-xs font-bold tracking-widest uppercase text-[#b6aea0]">Anual</span>
                <span className="absolute -top-2 -right-1 bg-primary text-[#171512] text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">-20%</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="relative flex flex-col gap-4 rounded-lg border-2 border-primary bg-[#25221d] p-6 shadow-chisled-gold z-10 transform scale-[1.02]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-[#171512] text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md">Recomendado</div>
              <div className="flex flex-col gap-1 mt-1">
                <h3 className="text-primary text-sm font-bold tracking-[0.15em] uppercase">Sparta Performance</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-white text-5xl font-black tracking-tighter">R$ 89</span>
                  <span className="text-white text-2xl font-bold">,90</span>
                  <span className="text-[#888] text-sm font-medium">/mês</span>
                </div>
              </div>
              <div className="h-px w-full bg-primary/20"></div>
              <ul className="flex flex-col gap-3">
                <li className="text-sm font-bold flex gap-3 text-white items-center"><span className="material-symbols-outlined text-primary text-[20px] filled">check_circle</span>Treino Personalizado</li>
                <li className="text-sm font-bold flex gap-3 text-white items-center"><span className="material-symbols-outlined text-primary text-[20px] filled">check_circle</span>Acesso Total Sparta AI</li>
                <li className="text-sm font-bold flex gap-3 text-white items-center"><span className="material-symbols-outlined text-primary text-[20px] filled">check_circle</span>Análise de Dieta Avançada</li>
              </ul>
              <button 
                onClick={() => navigate('/dashboard')}
                className="mt-2 w-full rounded-lg h-12 bg-primary hover:bg-yellow-500 text-[#171512] text-sm font-black tracking-wider uppercase shadow-md transition-colors flex items-center justify-center gap-2"
              >
                Assinar Performance <span className="material-symbols-outlined text-[18px]">bolt</span>
              </button>
            </div>

            <div className="relative flex flex-col gap-4 rounded-lg border border-white/10 bg-[#1e1e1e] p-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-white/60 text-sm font-bold tracking-[0.15em] uppercase">Sparta Basic</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-white/60 text-3xl font-black tracking-tighter">R$ 49</span>
                  <span className="text-[#888] text-sm font-medium">/mês</span>
                </div>
              </div>
              <button onClick={() => navigate('/dashboard')} className="mt-2 w-full rounded-lg h-10 border border-white/20 text-white text-xs font-bold tracking-wider uppercase transition-colors">Assinar Basic</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Subscription;
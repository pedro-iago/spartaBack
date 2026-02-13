// src/components/layout/AppLayout.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IMAGES } from '../../shared/constants/images';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // LISTA DE EXCEÇÃO: Telas que NÃO devem mostrar o menu
  const isFullScreen = [
    '/', 
    '/goals', 
    '/routine',
    '/login',     // <--- Adicionado
    '/register',  // <--- Adicionado
    '/welcome'    // <--- Adicionado
  ].includes(location.pathname);

  if (isFullScreen) return <>{children}</>;

  // Componente de Item do Menu (Reutilizável)
  const NavItem = ({ path, icon, label }: { path: string, icon: string, label: string }) => {
    const isActive = location.pathname === path;
    return (
      <button 
        onClick={() => navigate(path)} 
        className={`flex items-center gap-3 p-3 rounded-lg transition-all group w-full ${
          isActive ? 'bg-primary text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
      >
        <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>{icon}</span>
        {/* Label Desktop */}
        <span className="font-bold uppercase tracking-wider text-xs md:text-sm hidden md:block">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen w-full bg-background-dark text-white overflow-hidden">
      
      {/* --- SIDEBAR (Desktop) --- */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#171512] h-full p-6">
        <div className="mb-10 flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-3xl">bolt</span>
            <span className="font-black text-2xl tracking-tighter uppercase text-white">SPARTA <span className="text-primary">AI</span></span>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          {/* MENU DESKTOP */}
          <NavItem path="/dashboard" icon="grid_view" label="Dashboard" />
          <NavItem path="/workout-overview" icon="fitness_center" label="Treinos" />
          <NavItem path="/profile" icon="person" label="Meu Perfil" /> {/* Adicionado Perfil */}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-dark border border-white/5">
                <div className="size-8 rounded-full bg-gray-700 bg-cover border border-white/10" style={{backgroundImage: `url('${IMAGES.AVATAR_PLACEHOLDER}')`}}></div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Atleta</span>
                    <span className="text-[10px] text-primary uppercase">Membro Fundador</span>
                </div>
            </div>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Container com scroll */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-0 md:p-8 w-full max-w-7xl mx-auto pb-24 md:pb-8">
            {children}
        </main>

        {/* --- BOTTOM NAV (Mobile) --- */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1A1A1A]/95 backdrop-blur-md border-t border-white/5 z-50 pb-safe">
            <div className="flex justify-around items-center p-2 h-16">
                {/* Botão Home */}
                <button onClick={() => navigate('/dashboard')} className={`flex flex-col items-center gap-1 w-20 ${location.pathname === '/dashboard' ? 'text-primary' : 'text-gray-500'}`}>
                    <span className="material-symbols-outlined">grid_view</span>
                    <span className="text-[10px] font-bold">Home</span>
                </button>
                
                {/* Botão Central de Destaque para Treino */}
                <button onClick={() => navigate('/workout-overview')} className="relative -top-5 bg-primary text-black rounded-full p-4 shadow-[0_0_15px_rgba(213,159,57,0.4)] border-4 border-background-dark">
                    <span className="material-symbols-outlined text-3xl">fitness_center</span>
                </button>

                {/* Botão Perfil (Substituindo Evolução para facilitar Logout) */}
                <button onClick={() => navigate('/profile')} className={`flex flex-col items-center gap-1 w-20 ${location.pathname === '/profile' ? 'text-primary' : 'text-gray-500'}`}>
                    <span className="material-symbols-outlined">person</span>
                    <span className="text-[10px] font-bold">Perfil</span>
                </button>
            </div>
        </nav>
      </div>
    </div>
  );
};

export default AppLayout;
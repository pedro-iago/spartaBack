import React, { useState } from "react";

export interface FloatingNavItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}

interface FloatingNavProps {
  items: FloatingNavItem[];
  /** Posição do FAB: "bottom-center" | "bottom-right" */
  position?: "bottom-center" | "bottom-right";
  className?: string;
}

const POSITIONS = {
  "bottom-center": "inset-x-0 bottom-0",
  "bottom-right": "inset-x-0 bottom-0",
};

/**
 * Menu circular expansível: FAB central; ao clicar abre/fecha os itens
 * à esquerda e à direita (abre no primeiro clique, fecha no segundo).
 */
export function FloatingNav({ items, position = "bottom-center", className = "" }: FloatingNavProps) {
  const [open, setOpen] = useState(false);

  // Distribui itens: metade à esquerda, metade à direita (ou 1 a mais de um lado)
  const half = Math.floor(items.length / 2);
  const leftItems = items.slice(0, half);
  const rightItems = items.slice(half);

  const leftOffsets = leftItems.length === 1 ? [112] : leftItems.length === 2 ? [150, 75] : [180, 110, 50];
  const rightOffsets = rightItems.length === 1 ? [112] : rightItems.length === 2 ? [75, 150] : [55, 110, 165];

  return (
    <nav
      className={`fixed z-50 flex items-center justify-center pointer-events-none ${POSITIONS[position]} ${className}`}
    >
      <div className="pointer-events-auto relative flex items-center justify-center w-full min-h-[72px] sm:min-h-[80px] py-2 sm:py-2.5 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {/* Fundo de ponta a ponta — surge ao abrir, responsivo */}
        <div
          className={`absolute inset-0 border-t border-white/[0.06] backdrop-blur-md transition-all duration-300 ease-out ${
            open
              ? "opacity-100 bg-black/30 shadow-[0_-2px_20px_rgba(0,0,0,0.2)]"
              : "opacity-0 pointer-events-none bg-black/30"
          }`}
          aria-hidden
        />

        {/* Container central: FAB e itens (centralizados na tela) */}
        <div className="relative z-10 flex items-center justify-center w-full max-w-[380px] h-[64px] sm:h-[72px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-0 h-0">
          {leftItems.map((item, i) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={`absolute left-0 top-0 flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] ${
                open ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{
                transform: open ? `translate(-50%, -50%) translateX(-${leftOffsets[i] ?? 75}px)` : "translate(-50%, -50%)",
              }}
              title={item.label}
            >
              <span className="w-12 h-12 rounded-full bg-white/[0.12] border border-white/10 flex flex-col items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white/[0.18] hover:border-primary/40 [&>svg]:size-5 [&>svg]:text-white/80 [&>svg]:hover:text-primary">
                {item.icon}
              </span>
              <span className="text-[10px] font-semibold text-white/70 text-center mt-1.5 block whitespace-nowrap">{item.label}</span>
            </button>
          ))}

          {/* Botão central (FAB) */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="absolute left-0 top-0 w-14 h-14 sm:w-16 sm:h-16 -translate-x-1/2 -translate-y-1/2 bg-primary text-[#171512] rounded-full flex items-center justify-center shadow-xl transition-all duration-300 z-50 hover:bg-primary/90 hover:scale-110 active:scale-95"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            <svg
              className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-500 ease-in-out ${open ? "rotate-45" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Itens à direita */}
          {rightItems.map((item, i) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={`absolute left-0 top-0 flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] ${
                open ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{
                transform: open ? `translate(-50%, -50%) translateX(${rightOffsets[i] ?? 75}px)` : "translate(-50%, -50%)",
              }}
              title={item.label}
            >
              <span className="w-12 h-12 rounded-full bg-white/[0.12] border border-white/10 flex flex-col items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white/[0.18] hover:border-primary/40 [&>svg]:size-5 [&>svg]:text-white/80 [&>svg]:hover:text-primary">
                {item.icon}
              </span>
              <span className="text-[10px] font-semibold text-white/70 text-center mt-1.5 block whitespace-nowrap">{item.label}</span>
            </button>
          ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

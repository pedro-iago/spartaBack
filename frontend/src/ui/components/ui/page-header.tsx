import * as React from "react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Slot à esquerda (ex: botão voltar) */
  leftSlot?: React.ReactNode;
  /** Slot à direita (ex: ícone seta, botão sair, avatar) */
  rightSlot?: React.ReactNode;
  /** Conteúdo extra abaixo do título (ex: card de sequência) */
  children?: React.ReactNode;
  className?: string;
  /** Título maior (ex: Olá, Atleta!) */
  titleSize?: "default" | "large";
}

/**
 * Header padrão para todas as páginas: fundo charcoal, cantos arredondados, sombra, título em destaque e subtítulo.
 */
export function PageHeader({ title, subtitle, leftSlot, rightSlot, children, className = "", titleSize = "default" }: PageHeaderProps) {
  return (
    <header
      className={`page-header px-4 py-4 sm:px-6 sm:py-5 lg:px-8 flex items-start justify-between gap-3 mb-4 sm:mb-5 ${className}`}
    >
      <div className="min-w-0 flex-1 flex items-start gap-3">
        {leftSlot}
        <div className="min-w-0 flex-1">
          <h1 className={`font-bold text-white tracking-tight truncate ${titleSize === "large" ? "text-2xl sm:text-3xl mb-1" : "text-xl sm:text-2xl"}`}>{title}</h1>
          {subtitle && (
            <p className={`text-white/50 truncate ${titleSize === "large" ? "text-sm sm:text-base" : "text-xs sm:text-sm mt-0.5"}`}>{subtitle}</p>
          )}
          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
      {rightSlot && (
        <div className="shrink-0 flex items-center">{rightSlot}</div>
      )}
    </header>
  );
}

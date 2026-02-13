import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/ui/components/ui/button";
import { PageHeader } from "@/ui/components/ui/page-header";
import { ArrowLeft, Send, Mic, Plus } from "lucide-react";

type MessageRole = "user" | "assistant";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Olá. Sou o assistente da Sparta Fitness AI. Posso ajudar com planejamento de treinos, sugestões de exercícios e dúvidas sobre a plataforma. Como posso ajudar?",
  },
  {
    id: "2",
    role: "user",
    content: "Pode sugerir um treino de pernas para iniciante?",
  },
  {
    id: "3",
    role: "assistant",
    content: "Claro. Para iniciantes, um bom treino de pernas pode incluir agachamento livre (3x12), leg press (3x12), cadeira extensora (3x12) e panturrilha em pé (3x15). Sempre aquecendo antes e respeitando o descanso entre séries. Quer que eu monte isso no seu plano?",
  },
];

export function AIAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: String(prev.length + 1), role: "user", content: text },
    ]);
    setInput("");
  };

  return (
    <div
      className="min-h-screen min-h-[100dvh] bg-page-dark flex flex-col relative overflow-hidden ai-aura-bg"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Foto de fundo — mantida */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        aria-hidden
      >
        <img
          src="/icon2.png"
          alt=""
          className="w-[min(120vmin,720px)] h-auto object-contain opacity-[0.06] select-none"
        />
      </div>

      {/* Orbe central — energia/consciência IA */}
      <div className="ai-orbe-central z-[1]" aria-hidden />

      {/* Container principal */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col flex-1 px-4 py-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 sm:py-0 min-w-0">
        <div className="ai-panel-aura backdrop-blur-xl flex flex-col flex-1 min-h-0 rounded-3xl overflow-hidden px-3 py-3 sm:px-5 md:px-6 sm:py-4">
          <PageHeader
            title="Sparta Fitness AI"
            subtitle="Assistente"
            leftSlot={
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200 touch-manipulation"
                aria-label="Voltar"
              >
                <ArrowLeft className="size-5" />
              </button>
            }
          />

          {/* Área de mensagens */}
          <main
            className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 space-y-4 sm:space-y-5 pb-4 sm:pb-5 overscroll-contain"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {messages.map((msg) =>
              msg.role === "assistant" ? (
                <div key={msg.id} className="flex gap-3 justify-start">
                  <div className="ai-orbe-bubble shrink-0 mt-2" aria-hidden />
                  <div className="ai-message-assistant rounded-2xl rounded-tl-md px-4 py-3 sm:px-5 sm:py-4 max-w-[90%] sm:max-w-[85%] min-w-0">
                    <p className="text-[15px] sm:text-base text-white/90 leading-[1.6] sm:leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex justify-end">
                  <div className="ai-message-user rounded-2xl rounded-tr-md px-4 py-3 sm:px-5 sm:py-4 max-w-[90%] sm:max-w-[85%] min-w-0">
                    <p className="text-[15px] sm:text-base text-white/95 leading-[1.6] sm:leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              )
            )}
          </main>

          {/* Input — barra única estilo Aura */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 shrink-0 py-2"
          >
            <button
              type="button"
              className="shrink-0 size-10 rounded-full flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/5 transition-all touch-manipulation"
              aria-label="Anexar"
            >
              <Plus className="size-5" />
            </button>
            <div className="flex-1 min-w-0 ai-input-aura flex items-center gap-2 px-4 py-2.5 sm:py-3 transition-all duration-300">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 min-w-0 bg-transparent border-0 text-white placeholder:text-white/35 text-[15px] sm:text-base focus:outline-none focus:ring-0 touch-manipulation"
                aria-label="Mensagem"
                autoComplete="off"
              />
              <button
                type="button"
                className="shrink-0 size-9 rounded-full flex items-center justify-center text-white/40 hover:text-primary hover:bg-primary/10 transition-all touch-manipulation"
                aria-label="Entrada por voz"
              >
                <Mic className="size-5" />
              </button>
            </div>
            <Button
              type="submit"
              size="icon"
              className="shrink-0 size-12 rounded-full min-h-[48px] min-w-[48px] bg-primary hover:bg-primary/90 border-0 text-[#171512] font-semibold shadow-[0_0_24px_rgba(213,159,57,0.35)] transition-all duration-200 active:scale-95 touch-manipulation"
              aria-label="Enviar"
            >
              <Send className="size-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

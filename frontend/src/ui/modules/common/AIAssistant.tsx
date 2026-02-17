import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/ui/components/ui/button";
import { PageHeader } from "@/ui/components/ui/page-header";
import { assistantService } from "@/shared/services/assistantService";
import { ArrowLeft, Send, Mic, Plus, Loader2 } from "lucide-react";

type MessageRole = "user" | "assistant";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  loading?: boolean;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Olá. Sou o assistente de treinos da Sparta. Diga o grupo muscular (pernas, costas, peito) ou objetivo (emagrecer, hipertrofia) e eu sugiro um treino.",
};

export function AIAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const history = [
      ...messages.filter((m) => !m.loading).map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: text },
    ];

    const loadingId = `load-${Date.now()}`;
    setMessages((prev) => [...prev, { id: loadingId, role: "assistant", content: "", loading: true }]);

    try {
      const res = await assistantService.chat({ message: text, history });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { ...m, content: res.content, loading: false }
            : m
        )
      );
    } catch (err: unknown) {
      const errMsg = err && typeof err === "object" && "message" in err
        ? String((err as { message: unknown }).message)
        : "Não foi possível obter resposta. Tente de novo.";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { ...m, content: errMsg, loading: false }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
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
                    {msg.loading ? (
                      <p className="text-[15px] sm:text-base text-white/70 flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin shrink-0" />
                        Pensando...
                      </p>
                    ) : (
                      <p className="text-[15px] sm:text-base text-white/90 leading-[1.6] sm:leading-relaxed">
                        {msg.content}
                      </p>
                    )}
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
            <div ref={listEndRef} />
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
                placeholder="Ex: treino de pernas, costas, emagrecer..."
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
              disabled={loading}
              className="shrink-0 size-12 rounded-full min-h-[48px] min-w-[48px] bg-primary hover:bg-primary/90 border-0 text-[#171512] font-semibold shadow-[0_0_24px_rgba(213,159,57,0.35)] transition-all duration-200 active:scale-95 touch-manipulation disabled:opacity-70"
              aria-label="Enviar"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

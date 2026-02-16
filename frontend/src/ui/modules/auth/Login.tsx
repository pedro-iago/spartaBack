import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importante para redirecionar
import { Button } from "@/ui/components/ui/button";
import { ArrowLeft, Zap, Loader2 } from "lucide-react";
import { authService } from "@/shared/services/authService";
import { useSparta } from "@/shared/context/SpartaContext";

export function Login() {
  const navigate = useNavigate();
  const { updateUser } = useSparta();
  
  // Estado visual
  const [step, setStep] = useState<"welcome" | "login">("welcome");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estado do formulário
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Limpa erro ao digitar
  };

  const handleRealLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Chamada real ao Backend Java (retorna { name, role, token })
      const response = await authService.login(formData.email, formData.password);
      
      const { token, name, role } = response;
      const user = { name, email: formData.email, role: role as 'ADMIN' | 'PROFESSIONAL' | 'STUDENT' };

      // 2. Salva Token e Usuário
      localStorage.setItem('@sparta:token', token);
      localStorage.setItem('@sparta:user', JSON.stringify(user));

      // 3. Atualiza Contexto Global
      updateUser({
        ...user,
        isAuthenticated: true
      });

      // 4. Roteamento por role
      switch (role) {
        case 'ADMIN':
          navigate('/dashboard/admin');
          break;
        case 'PROFESSIONAL':
          navigate('/dashboard/professional');
          break;
        case 'STUDENT':
        default:
          navigate('/dashboard/student');
          break;
      }

    } catch (err: any) {
      console.error("Erro no login:", err);
      setError("Credenciais inválidas ou erro no servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page-dark flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0" aria-hidden>
        <img src="/icon2.png" alt="" className="w-[min(120vmin,720px)] h-auto object-contain opacity-[0.07] select-none" />
      </div>

      <div
        className={`relative z-10 w-full mx-auto flex flex-col items-stretch px-2 sm:px-4 max-w-lg`}
        style={{ perspective: "1200px" }}
      >
        <div
          className={`glass-card-3d rounded-3xl flex flex-col items-center text-center transition-all duration-500 ease-out p-6 sm:p-8 lg:p-10`}
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateY(-2deg) translateZ(24px)",
            boxShadow: "0 1px 0 0 rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.2), 0 24px 56px -12px rgba(0,0,0,0.4)",
          }}
        >
          {/* TELA DE BOAS VINDAS (Passo 1) */}
          {step === "welcome" && (
            <>
              <img src="/icon2.png" alt="Sparta Fitness AI" className="mb-4 h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-lg" />
              <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                Sparta <span className="text-primary/90">Fitness AI</span>
              </h1>
              <h2 className="mt-6 text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight tracking-tight max-w-md">
                Otimize seu treino com inteligência
              </h2>
              <div className="mt-8 sm:mt-10 w-full max-w-xs space-y-3">
                <Button size="lg" className="w-full rounded-xl h-12 sm:h-14 text-base font-semibold uppercase" onClick={() => setStep("login")}>
                  Acessar Conta
                </Button>
                <button
                  type="button"
                  className="w-full h-12 sm:h-14 rounded-xl border border-white/25 bg-transparent text-white font-medium text-sm hover:bg-white/10 transition-colors uppercase"
                  onClick={() => navigate('/register')} // Redireciona para registro
                >
                  Criar Nova Conta
                </button>
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-6 text-xs text-white/45">
                <Zap className="size-3.5 text-primary/70" />
                <span>Powered by Artificial Intelligence</span>
              </div>
            </>
          )}

          {/* TELA DE LOGIN REAL (Passo 2) */}
          {step === "login" && (
            <div className="w-full">
               <div className="flex items-center justify-start w-full mb-6">
                <button
                  type="button"
                  onClick={() => setStep("welcome")}
                  className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="size-4" /> Voltar
                </button>
              </div>

              <h2 className="text-2xl font-semibold text-white mb-2">Login</h2>
              <p className="text-white/55 text-sm mb-6">Digite suas credenciais para continuar</p>

              <form onSubmit={handleRealLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    onChange={handleChange}
                    value={formData.email}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">Senha</label>
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    onChange={handleChange}
                    value={formData.password}
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full rounded-xl h-12 mt-4 text-base font-semibold uppercase"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin size-5" /> : 'Entrar'}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
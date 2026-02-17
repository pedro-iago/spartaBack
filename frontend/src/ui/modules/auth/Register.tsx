import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Zap } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { authService } from "@/shared/services/authService";
import { useSparta } from "@/shared/context/SpartaContext";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser } = useSparta();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    try {
      setLoading(true);

      // 1. Cria a conta no Backend
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "STUDENT",
      });

      // 2. 🔥 AUTO-LOGIN (A Mágica acontece aqui)
      // Usamos as mesmas credenciais para pegar o token imediatamente
      const loginData = await authService.login(
        formData.email,
        formData.password,
      );

      // 3. Salva no Storage e Atualiza o Contexto
      localStorage.setItem("@sparta:token", loginData.token);
      localStorage.setItem(
        "@sparta:user",
        JSON.stringify({
          name: loginData.name,
          role: loginData.role,
          email: loginData.email,
        }),
      );

      updateUser({
        name: loginData.name,
        role: loginData.role,
        email: loginData.email,
        isAuthenticated: true,
      });

      // 4. Redireciona para o início da Anamnese (Objetivos)
      navigate("/goal");
    } catch (error) {
      console.error(error);
      setError("Erro ao criar conta. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page-dark flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Logo */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        aria-hidden
      >
        <img
          src="/icon2.png"
          alt=""
          className="w-[min(120vmin,720px)] h-auto object-contain opacity-[0.07] select-none"
        />
      </div>

      <div
        className="relative z-10 w-full mx-auto flex flex-col items-stretch px-2 sm:px-4 max-w-lg"
        style={{ perspective: "1200px" }}
      >
        <div
          className="glass-card-3d rounded-3xl flex flex-col text-left transition-all duration-500 ease-out p-6 sm:p-8 lg:p-10"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateY(-2deg) translateZ(24px)",
            boxShadow:
              "0 1px 0 0 rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.2), 0 24px 56px -12px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft className="size-4" /> Voltar
            </button>
            <div className="flex items-center gap-1.5 text-xs text-white/45">
              <Zap className="size-3.5 text-primary/70" />
              <span>Sparta Fitness AI</span>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white leading-tight tracking-tight">
              Criar nova conta
            </h1>
            <p className="text-white/60 text-sm mt-2">
              Preencha seus dados para começar a usar a IA no seu treino.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">
                Nome completo
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="Seu nome"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder:text-white/25 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                onChange={handleChange}
                value={formData.name}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder:text-white/25 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                onChange={handleChange}
                value={formData.email}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">
                  Senha
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder:text-white/25 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                  onChange={handleChange}
                  value={formData.password}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">
                  Confirmar senha
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder:text-white/25 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl h-12 mt-2 text-base font-semibold uppercase"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin size-5" /> : "Criar conta"}
            </Button>

            <p className="mt-4 text-center text-xs text-white/50">
              Ao continuar, você concorda com os termos de uso da plataforma Sparta.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

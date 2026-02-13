import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../shared/services/authService';
// 🔥 Importamos o contexto para poder logar o usuário automaticamente
import { useSparta } from '../../../shared/context/SpartaContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser } = useSparta(); // Hook para atualizar o estado global
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Senhas não conferem");
      return;
    }

    try {
      setLoading(true);
      
      // 1. Cria a conta no Backend
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'STUDENT'
      });

      // 2. 🔥 AUTO-LOGIN (A Mágica acontece aqui)
      // Usamos as mesmas credenciais para pegar o token imediatamente
      const loginData = await authService.login(formData.email, formData.password);

      // 3. Salva no Storage e Atualiza o Contexto
      localStorage.setItem('@sparta:token', loginData.token);
      localStorage.setItem('@sparta:user', JSON.stringify({ 
        name: loginData.name, 
        role: loginData.role,
        email: loginData.email 
      }));

      updateUser({
        name: loginData.name,
        role: loginData.role,
        email: loginData.email,
        isAuthenticated: true
      });

      // 4. Redireciona para o início da Anamnese (Objetivos)
      navigate('/goals');

    } catch (error) {
      console.error(error);
      alert("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-white uppercase">
          Criar Conta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium leading-6 text-white">Nome Completo</label>
            <div className="mt-2">
              <input
                name="name"
                type="text"
                required
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-primary sm:text-sm sm:leading-6"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-white">Email</label>
            <div className="mt-2">
              <input
                name="email"
                type="email"
                required
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-primary sm:text-sm sm:leading-6"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-white">Senha</label>
            <div className="mt-2">
              <input
                name="password"
                type="password"
                required
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-primary sm:text-sm sm:leading-6"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-white">Confirmar Senha</label>
            <div className="mt-2">
              <input
                name="confirmPassword"
                type="password"
                required
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-primary sm:text-sm sm:leading-6"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-bold leading-6 text-black shadow-sm hover:bg-primary/80 disabled:opacity-50 uppercase tracking-wide"
            >
              {loading ? 'CRIANDO...' : 'CRIAR CONTA'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          Já tem conta?{' '}
          <Link to="/login" className="font-semibold leading-6 text-primary hover:text-primary/80">
            Fazer Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
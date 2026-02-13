# Sparta Fitness AI - Frontend

Interface web do projeto Sparta Fitness AI (React + Vite + TypeScript). Perfis: Aluno, Personal Trainer e Administrador.

## Desenvolvimento

- **React 19** + **Vite 6** + **TypeScript 5.8**: SPA com build e HMR via Vite.
- **React Router 7** (HashRouter): rotas por perfil (Aluno, Personal, Admin) e rotas protegidas.
- **Radix UI** + **Tailwind**: componentes acessíveis e estilização utilitária; ícones com Lucide React.
- **Axios**: cliente HTTP único (`apiClient`) com interceptors para token JWT e tratamento de 401/403.
- **Context API** (SpartaContext): estado global (usuário, refeições, fotos de dieta) e ações.
- **Serviços** (`authService`, `trainingService`): chamadas à API; tipos e DTOs em `shared/types`.
- Layout responsivo e áreas de toque adequadas para uso em mobile (navegação inferior FloatingNav).


## Upgrad futuro

- Migrar o frontend para **React Native**, mantendo a mesma API e lógica de negócio, com aplicativo nativo para iOS e Android.

---

Documentação geral do projeto: `Documentation.md` na raiz do repositório.

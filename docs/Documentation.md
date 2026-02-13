# Documentação Técnica - Sparta Fitness AI

---

## Para clientes e stakeholders

O **Sparta Fitness AI** é uma plataforma que une treino, alimentação e acompanhamento profissional em um único lugar. O sistema atende três perfis de uso:

**Alunos** acompanham o plano de treinos da semana, iniciam e registram os treinos (pesos e repetições) pelo celular, consultam a dieta do dia e podem registrar fotos das refeições. O perfil e o histórico de treinos ficam centralizados na própria conta.

**Personal trainers** têm visão dos seus alunos, podem revisar e ajustar treinos e usam um assistente com inteligência artificial para apoio no dia a dia. A geração de treinos é feita pela plataforma com base no nível do aluno, objetivo (perda de peso, hipertrofia ou condicionamento), dias disponíveis e informações de saúde (lesões e condições médicas), priorizando segurança e exercícios adequados ao catálogo da academia.

**Administradores** acessam o painel geral, relatórios com métricas de uso e exportação em PDF/CSV, gestão de usuários e configurações do sistema.

A plataforma foi pensada para uso no celular (botões e áreas de toque adequados) e em desktop, com login por perfil (Aluno, Personal ou Administrador) e navegação simples por menu. A infraestrutura utiliza banco de dados dedicado e fluxos de automação para gerar treinos personalizados com IA, mantendo consistência e rastreabilidade.


---

## 1. Visão geral

Sistema de gestão de treinos e dieta com perfis Aluno, Personal Trainer e Administrador. Inclui geração de treinos via IA (n8n + Gemini), plano semanal, execução de treino em tempo real, dieta com fotos e assistente de chat para profissionais. O frontend consome uma API REST (Spring Boot) e a infraestrutura é orquestrada com Docker.

---

## 2. Stack tecnológica

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 19, Vite 6, TypeScript 5.8, React Router 7, Axios |
| UI | Radix UI, Tailwind (classes utilitárias), Lucide React, Recharts |
| Backend (externo) | Spring Boot (Java), API REST em `localhost:8080` |
| Banco de dados | PostgreSQL 15 (Alpine) |
| Automação / IA | n8n (workflows), Google Gemini (geração de treinos) |
| Ferramentas | PgAdmin 4 (porta 5050), Docker Compose |

Variáveis de ambiente do frontend: `VITE_API_URL` (base da API; padrão `http://localhost:8080`).

---

## 3. Arquitetura

Explicação detalhada da estrutura e das decisões arquiteturais (por que monólito modular, frontend por domínio, IA desacoplada, estratégia mobile): **docs/architecture.md**.

Visão resumida:

```
spartaBack/
  frontend/          # SPA React (Vite), modular por domínio (student, professional, admin, common)
  infra/             # Docker Compose (PostgreSQL, PgAdmin, n8n)
  docs/              # Visão, arquitetura, decisões
```

- **Frontend:** SPA em HashRouter; autenticação via JWT em `localStorage` (`@sparta:token`, `@sparta:user`). Cliente HTTP centralizado em `apiClient` (Axios) com interceptors para token e tratamento de 401/403.
- **Backend:** Não versionado neste repositório; referenciado como Spring Boot na porta 8080. Endpoints esperados: `/auth/login`, `/auth/register`, `/trainings`, `/student/workout-plan`, `/exercises/catalog`, entre outros.
- **Infra:** Serviços em `infra/docker-compose.yml`; volumes persistentes para PostgreSQL e n8n.

---

## 4. Backend (contrato da API)

A documentação assume um backend Spring Boot. Endpoints utilizados pelo frontend:

| Método | Endpoint | Uso |
|--------|----------|-----|
| POST | `/auth/login` | Login; corpo: `{ email, password }`; retorno: `{ token, user }`. |
| POST | `/auth/register` | Registro; corpo: `RegisterDTO` (name, email, password, role opcional). |
| POST | `/trainings` | Criação de solicitação de treino; corpo: `CreateTrainingDTO` (level, focus, daysPerWeek, limitations). |
| GET | `/student/workout-plan` | Plano semanal do aluno; retorno: `{ scheduledWorkouts: ScheduledWorkout[] }`. |

Autenticação: header `Authorization: Bearer <token>`.

Tipos principais (espelho no frontend): `LoginResponseDTO`, `User`, `UserRole` (ADMIN, PROFESSIONAL, STUDENT), `CreateTrainingDTO`, `ScheduledWorkout`, `StudentWorkoutPlanResponse`.

---

## 5. Frontend – Estrutura

### 5.1 Diretórios principais

- `src/ui/modules/auth` – Login e Registro.
- `src/ui/modules/student` – Dashboard, treinos, dieta, perfil, histórico (aluno).
- `src/ui/modules/professional` – Dashboard do personal, alunos, IA Assistente.
- `src/ui/modules/admin` – Dashboard, relatórios, usuários, configurações.
- `src/ui/modules/common` – Perfil comum, IA Assistente, seleção de objetivo, rotina.
- `src/ui/layouts` – Layout da aplicação.
- `src/ui/components/ui` – Componentes de UI (Radix + Tailwind).
- `src/shared/api` – Cliente HTTP (`apiClient`).
- `src/shared/services` – `authService`, `trainingService`.
- `src/shared/context` – `SpartaContext` (estado global: user, meals, dietPhotos e ações).
- `src/shared/hooks` – `useAuthLogic`, `useStudentWorkoutPlan`, etc.
- `src/shared/types` – Enums e interfaces (UserRole, Goal, Exercise, Workout, DTOs de auth e treino).

### 5.2 Rotas e perfis

- **Público:** `/`, `/login` (redirecionamento e login).
- **Aluno (STUDENT):** `/dashboard/student`, `/student/workouts`, `/student/workout`, `/workout-overview`, `/active-workout`, `/diet`, `/meal-scan`, `/diet/photos`, `/dashboard/perfil`, `/dashboard/perfil/historico`, `/student/profile`.
- **Profissional (PROFESSIONAL):** `/dashboard/professional`, `/dashboard/professional/students`, `/assistant`.
- **Admin (ADMIN):** `/dashboard/admin`, `/admin/reports`, `/admin/users`, `/admin/settings`.

Proteção: componente `PrivateRoute` verifica `localStorage @sparta:user` e `role`; em caso de falha redireciona para `/login`.

### 5.3 Estado global (SpartaContext)

- **user:** nome, role, autenticação, objetivo (Goal), frequência, nível (ExperienceLevel), treino atual, histórico, avatar, plano, bio (bioimpedância).
- **meals / dietPhotos:** listas de refeições e fotos de dieta; dietPhotos persistidas em `localStorage` (`@sparta:diet-photos`).
- **Ações:** `updateUser`, `addMeal`, `addDietPhoto`, `toggleMeal`, `completeWorkout`, `swapExercise`.

---

## 6. Infraestrutura (Docker)

Arquivo: `infra/docker-compose.yml`.

| Serviço | Imagem | Porta | Descrição |
|---------|--------|-------|-----------|
| db | postgres:15-alpine | 5432 | Banco PostgreSQL; user/password/db: admin/admin/sparta. Volume: sparta_data. |
| pgadmin | dpage/pgadmin4 | 5050 | Interface web; login: admin@sparta.com / admin. |
| n8n | n8nio/n8n:latest | 5678 | Automação e workflow de IA; volume: n8n_data. Variáveis: N8N_HOST, N8N_PORT, WEBHOOK_URL, N8N_SECURE_COOKIE. |

Comando típico: `docker-compose -f infra/docker-compose.yml up -d` (executar a partir do diretório do projeto).

---

## 7. Geração de treinos com IA (n8n)

Workflow referência: `infra/AI Training Generator.json`.

- **Entrada:** Webhook POST em `/training-generator` com corpo contendo dados do aluno (userName, age, weight, level, focus, daysPerWeek, injuries, medicalConditions, trainingId, limitations).
- **Fluxo resumido:** Recepção do webhook; requisição ao catálogo de exercícios (HTTP para backend, ex.: `http://192.168.1.16:8080/exercises/catalog`); construção de prompt (Code node “Build Prompt”) com contexto do aluno, lesões e condições médicas; chamada ao Google Gemini; pós-processamento e envio da resposta ao backend (“Send to Backend”).
- **Regras no prompt:** Uso exclusivo de exercícios do catálogo (por UUID), protocolo de séries por nível (iniciante/intermediário/avançado), orientações de descanso e segurança para lesões. Saída em JSON (planName, description, workouts com dayLetter, name, muscleGroups, exercises com exerciseId, order, sets, reps, restSeconds, etc.).

---

## 8. Módulos de negócio (resumo)

- **Auth:** Login em duas etapas (boas-vindas + escolha de perfil); registro via backend; armazenamento de token e user no localStorage.
- **Aluno:** Dashboard, lista de treinos da semana (hook `useStudentWorkoutPlan`; mock ativável por `USE_MOCK`), visão do treino (WorkoutOverview), execução (ActiveWorkout) com registro de cargas/séries, dieta diária, scan de refeição, galeria de fotos da dieta, perfil e histórico de treinos.
- **Personal:** Dashboard, lista de alunos, tela de revisão (InstructorReview), assistente de IA (chat; frontend apenas, sem backend específico documentado).
- **Admin:** Dashboard, relatórios (métricas e exportação PDF/CSV), gestão de usuários, configurações.
- **Comum:** Perfil (objetivo, nível, frequência, logout), seleção de objetivo (Goal), configurações de rotina (integração com backend Java), IA Assistente.

---

## 9. Desenvolvimento

### 9.1 Frontend

- **Requisitos:** Node.js compatível com Vite 6 e React 19.
- **Instalação:** `cd frontend && npm install`.
- **Execução:** `npm run dev` (servidor em `http://localhost:3000`, host exposto).
- **Build:** `npm run build`; preview: `npm run preview`.
- **Configuração:** `frontend/vite.config.ts` – alias `@` para `./src`, dedupe de React, porta 3000.

### 9.2 Integração com backend

- Definir `VITE_API_URL` (ou usar padrão `http://localhost:8080`) para apontar ao Spring Boot.
- Em `useStudentWorkoutPlan.ts`, definir `USE_MOCK = false` quando o endpoint `/student/workout-plan` estiver disponível.

### 9.3 Histórico de alterações (referência)

- `frontend/doc/09-02.md` – Login em duas etapas, FloatingNav para aluno.
- `frontend/doc/10-02.md` – WorkoutOverview, ActiveWorkout, AdminReports, AIAssistant, dashboard do personal.
- `frontend/doc/11-02.md` – WorkoutOverview (CTA fixo, acessibilidade), ActiveWorkout (stepper de cargas, ícone de descanso), Profile comum (PageHeader, objetivo em PT-BR, logout).

---

## 10. Convenções e boas práticas

- **Tipos:** Centralizados em `src/shared/types`; uso de enums para roles, objetivos e nível de experiência.
- **Chamadas HTTP:** Sempre via `apiClient`; serviços em `src/shared/services`.
- **Autenticação:** Token e user em localStorage; interceptors do Axios injetam o Bearer e tratam 401/403.
- **Navegação aluno/personal/admin:** FloatingNav com itens por perfil; rotas protegidas por `PrivateRoute` e role.
- **UI:** Padrão de áreas de toque mínimas (44px) em botões críticos; uso de `safe-area` no rodapé quando aplicável.

---

**Projeto:** Sparta Fitness AI  
**Desenvolvedores:** Pedro  Hiago e Bianca Alves
**Última atualização:** Fevereiro 2025
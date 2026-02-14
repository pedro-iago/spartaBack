# Arquitetura e estrutura do Sparta App

Este documento explica como o Sparta App está organizado e por que as decisões foram tomadas dessa forma.

---

## O que é o Sparta App

O Sparta App é um SaaS do segmento fitness que conecta em uma única plataforma:

- Alunos
- Profissionais (personal trainers, professores)
- Administradores de academias
- (Futuro) Lojistas e parceiros

Objetivo: unificar experiência física e digital da academia, usando tecnologia e IA para treinos, dietas, gestão e comunicação. O produto foi pensado para escala, modularidade e evolução contínua.

---

## Decisões de arquitetura e motivos

### Backend (Java / Spring Boot)

- **Modelo:** Monólito modular (não microserviços desde o início).
- **Estilo:** Semi-hexagonal: domínio no centro, adaptadores de entrada (HTTP) e saída (banco, APIs, IA) nas bordas.

**Por quê:**

- Evitar overengineering no início: um único deploy, um banco, menos operação.
- Separação clara de responsabilidades e domínio desacoplado da infraestrutura facilita testes e manutenção.
- Módulos bem delimitados permitem, no futuro, extrair partes para microserviços sem refatoração caótica.
- Decisão estratégica: começar simples, mantendo o sistema preparado para crescer.

O backend pode estar em repositório separado; neste repositório (spartaBack) estão documentados o contrato da API e a expectativa de endpoints.

### Frontend (React / Vite)

- **Modelo:** Uma SPA (aplicação única) com organização **modular por domínio**.
- **Experiências:** Aluno, Profissional e Administrador convivem na mesma app; o que muda é a rota e o perfil (role) do usuário.

**Por quê:**

- Uma única codebase para web reduz duplicação e custo de manutenção no estágio atual.
- Organizar por domínio (pastas `student`, `professional`, `admin`, `common`, `auth`) em vez de por “tipo de arquivo” ou por página:
  - Facilita localizar tudo que é do aluno ou do admin.
  - Reduz risco de um time alterar o fluxo do outro sem necessidade.
  - Permite evoluir ou até extrair um domínio para outro app no futuro.
- Camada **shared** (types, services, api, hooks, context): lógica e contratos centralizados, reutilizáveis por qualquer módulo e, depois, pelo app mobile.

### Estrutura atual (backend e frontend)

**Backend (Java / Spring Boot)** – pode estar neste repositório em `backend/` ou em repositório separado; a organização é a mesma:

```
backend/
  src/main/java/com/sparta/
    core/               # Domínio puro (entidades, regras de negócio)
    application/        # Casos de uso (orquestração)
    adapters/
      inbound/          # Controllers HTTP (REST)
      outbound/         # Persistência (DB), APIs externas, integração com IA
    config/             # Configuração da aplicação
  src/test/
```

**Frontend (React / Vite)** – neste repositório em `frontend/`:

```
frontend/
  src/
    ui/
      modules/          # Por domínio (e por papel na aplicação)
        auth/           # Login, registro
        student/        # Telas do aluno (dashboard, treinos, dieta, perfil, histórico)
        professional/   # Telas do personal (dashboard, alunos, revisão)
        admin/          # Telas do administrador (dashboard, relatórios, usuários, configurações)
        common/         # Telas compartilhadas (perfil, objetivo, rotina, assistente IA)
      layouts/          # Layout global da aplicação
      components/ui/    # Componentes genéricos (botões, cards, formulários, etc.)
    shared/             # Código independente de tela
      api/              # Cliente HTTP (axios), interceptors
      services/         # Chamadas à API (auth, treinos)
      types/            # Tipos, enums, DTOs
      context/          # Estado global (usuário, refeições, fotos)
      hooks/            # Lógica reutilizável (auth, plano de treinos)
  doc/                  # Registro de alterações por data
```

**Por que essa árvore (backend):** `core` mantém o domínio livre de detalhes de HTTP ou banco; `application` implementa os casos de uso; `adapters` isolam entradas (controllers) e saídas (DB, IA). Facilita testes e futura extração de módulos.

**Por que essa árvore (frontend):**

- **modules por domínio:** Cada perfil (aluno, profissional, admin) tem seu conjunto de telas agrupado; `common` concentra o que é compartilhado entre perfis. Isso evita acoplamento entre domínios e facilita onboarding e manutenção.
- **shared separado da UI:** Tipos, serviços e hooks não dependem de React components específicos; podem ser reutilizados na web e no futuro no React Native, sem duplicar regras de negócio.
- **components/ui genéricos:** Evita repetição de padrões (formulários, navegação, cards) e mantém consistência visual.

### Infraestrutura (Docker)

- **Conteúdo:** PostgreSQL, PgAdmin, n8n (workflows).
- **Local:** Pasta `infra/` com `docker-compose.yml` e definição de volumes.

**Por quê:**

- Ambiente reproduzível para desenvolvimento e testes.
- n8n fora do core da aplicação: IA e automação evoluem sem alterar backend ou frontend; no futuro a IA pode virar um serviço separado.

### IA (n8n + Gemini)

- **Papel:** Geração de treinos, com possível extensão para sugestões de dieta e insights.
- **Integração:** Backend chama ou é chamado por workflows n8n (webhooks, HTTP); o frontend não fala diretamente com a IA.

**Por quê:**

- IA tratada como componente externo: troca de modelo ou provedor sem reescrever o núcleo do sistema.
- Workflows visuais (n8n) permitem ajustes por perfis não necessariamente desenvolvedores e facilitam evolução da lógica de prompt e pós-processamento.

---

## Estrutura alvo (monorepo) e evolução

A visão de longo prazo é um monorepo com:

- **docs/** – Visão, arquitetura, fluxo de trabalho, convenções, decisões (ADRs).
- **backend/** – Código Spring Boot (core, application, adapters inbound/outbound, config).
- **frontend/** – Pode evoluir para múltiplas apps (ex.: web-admin, web-professional, web-student) e pacotes compartilhados (ui, hooks, services, types); hoje é uma SPA única com módulos por domínio, o que já segue o mesmo princípio de desacoplamento.
- **mobile/** – App React Native (futuro), reutilizando lógica de `shared` (services, types, regras).
- **infra/** – Docker, nginx, CI/CD.

No repositório atual (spartaBack), a estrutura já reflete esses princípios no frontend e na infra; o backend pode estar em outro repositório, com a API documentada aqui.

**Benefícios dessa direção:**

- Suporte natural a web e mobile com reaproveitamento de tipos e serviços.
- Preparação para extração futura de microserviços no backend e de apps separados no frontend, se fizer sentido.
- Refatorações mais localizadas, sem mudanças brutais na base de código.

---

## Estratégia Web para Mobile (React Native)

- **Hoje (web):** Organização por domínio, lógica em services/hooks/types, UI em React (Vite).
- **Futuro (mobile):** Primeiro foco na experiência do aluno; reutilizar services, types e contratos de API; criar apenas camadas de UI e navegação específicas para React Native.

**Por quê:**

- Reduz custo e tempo de desenvolvimento do app nativo.
- Evita duplicar regras de negócio e contratos; uma única fonte de verdade para tipos e chamadas à API.

---

## Resumo

| Escolha | Motivo |
|--------|--------|
| Monólito modular no backend | Simplicidade inicial com caminho para evolução e possível extração de serviços. |
| Frontend modular por domínio | Desacoplamento entre perfis, manutenção e onboarding mais simples. |
| Camada shared (types, services, api, hooks) | Reuso entre módulos web e futuro app React Native; uma única fonte de verdade. |
| IA via n8n | Desacoplamento do core; flexibilidade para trocar modelo ou provedor. |
| Infra em Docker | Ambiente consistente e reproduzível. |
| Preparação para monorepo e mobile | Suporte a escala e múltiplos canais sem refatorações disruptivas. |

Para detalhes de API, rotas, estado global e configuração, ver `Documentation.md` na raiz do repositório.

# Sparta App - Backend

API REST do Sparta App (Spring Boot, Java 21). Responsável por autenticação, usuários, exercícios, treinos, sessões de treino e anamnese. Integra com PostgreSQL e com n8n para geração de treinos via IA.

## Pré-requisitos

- Java 21
- Maven
- PostgreSQL (ou uso do Docker em `infra/docker-compose.yml` na raiz do repositório)

## Estrutura

O código da API está em `api/` (Maven). Organização por módulos:

```
api/
  src/main/java/com/spartaApp/api/
    ApiApplication.java          # Entrada da aplicação
    modules/
      auth/                      # Login, registro, JWT (domain, dto, repository, service, controller)
      exercise/                  # Catálogo de exercícios
      training/                  # Treinos, sets, integração com IA (n8n)
      session/                   # Sessões de treino (início, log de séries)
      anamnese/                  # Anamnese do aluno
  src/main/resources/
    application.properties
    db/migration/                # Flyway (V1, V2, ...)
```

Cada módulo segue: `domain`, `dto`, `repository`, `service`, `controller`. Modelo semi-hexagonal: domínio e casos de uso no centro; HTTP e persistência nos adapters.

## Instalação e execução

Na pasta `backend/api/`:

```bash
mvn clean install
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`. O frontend usa `VITE_API_URL=http://localhost:8080`.

## Configuração

Arquivo principal: `api/src/main/resources/application.properties`.

- **Banco:** URL, usuário e senha do PostgreSQL (ajustar host/porta se o banco estiver em outro lugar).
- **Flyway:** migrações habilitadas; schema criado/atualizado na subida.
- **Servidor:** porta 8080.
- **JWT:** chave em `api.security.token.secret`; pode ser sobrescrita pela variável de ambiente `JWT_SECRET`.
- **n8n:** URL do webhook e API key para o fluxo de geração de treinos (`sparta.n8n.webhook-url`, `sparta.n8n.api-key`).

Para rodar com banco local via Docker (raiz do projeto):

```bash
docker-compose -f infra/docker-compose.yml up -d
```

Ajuste em `application.properties` a URL do datasource para o host do PostgreSQL (ex.: `localhost:5432` se Docker estiver na mesma máquina).

## Testes

```bash
mvn test
```

## Documentação geral

Arquitetura e decisões: `docs/architecture.md` na raiz do repositório. Contrato dos endpoints utilizados pelo frontend: `Documentation.md` na raiz.

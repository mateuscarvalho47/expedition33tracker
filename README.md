# Colecionáveis — Expedition 33

Checklist full stack de colecionáveis de **Clair Obscur: Expedition 33**, evoluído a partir de um
protótipo HTML. O projeto preserva sua identidade visual e demonstra uma arquitetura que caberia
em um produto real: SSR, autenticação, persistência por usuário, perfil compartilhável,
observabilidade, migrações e testes em camadas.

## O que já funciona

- cadastro e login com sessão em cookie HTTP-only, Argon2id e rate limiting persistido;
- progresso com atualização otimista, busca, filtros e ações em lote;
- importação e exportação do progresso em JSON versionado;
- perfil público opcional e modo demonstração sem cadastro;
- temas claro e escuro, toggle de senha e sugestões de domínios de e-mail;
- endpoints de liveness/readiness e logs JSON com request ID;
- PostgreSQL local por Docker Compose e deploy preparado para Railway.

## Stack

- TanStack Start, Router, Query e Form; React 19 e TypeScript;
- Drizzle ORM, PostgreSQL e migrações SQL versionadas;
- Zod nos contratos do cliente e do servidor;
- Biome para lint, formatação e imports;
- Vitest, Testing Library, Testcontainers, Playwright e axe-core;
- Docker multi-stage e GitHub Actions.

## Rodando localmente

Requer Node 24, pnpm 11 e Docker.

```bash
cp .env.example .env
pnpm install --frozen-lockfile
pnpm db:setup
pnpm dev
```

A aplicação abre em `http://localhost:3000`. O Postgres fica em `localhost:5432`; seus dados são
preservados no volume `postgres-data`.

Também é possível subir aplicação e banco juntos:

```bash
docker compose --profile full up --build
```

## Qualidade

```bash
pnpm test                 # testes unitários e de componentes
pnpm test:integration     # PostgreSQL isolado via Testcontainers
pnpm test:e2e             # jornadas reais em desktop e mobile
pnpm test:coverage        # cobertura dos testes rápidos
pnpm check                # Biome + tipos + testes + build
pnpm check:all            # inclui integração e E2E
pnpm db:generate          # gera uma migração após mudar o schema
pnpm db:migrate:runtime   # aplica migrações sem depender do drizzle-kit
```

O workflow de CI repete a cadeia completa e também constrói a imagem de produção.

## Deploy

O caminho principal é **Railway + PostgreSQL**, porque a aplicação usa um servidor Node contínuo
e um banco relacional. O `Dockerfile`, `railway.json`, healthcheck e pre-deploy de migrações já
estão configurados. Veja o [guia de deploy](docs/DEPLOYMENT.md).

## Documentação

- [Arquitetura e diagramas](docs/ARCHITECTURE.md)
- [Estratégia de TDD](docs/TDD.md)
- [Curadoria e fontes dos colecionáveis](docs/COLLECTIBLES.md)
- [Segurança](docs/SECURITY.md)
- [ADR: PostgreSQL como banco principal](docs/adr/0001-postgresql.md)
- [Deploy na Railway](docs/DEPLOYMENT.md)

# ADR 0001: PostgreSQL como banco principal

- **Status:** aceito
- **Data:** 2026-08-20

## Contexto

O protótipo usava SQLite para evitar infraestrutura. A evolução inclui autenticação, rate limit,
importação transacional, perfis públicos e deploy em uma plataforma com filesystem efêmero.
Esses requisitos valorizam concorrência previsível e um banco acessível por mais de uma réplica.

## Decisão

Usar PostgreSQL 17, Drizzle ORM e migrations SQL versionadas. Em desenvolvimento, o banco roda em
Docker Compose; integração usa Testcontainers; produção usa PostgreSQL gerenciado na Railway.

## Consequências

**Positivas:** ambiente mais próximo de produção, constraints fortes, transações, concorrência,
advisory locks e escala horizontal sem volume compartilhado.

**Custos:** Docker passa a ser requisito local, existe um serviço adicional no deploy e a
operação do banco precisa de backups e migrações cuidadosas.

## Alternativas consideradas

- **SQLite em volume:** simples e barato, mas prende a aplicação a uma réplica e à durabilidade do
  volume.
- **Turso/libSQL:** reduz a operação e preserva a família SQLite, mas adiciona um provedor e não
  simplifica o caminho pretendido para PostgreSQL.
- **TanStack DB:** complementar para dados reativos/offline no cliente; não é banco servidor nem
  substituto do ORM.

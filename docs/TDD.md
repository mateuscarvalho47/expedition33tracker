# Estratégia de TDD

O ciclo adotado é **vermelho → verde → refatorar**:

1. escrever o menor teste que descreva o comportamento ou reproduza o defeito;
2. confirmar que ele falha pelo motivo esperado;
3. implementar o necessário para passar;
4. refatorar com a suíte verde;
5. executar `pnpm check` antes do commit.

## Pirâmide de testes

- **Domínio:** schemas, catálogo, transformações de progresso e compatibilidade de senha.
- **Componentes:** formulários, tema, filtros e estados otimistas com Testing Library.
- **Integração:** repositório e migrações contra PostgreSQL descartável via Testcontainers.
- **E2E:** cadastro, sessão, acessibilidade, responsividade e persistência real com Playwright.

Testes observam comportamento público. Detalhes internos só recebem testes diretos quando formam
uma fronteira relevante, como o repositório e o hasher de senha. Isso permite refatorar sem acoplar
a suíte à implementação.

## Banco nos testes

Os testes unitários não precisam de banco. A camada de integração sobe uma instância PostgreSQL
isolada, aplica as migrações reais e encerra o container no fim. O E2E usa o Postgres do Compose,
como faria uma aplicação local completa.

## Definition of done

Uma mudança está pronta quando:

- possui teste na camada mais barata capaz de provar o comportamento;
- não enfraquece tipos nem duplica regras de validação;
- `pnpm check` passa;
- mudanças de persistência passam em `pnpm test:integration`;
- jornadas críticas passam em `pnpm test:e2e`.

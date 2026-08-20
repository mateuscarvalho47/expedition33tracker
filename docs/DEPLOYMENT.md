# Deploy na Railway

O repositório está preparado para uma aplicação Node em container e um PostgreSQL gerenciado.
O `railway.json` declara build pelo `Dockerfile`, migração em pre-deploy, healthcheck de readiness
e política de restart.

## Passo a passo

1. Publique o projeto em um repositório GitHub.
2. Na Railway, crie um projeto e adicione um serviço **PostgreSQL**.
3. Adicione outro serviço a partir do repositório.
4. Nas variáveis do serviço web, configure:

   ```dotenv
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   SESSION_SECRET=gere-um-segredo-aleatorio-com-ao-menos-32-caracteres
   NODE_ENV=production
   ```

   Se o serviço do banco tiver outro nome, substitua `Postgres` na referência.

5. Em **Networking**, gere um domínio público para o serviço web.
6. Faça o deploy. A Railway construirá a imagem, executará
   `pnpm db:migrate:runtime` e só então iniciará a aplicação.

O banco pode permanecer privado: apenas o serviço web precisa de domínio público.

## Verificação após deploy

```text
GET /api/health/live   -> processo em execução
GET /api/health/ready  -> processo e PostgreSQL disponíveis
GET /demo              -> demonstração sem cadastro
```

Depois, crie uma conta, marque um item, recarregue a página e habilite o perfil público. Esses
passos validam sessão, escrita, leitura e SSR.

## Rollback e migrações

As migrações são somente progressivas. Antes de uma alteração destrutiva, crie backup do banco e
faça a mudança em etapas compatíveis com a versão anterior da aplicação. Um deploy é interrompido
se o pre-deploy de migração falhar.

Referências: [PostgreSQL na Railway](https://docs.railway.com/databases/postgresql),
[variáveis de referência](https://docs.railway.com/variables/reference) e
[pre-deploy commands](https://docs.railway.com/deployments/pre-deploy-command).

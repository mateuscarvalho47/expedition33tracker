# Segurança

## Controles implementados

- armazenamento e verificação de senhas exclusivamente com Argon2id;
- senha limitada a 128 caracteres para conter custo computacional abusivo;
- sessão em cookie HTTP-only, `SameSite=Lax` e `Secure` em produção;
- rate limit de login e cadastro persistido no PostgreSQL e serializado por advisory lock;
- respostas genéricas de login, sem revelar se uma conta existe;
- validação Zod em todas as entradas de Server Functions;
- constraints de unicidade e chaves estrangeiras no banco;
- headers `X-Content-Type-Options`, `X-Frame-Options` e `Referrer-Policy`;
- segredos validados no startup e excluídos do versionamento;
- logs sem senha, hash de senha, cookie ou e-mail.

## Modelo de ameaças resumido

| Risco | Mitigação atual |
| --- | --- |
| Credential stuffing | rate limit por combinação de origem e identidade |
| Roubo do banco | Argon2id e ausência de senha em texto puro |
| Enumeração de contas | mensagem de login uniforme |
| Progresso de outro usuário | sessão exigida em cada função privada |
| Duplicidade sob concorrência | constraints e inserts idempotentes |
| Deploy com segredo fraco | validação obrigatória em produção |

## Antes de receber dados reais

- adicionar verificação e recuperação de e-mail;
- implementar exclusão de conta e política de retenção;
- definir Content Security Policy com nonce compatível com SSR;
- revisar proxies confiáveis usados para obter o IP de origem;
- configurar alertas, backups automáticos e rotação de segredos;
- executar análise de dependências e threat modeling a cada funcionalidade sensível.

Vulnerabilidades devem ser reportadas de forma privada ao mantenedor, sem abrir uma issue pública
com detalhes exploráveis.

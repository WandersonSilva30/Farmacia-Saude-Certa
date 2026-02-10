# Guia de Deploy na Netlify - Farmácia Saude Certa

## Pré-requisitos

1. Conta no GitHub com o repositório do projeto
2. Conta na Netlify (https://netlify.com)
3. Variáveis de ambiente configuradas

## Passos para Deploy

### 1. Preparar o Repositório GitHub

```bash
# Inicializar git (se ainda não feito)
git init
git add .
git commit -m "Initial commit: Farmácia Saude Certa"
git branch -M main
git remote add origin https://github.com/seu-usuario/farmacia-saude-certa.git
git push -u origin main
```

### 2. Conectar Netlify ao GitHub

1. Acesse https://app.netlify.com
2. Clique em "New site from Git"
3. Selecione "GitHub" como provedor
4. Autorize o Netlify a acessar seus repositórios
5. Selecione o repositório `farmacia-saude-certa`

### 3. Configurar Build Settings

- **Build command:** `pnpm build`
- **Publish directory:** `dist/client`
- **Node version:** 22.13.0

### 4. Adicionar Variáveis de Ambiente

No painel da Netlify, vá para **Site Settings > Build & Deploy > Environment**

Adicione as seguintes variáveis:

```
DATABASE_URL=sua_url_do_banco_de_dados
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/oauth
JWT_SECRET=seu_jwt_secret
OWNER_NAME=Erika Barbosa
OWNER_OPEN_ID=seu_owner_open_id
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_chave_frontend_api
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=seu_website_id
VITE_APP_TITLE=Farmácia Saude Certa
VITE_APP_LOGO=/logo.png
```

### 5. Configurar Domínio Personalizado (Opcional)

1. No painel da Netlify, vá para **Domain settings**
2. Clique em "Add custom domain"
3. Digite seu domínio (ex: farmaciasuadecerta.com.br)
4. Configure os registros DNS conforme instruções da Netlify

### 6. Deploy Automático

Após conectar ao GitHub, o Netlify fará deploy automaticamente a cada push para a branch `main`.

Para fazer deploy manual:
1. Vá para **Deploys**
2. Clique em **Trigger deploy**
3. Selecione **Deploy site**

## Monitoramento

- **Build logs:** Verifique em **Deploys > Build log** para erros
- **Analytics:** Acesse **Analytics** para ver estatísticas de tráfego
- **Performance:** Use **Lighthouse** para auditar performance

## Troubleshooting

### Erro: "pnpm: command not found"

Certifique-se de que o `package.json` especifica o package manager:
```json
"packageManager": "pnpm@10.4.1+sha512..."
```

### Erro: "Build failed"

1. Verifique o build log para detalhes
2. Certifique-se de que todas as variáveis de ambiente estão configuradas
3. Teste localmente com `pnpm build`

### Erro: "Database connection failed"

Verifique se a variável `DATABASE_URL` está correta e o banco de dados está acessível

## Rollback

Para reverter para uma versão anterior:
1. Vá para **Deploys**
2. Encontre o deploy anterior
3. Clique em **Restore**

## Suporte

Para mais informações, consulte:
- Documentação Netlify: https://docs.netlify.com
- Documentação Manus: https://manus.im/docs

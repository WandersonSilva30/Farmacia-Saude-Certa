# Guia Completo de Deploy - Farmácia Saude Certa na Netlify

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

1. **Conta no GitHub** (https://github.com) - Para hospedar o código
2. **Conta na Netlify** (https://netlify.com) - Para fazer o deploy
3. **Git instalado** no seu computador
4. **Node.js e pnpm** instalados (já configurados no projeto)

## 🚀 Passo 1: Preparar o Repositório GitHub

### 1.1 Criar um novo repositório no GitHub

1. Acesse https://github.com/new
2. Preencha os campos:
   - **Repository name:** `farmacia-saude-certa`
   - **Description:** `Site de e-commerce para Farmácia Saude Certa`
   - **Visibility:** Public (recomendado para Netlify)
3. Clique em **Create repository**

### 1.2 Fazer push do código para o GitHub

No seu terminal (na pasta do projeto), execute:

```bash
# Inicializar git (se ainda não feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit: Farmácia Saude Certa - E-commerce com painel admin"

# Renomear branch para main
git branch -M main

# Adicionar o repositório remoto (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/farmacia-saude-certa.git

# Fazer push para o GitHub
git push -u origin main
```

## 🔗 Passo 2: Conectar Netlify ao GitHub

### 2.1 Acessar Netlify

1. Acesse https://app.netlify.com
2. Faça login com sua conta (ou crie uma nova)
3. Clique em **Add new site**
4. Selecione **Import an existing project**

### 2.2 Conectar ao GitHub

1. Clique em **GitHub**
2. Autorize o Netlify a acessar seus repositórios
3. Procure por `farmacia-saude-certa`
4. Clique para selecionar

### 2.3 Configurar Build Settings

Na tela de configuração, preencha:

- **Branch to deploy:** `main`
- **Build command:** `pnpm build`
- **Publish directory:** `dist/client`
- **Node version:** `22.13.0`

Clique em **Deploy site**

## 🔐 Passo 3: Configurar Variáveis de Ambiente

Após o deploy inicial, você precisa adicionar as variáveis de ambiente:

### 3.1 Acessar Site Settings

1. No painel da Netlify, vá para **Site settings**
2. Clique em **Build & Deploy**
3. Selecione **Environment**

### 3.2 Adicionar Variáveis

Clique em **Edit variables** e adicione as seguintes variáveis:

```
DATABASE_URL = sua_url_do_banco_de_dados
VITE_APP_ID = seu_app_id_manus
OAUTH_SERVER_URL = https://api.manus.im
VITE_OAUTH_PORTAL_URL = https://manus.im/oauth
JWT_SECRET = seu_jwt_secret_seguro
OWNER_NAME = Erika Barbosa
OWNER_OPEN_ID = seu_owner_open_id
BUILT_IN_FORGE_API_URL = https://api.manus.im
BUILT_IN_FORGE_API_KEY = sua_chave_api_manus
VITE_FRONTEND_FORGE_API_URL = https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY = sua_chave_frontend_api
VITE_ANALYTICS_ENDPOINT = https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID = seu_website_id
VITE_APP_TITLE = Farmácia Saude Certa
VITE_APP_LOGO = /logo.png
```

**Importante:** Após adicionar as variáveis, você precisa fazer um novo deploy para que elas sejam aplicadas.

## 🔄 Passo 4: Realizar Novo Deploy

Após adicionar as variáveis de ambiente:

1. No painel da Netlify, vá para **Deploys**
2. Clique em **Trigger deploy**
3. Selecione **Deploy site**

Aguarde o deploy ser concluído (geralmente 2-5 minutos).

## 🌐 Passo 5: Configurar Domínio Personalizado (Opcional)

Se você tem um domínio próprio (como `farmaciasuadecerta.com.br`):

1. No painel da Netlify, vá para **Domain settings**
2. Clique em **Add custom domain**
3. Digite seu domínio
4. Siga as instruções para configurar os registros DNS

## ✅ Passo 6: Validar o Deploy

1. Acesse a URL fornecida pela Netlify (ex: `farmacia-saude-certa.netlify.app`)
2. Teste as funcionalidades principais:
   - Homepage carrega corretamente
   - Login OAuth funciona
   - Carrinho de compras funciona
   - Painel administrativo acessível (com login de admin)
   - Histórico de pedidos funciona

## 🔄 Atualizações Futuras

Para fazer deploy de novas versões:

1. Faça as alterações no código
2. Commit e push para o GitHub:
   ```bash
   git add .
   git commit -m "Descrição das mudanças"
   git push origin main
   ```
3. Netlify fará deploy automaticamente

## 🆘 Troubleshooting

### Erro: "Build failed"

1. Verifique o **Build log** no painel da Netlify
2. Certifique-se de que todas as variáveis de ambiente estão configuradas
3. Teste localmente com `pnpm build`

### Erro: "Database connection failed"

1. Verifique se a variável `DATABASE_URL` está correta
2. Certifique-se de que o banco de dados está acessível

### Erro: "OAuth não funciona"

1. Verifique se `VITE_APP_ID` e `OAUTH_SERVER_URL` estão corretos
2. Certifique-se de que o domínio da Netlify está registrado no OAuth

### Site lento ou com erro 404

1. Limpe o cache: **Deploys > Trigger deploy > Clear cache and deploy**
2. Verifique se `dist/client` é o diretório correto

## 📞 Suporte

Para mais informações:
- Documentação Netlify: https://docs.netlify.com
- Documentação Manus: https://manus.im/docs
- GitHub Pages: https://pages.github.com

---

**Parabéns! Sua Farmácia Saude Certa está online! 🎉**

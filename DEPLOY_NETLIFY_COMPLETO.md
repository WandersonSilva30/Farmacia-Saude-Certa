# Guia Completo de Deploy na Netlify - Farmácia Saude Certa

## 📋 Pré-requisitos

1. **Conta GitHub** - [Criar em github.com](https://github.com)
2. **Conta Netlify** - [Criar em netlify.com](https://netlify.com)
3. **Git instalado** - [Baixar em git-scm.com](https://git-scm.com)
4. **Node.js 18+** - [Baixar em nodejs.org](https://nodejs.org)

---

## 🚀 Passo 1: Preparar o Repositório GitHub

### 1.1 Criar repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Nome do repositório: `farmacia-saude-certa`
3. Descrição: `E-commerce de farmácia com PIX, Stripe e WhatsApp`
4. Escolha "Public" ou "Private"
5. Clique em "Create repository"

### 1.2 Clonar e fazer push do código

```bash
# Abra o terminal na pasta do projeto
cd /home/ubuntu/farmacia-laranja-verde

# Inicializar git (se não estiver já)
git init
git add .
git commit -m "Initial commit: Farmácia Saude Certa com PIX, Stripe e WhatsApp"

# Adicionar remote (substitua USER e REPO)
git remote add origin https://github.com/SEU_USUARIO/farmacia-saude-certa.git
git branch -M main
git push -u origin main
```

---

## 🔐 Passo 2: Configurar Variáveis de Ambiente

### 2.1 Variáveis Necessárias

Você precisa das seguintes variáveis de ambiente:

```
# Banco de Dados
DATABASE_URL=mysql://usuario:senha@host:3306/database

# Autenticação
JWT_SECRET=sua-chave-secreta-aqui
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/oauth

# Stripe
STRIPE_SECRET_KEY=sk_test_... ou sk_live_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... ou pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Manus APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-chave-api
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua-chave-frontend

# App Info
VITE_APP_ID=seu-app-id
VITE_APP_TITLE=Farmácia Saude Certa
VITE_APP_LOGO=/logo.png

# Analytics (opcional)
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=seu-website-id

# Owner Info
OWNER_NAME=Erika Barbosa
OWNER_OPEN_ID=seu-open-id
```

### 2.2 Obter as Chaves

**Stripe:**
1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Vá em "Developers" → "API Keys"
3. Copie "Secret Key" (começa com `sk_`)
4. Copie "Publishable Key" (começa com `pk_`)

**Manus APIs:**
- Você já tem estas chaves no projeto (injetadas automaticamente)
- Copie do arquivo `.env` ou do painel de configuração

---

## 🌐 Passo 3: Conectar Netlify ao GitHub

### 3.1 Conectar repositório

1. Acesse [app.netlify.com](https://app.netlify.com)
2. Clique em "Add new site" → "Import an existing project"
3. Escolha "GitHub"
4. Autorize Netlify a acessar sua conta GitHub
5. Selecione o repositório `farmacia-saude-certa`
6. Clique em "Import"

### 3.2 Configurar build settings

Na página de configuração:

**Build command:**
```
pnpm install && pnpm build
```

**Publish directory:**
```
dist/client
```

**Environment variables:**
Adicione todas as variáveis da seção 2.1

---

## ⚙️ Passo 4: Configurar Variáveis de Ambiente no Netlify

### 4.1 Adicionar variáveis

1. No painel do site Netlify, vá em "Site settings" → "Build & deploy" → "Environment"
2. Clique em "Edit variables"
3. Adicione cada variável de ambiente:

```
DATABASE_URL = mysql://...
JWT_SECRET = sua-chave-secreta
STRIPE_SECRET_KEY = sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY = pk_test_...
... (todas as outras)
```

4. Clique em "Save"

### 4.2 Verificar variáveis

```bash
# No terminal local, teste se as variáveis estão corretas
pnpm build
```

---

## 🔧 Passo 5: Configurar Banco de Dados

### 5.1 Preparar banco de dados

Se você não tem um banco de dados MySQL, opções recomendadas:

**Opção 1: PlanetScale (recomendado)**
1. Crie conta em [planetscale.com](https://planetscale.com)
2. Crie um banco de dados
3. Copie a connection string
4. Use como `DATABASE_URL` no Netlify

**Opção 2: AWS RDS**
1. Crie instância MySQL em [aws.amazon.com/rds](https://aws.amazon.com/rds)
2. Copie endpoint
3. Use como `DATABASE_URL`

**Opção 3: Railway**
1. Crie conta em [railway.app](https://railway.app)
2. Crie serviço MySQL
3. Copie connection string

### 5.2 Executar migrações

Após configurar o banco:

```bash
# No terminal local
pnpm db:push
```

---

## 📦 Passo 6: Deploy Inicial

### 6.1 Fazer commit e push

```bash
git add .
git commit -m "Configure for Netlify deployment"
git push origin main
```

### 6.2 Netlify fará o deploy automaticamente

1. Vá para [app.netlify.com](https://app.netlify.com)
2. Selecione seu site
3. Vá em "Deploys"
4. Você verá o deploy em progresso
5. Aguarde até que fique "Published"

### 6.3 Acessar o site

- URL padrão: `https://seu-site.netlify.app`
- Você pode configurar domínio customizado em "Site settings" → "Domain management"

---

## 🧪 Passo 7: Testar o Site

### 7.1 Testar fluxo de compra

1. Acesse o site
2. Faça login com OAuth
3. Adicione produtos ao carrinho
4. Vá para o carrinho
5. Selecione endereço
6. Insira CEP e clique "Calcular"
7. Escolha PIX ou Cartão
8. Clique "Finalizar Compra"

### 7.2 Testar PIX

- Selecione PIX
- Clique em "Finalizar Compra"
- Deve abrir WhatsApp com confirmação

### 7.3 Testar Cartão (Stripe)

- Selecione Cartão
- Clique em "Finalizar Compra"
- Será redirecionado para Stripe
- Use cartão de teste: `4242 4242 4242 4242`
- Data: qualquer data futura
- CVC: qualquer 3 dígitos

### 7.4 Testar Painel Admin

1. Faça login como admin
2. Vá em "Painel Admin"
3. Teste adicionar/editar produtos
4. Teste gerenciar promoções
5. Verifique relatórios de vendas

---

## 🔄 Passo 8: Configurar Deploy Automático

Netlify já faz deploy automático quando você faz push para `main`:

```bash
# Fluxo de desenvolvimento
git add .
git commit -m "Descrição da mudança"
git push origin main
# Netlify fará deploy automaticamente em ~1-2 minutos
```

---

## 🚨 Troubleshooting

### Erro: "Build failed"

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Verifique se o banco de dados está acessível
3. Veja os logs em "Deploys" → clique no deploy → "Deploy log"

### Erro: "Database connection failed"

1. Verifique `DATABASE_URL` está correto
2. Verifique se o banco de dados está online
3. Teste a conexão localmente: `pnpm db:push`

### Erro: "Stripe key invalid"

1. Verifique se está usando chaves de teste (sk_test_, pk_test_)
2. Verifique se não há espaços extras nas chaves
3. Regenere as chaves no dashboard Stripe

### Site funciona localmente mas não em produção

1. Verifique se todas as variáveis de ambiente estão no Netlify
2. Verifique se o banco de dados é acessível de fora (firewall)
3. Verifique logs: `Deploys` → `Deploy log`

---

## 📱 Passo 9: Configurar Domínio Customizado (Opcional)

1. No Netlify, vá em "Site settings" → "Domain management"
2. Clique em "Add domain"
3. Digite seu domínio (ex: `farmacia-saude-certa.com.br`)
4. Siga as instruções para apontar DNS
5. Aguarde propagação (pode levar até 48h)

---

## 🎉 Parabéns!

Seu site está no ar! 

**Próximos passos:**
- Configurar SSL (automático no Netlify)
- Configurar email para notificações
- Adicionar mais produtos
- Configurar integração com WhatsApp Business
- Monitorar analytics

---

## 📞 Suporte

Se tiver dúvidas:
- Netlify Docs: [docs.netlify.com](https://docs.netlify.com)
- Stripe Docs: [stripe.com/docs](https://stripe.com/docs)
- GitHub Docs: [docs.github.com](https://docs.github.com)

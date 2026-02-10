# Farmácia Laranja & Verde - TODO

## Design & Configuração
- [x] Configurar paleta de cores (Laranja, Verde, Branco)
- [x] Configurar tipografia e estilos globais
- [x] Criar componentes reutilizáveis (Header, Footer, Navbar)

## Banco de Dados
- [x] Criar tabelas: produtos, categorias, estoque, promoções, pedidos, itens_pedido, endereços_usuário, telefones_usuário
- [x] Criar tabelas para relatórios: vendas_diárias
- [x] Executar migrações do banco de dados

## Autenticação & Usuário
- [x] Implementar login de usuário (OAuth Manus)
- [x] Implementar cadastro de usuário (OAuth Manus)
- [x] Implementar gerenciamento de endereços do usuário
- [x] Implementar gerenciamento de telefones do usuário
- [x] Implementar logout

## Funcionalidades de E-commerce
- [x] Criar página inicial com produtos em destaque
- [x] Implementar listagem de produtos
- [x] Implementar página de detalhes do produto
- [x] Implementar carrinho de compras com localStorage
- [x] Implementar checkout com validação de login/cadastro
- [x] Implementar confirmação de pedido

## Painel Administrativo
- [x] Criar layout do painel administrativo (apenas para admins)
- [x] Implementar gerenciamento de produtos (CRUD)
- [ ] Implementar gerenciamento de categorias
- [x] Implementar controle de estoque
- [x] Implementar gerenciamento de promoções
- [x] Implementar dashboard de vendas com gráficos
- [x] Implementar gráficos de ganhos financeiros

## Integração & Testes
- [ ] Testar fluxo completo de compra
- [ ] Testar painel administrativo
- [ ] Testar responsividade em mobile e desktop
- [ ] Preparar para deploy na Netlify

## Página Web Interativa de Apresentação
- [x] Criar página web interativa com visualização dos dados
- [x] Implementar gráficos interativos de vendas
- [x] Adicionar funcionalidade de exportação de dados em CSV


## Redesign Visual (Novo)
- [x] Analisar padrões de cores do site de referência
- [x] Atualizar paleta de cores (primária, secundária, backgrounds)
- [x] Redesenhar header com novo estilo
- [x] Atualizar cards de produtos
- [x] Redesenhar botões e inputs
- [x] Atualizar página inicial
- [x] Atualizar carrinho de compras
- [x] Atualizar painel administrativo
- [x] Testar responsividade com novo design


## Integração do Mascote
- [x] Copiar imagem do mascote para o projeto
- [x] Adicionar mascote na hero section da página inicial
- [x] Adicionar mascote na seção de categorias
- [x] Adicionar mascote no footer
- [x] Testar responsividade do mascote em mobile

## Atualização do Nome da Farmácia
- [x] Alterar nome de "Farmácia Laranja & Verde" para "Farmácia Saude Certa"
- [x] Atualizar nome em todas as páginas
- [x] Atualizar nome no header
- [x] Atualizar nome no footer
- [x] Atualizar nome nos títulos das páginas internas

## Informações de Contato
- [x] Atualizar email para erikabarbosaadelinodeoliveira@gmail.com
- [x] Atualizar telefone para (81) 93816-0087


## Otimização Mobile e Endereço
- [x] Adicionar endereço físico no footer
- [x] Otimizar header para mobile
- [x] Melhorar espaçamento em telas pequenas
- [x] Ajustar tamanho de fontes para mobile
- [x] Testar em diferentes resoluções


## Integração do Mapa Google Maps
- [x] Criar componente de mapa
- [x] Integrar mapa no footer
- [x] Configurar coordenadas da farmácia
- [x] Testar mapa em mobile e desktop


## Bot\u00e3o F## Botão Flutuante do WhatsApp
- [x] Criar componente WhatsAppButton
- [x] Integrar botão no App.tsx
- [x] Testar em mobile e desktop
- [x] Validar link do WhatsApp com número correto


## Sistema de Avalia\u00e7\u00f5es com Estrelas
- [ ] Criar tabela de avalia\u00e7\u00f5es no banco de dados
- [ ] Criar componente de exibi\u00e7\u00e3o de estrelas
- [ ] Integrar avalia\u00e7\u00f5es na p\u00e1gina inicial
- [ ] Adicionar formul\u00e1rio de avalia\u00e7\u00e3o para clientes
- [ ] Integrar gerenciamento de avalia\u00e7\u00f5es no painel admin


## Sistema de Busca de Produtos
- [ ] Criar componente SearchBar com autocomplete
- [ ] Integrar busca na página inicial
- [ ] Adicionar filtros por categoria
- [ ] Implementar ordenação (preço, nome, relevância)
- [ ] Testar busca em mobile e desktop

- [x] Criar componente SearchBar com autocomplete
- [x] Integrar busca na página inicial
- [x] Adicionar filtros por categoria
- [x] Implementar ordenação (preço, nome, relevância)
- [x] Testar busca em mobile e desktop


## Corre\u00e7\u00e3## Correção de Coordenadas do Google Maps
- [x] Atualizar coordenadas para a localização correta
- [x] Testar link do Google Maps


## Integra\u00e7\u00e3o & Testes (Finalizados)
- [x] Testar fluxo completo de compra
- [x] Testar painel administrativo
- [x] Testar responsividade em mobile e desktop
- [x] Preparar para deploy na Netlify
- [x] Criar arquivo netlify.toml com configura\u00e7\u00f5es
- [x] Criar guia de deploy (DEPLOY_NETLIFY.md)


## Sistema de Login e Histórico de Pedidos
- [x] Adicionar tabelas de pedidos ao banco de dados
- [x] Criar página de histórico de pedidos
- [x] Implementar salvamento de pedidos no checkout
- [x] Integrar login OAuth com histórico
- [x] Exibir detalhes do pedido (data, itens, total)
- [x] Testar fluxo completo de login e histórico


## Deploy na Netlify
- [x] Corrigir erros de TypeScript
- [x] Criar guia de deploy completo (GUIA_DEPLOY_NETLIFY.md)
- [x] Preparar arquivo netlify.toml com configurações
- [x] Documentar variáveis de ambiente necessárias
- [ ] Criar repositório GitHub (próximo passo do usuário)
- [ ] Fazer push do código (próximo passo do usuário)
- [ ] Conectar Netlify ao GitHub (próximo passo do usuário)
- [ ] Configurar variáveis de ambiente (próximo passo do usuário)
- [ ] Realizar deploy (próximo passo do usuário)


## Integração com Stripe
- [x] Adicionar feature Stripe ao projeto
- [x] Criar componente de checkout com Stripe
- [x] Implementar procedimento tRPC para pagamentos
- [x] Integrar Stripe no fluxo de compra
- [x] Testar pagamentos
- [x] Documentar configuração do Stripe


## Confirmação via WhatsApp, PIX e Frete
- [x] Implementar cálculo de frete (R$ 5 a cada 10km)
- [x] Adicionar pagamento via PIX
- [x] Implementar envio de confirmação via WhatsApp
- [x] Integrar detalhes do cliente (telefone, endereço)
- [x] Testar fluxo completo


## Reorganização do Fluxo de Checkout
- [x] Integrar CheckoutOptions no Cart.tsx
- [x] Criar componente de cálculo dinâmico de frete com CEP
- [x] Integrar cálculo de frete na finalização
- [x] Testar fluxo completo


## Separação de Carrinho e Pagamento
- [x] Reorganizar Cart.tsx - remover pagamento
- [x] Criar página Checkout.tsx
- [x] Adicionar proteção de autenticação
- [x] Criar testes vitest para Checkout
- [ ] Testar fluxo completo

## Integração do Mascote Sem Fundo
- [x] Upload da imagem do mascote para S3
- [x] Atualizar Home.tsx com nova imagem (hero section)
- [x] Atualizar Footer com nova imagem
- [x] Testar responsividade em mobile e desktop

## Substituição do Mascote por Versão com Fundo Gradiente
- [x] Upload da nova imagem do mascote para S3
- [x] Atualizar Home.tsx (hero section) com nova URL
- [x] Atualizar Footer com nova URL
- [x] Remover opacidade do footer (imagem já tem fundo)
- [x] Testar visual em desktop e mobile

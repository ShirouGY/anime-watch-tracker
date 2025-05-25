
# SoloAnimeList: Seu Tracker de Animes Pessoal

## Descrição do Projeto

O SoloAnimeList é uma aplicação web pessoal para rastrear animes que você deseja assistir, está assistindo ou já assistiu. Organize suas listas, acompanhe seu progresso de episódios, avalie animes completados e veja suas estatísticas de visualização.

## 📱 Descrição Detalhada das Telas

### 🏠 **Página Inicial (Index)**
- **Descrição**: Página de boas-vindas com apresentação do projeto e navegação para login/registro
- **Funcionalidades**: 
  - Apresentação visual do SoloAnimeList
  - Links para login e registro
  - Design responsivo com gradientes anime-themed
- **Dados**: Não armazena dados
- **Tecnologias**: React Router, Tailwind CSS, Lucide Icons

### 🔐 **Página de Login**
- **Descrição**: Autenticação de usuários existentes
- **Funcionalidades**:
  - Login com email/senha
  - Login com Google OAuth
  - Link para recuperação de senha
  - Redirecionamento automático para dashboard se já logado
- **Armazenamento**: 
  - Sessão do usuário no localStorage (Supabase Auth)
  - Tokens de autenticação gerenciados pelo Supabase
- **APIs/Serviços**: 
  - Supabase Authentication
  - Google OAuth Provider
- **Tecnologias**: Supabase Auth, React Hook Form, shadcn/ui

### 📝 **Página de Registro**
- **Descrição**: Criação de novas contas de usuário
- **Funcionalidades**:
  - Cadastro com email/senha
  - Validação de confirmação de senha
  - Criação automática de perfil na tabela `profiles`
- **Armazenamento**: 
  - Tabela `auth.users` (Supabase Auth)
  - Tabela `profiles` (dados públicos do usuário)
- **APIs/Serviços**: Supabase Authentication
- **Tecnologias**: Supabase Auth, React Hook Form, shadcn/ui

### 📊 **Dashboard**
- **Descrição**: Visão geral das estatísticas e atividades recentes do usuário
- **Funcionalidades**:
  - Estatísticas de animes (total assistidos, horas, nota média)
  - Gráficos de progresso e distribuição por status
  - Atividades recentes
  - Cards de navegação rápida
- **Armazenamento**: 
  - Tabela `anime_lists` (listas de animes)
  - Tabela `anime_progress` (progresso de episódios)
- **APIs/Serviços**: Supabase Database, Recharts para gráficos
- **Tecnologias**: React Query, Recharts, shadcn/ui Charts

### 📚 **Minhas Listas**
- **Descrição**: Gerenciamento completo das listas de animes
- **Funcionalidades**:
  - Aba "Quero Assistir": Animes planejados para assistir
  - Aba "Assistidos": Animes completados com avaliações
  - Aba "Recomendados" (Premium): Conteúdo exclusivo premium
  - Adicionar novos animes via busca
  - Remover animes das listas
  - Marcar como assistido
  - Sistema de avaliação (1-5 estrelas)
- **Armazenamento**: 
  - Tabela `anime_lists` com campos:
    - `user_id`, `anime_id`, `title`, `image`, `episodes`
    - `year`, `status`, `rating`, `notes`, `created_at`
- **APIs/Serviços**: 
  - Jikan API (MyAnimeList) para busca de animes
  - Supabase Database para persistência
- **Tecnologias**: React Query, Supabase RLS, shadcn/ui Tabs

### 🎯 **Recomendações Premium**
- **Descrição**: Sistema inteligente de recomendações baseado em IA para usuários premium
- **Funcionalidades**:
  - **Para usuários não-premium**: Tela promocional explicando benefícios
  - **Para usuários premium**:
    - Recomendações personalizadas baseadas no histórico
    - Filtros por gênero
    - Animes em alta (trending)
    - Percentual de compatibilidade (match)
    - Adicionar recomendações às listas
- **Armazenamento**: 
  - Utiliza dados da tabela `anime_lists` para análise
  - Cache de recomendações via React Query
- **APIs/Serviços**: 
  - Jikan API v4 (MyAnimeList) para dados de animes
  - Endpoints utilizados:
    - `/anime?genres={id}&order_by=score` (recomendações por gênero)
    - `/top/anime` (animes em alta)
    - `/anime?order_by=popularity` (populares)
- **Algoritmo**: 
  - Extrai gêneros dos animes assistidos pelo usuário
  - Mapeia gêneros português → inglês para API
  - Calcula percentual de match simulado (70-100%)
  - Rate limiting (300ms entre requests)
- **Tecnologias**: React Query, Supabase Subscription Management

### 👤 **Perfil**
- **Descrição**: Gestão completa do perfil do usuário e sistema de conquistas
- **Funcionalidades**:
  - **Informações pessoais**: Avatar, username, email
  - **Sistema de níveis**: Baseado em animes assistidos (0-5)
  - **Gestão Premium**: 
    - Assinatura/cancelamento via Stripe
    - Portal do cliente para gerenciar pagamentos
  - **Avatares**: 
    - Avatares básicos para todos
    - Avatares premium desbloqueáveis por animes específicos
  - **Conquistas**: Sistema de medalhas e progressão
  - **Estatísticas detalhadas**: Histórico de atividades
- **Armazenamento**: 
  - Tabela `profiles`: `id`, `username`, `avatar_url`, `is_premium`
  - Storage bucket `avatar-icons` com pastas:
    - `icons_basic/` (avatares gratuitos)
    - `icons_premium/` (avatares premium)
- **APIs/Serviços**: 
  - Supabase Storage para avatares
  - Stripe para pagamentos (Edge Functions)
  - Supabase Edge Functions:
    - `create-checkout` (criar sessão de pagamento)
    - `customer-portal` (portal do cliente)
    - `check-subscription` (verificar status)
- **Tecnologias**: Stripe, Supabase Storage, Edge Functions

## 🛠 Tecnologias e Arquitetura

### **Frontend**
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **React Query** para gerenciamento de estado e cache
- **React Router** para navegação
- **Recharts** para gráficos e visualizações

### **Backend (Supabase)**
- **PostgreSQL** como banco de dados
- **Row Level Security (RLS)** para segurança
- **Supabase Auth** para autenticação
- **Supabase Storage** para arquivos
- **Edge Functions** para lógica serverless

### **APIs Externas**
- **Jikan API v4**: API não-oficial do MyAnimeList para dados de animes
- **Stripe**: Processamento de pagamentos premium
- **Google OAuth**: Autenticação social

### **Segurança**
- Todas as tabelas utilizam RLS (Row Level Security)
- Usuários só acessam seus próprios dados
- Tokens JWT gerenciados pelo Supabase
- Secrets gerenciados via Supabase Edge Functions

## 📁 Estrutura do Banco de Dados

### Tabelas Principais:
```sql
-- Perfis de usuário
profiles (id, username, avatar_url, is_premium)

-- Listas de animes
anime_lists (id, user_id, anime_id, title, image, episodes, year, status, rating, notes)

-- Progresso de episódios
anime_progress (id, user_id, anime_id, current_episode, total_episodes)
```

### Storage Buckets:
- `avatar-icons/`: Armazenamento de avatares
  - `icons_basic/`: Avatares gratuitos
  - `icons_premium/`: Avatares premium desbloqueáveis

## 🚀 Como Rodar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd anime-watch-tracker
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o Supabase:**
   - Crie um projeto no [Supabase](https://app.supabase.io/)
   - Configure as tabelas usando os scripts SQL fornecidos
   - Configure os Edge Functions para Stripe
   - Adicione os secrets necessários (Stripe keys)

4. **Configure variáveis de ambiente:**
   ```env
   VITE_SUPABASE_URL=sua_supabase_url
   VITE_SUPABASE_ANON_KEY=sua_anon_key
   ```

5. **Inicie o desenvolvimento:**
   ```bash
   npm run dev
   ```

## 💎 Recursos Premium

- ✅ Recomendações inteligentes baseadas em IA
- ✅ Avatares exclusivos desbloqueáveis
- ✅ Análise avançada de compatibilidade
- ✅ Filtros por gênero nas recomendações
- ✅ Animes trending atualizados
- ✅ Sistema de conquistas completo
- ✅ Backup na nuvem
- ✅ Experiência sem anúncios

## 📊 APIs e Rate Limits

### Jikan API (MyAnimeList)
- **Base URL**: `https://api.jikan.moe/v4`
- **Rate Limit**: 3 requests/segundo, 60 requests/minuto
- **Implementação**: Rate limiting com delay de 300ms entre requests
- **Endpoints principais**:
  - `/anime?q={query}` - Busca de animes
  - `/anime?genres={id}` - Animes por gênero
  - `/top/anime` - Top animes

### Stripe API
- **Webhook handling** via Edge Functions
- **Produtos**: Assinatura mensal R$ 19,99
- **Portal do cliente** para autogestão

## 🔒 Licença

Este projeto está licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT).

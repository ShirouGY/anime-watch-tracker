# SoloAnimeList: Seu Tracker de Animes Pessoal

## Descrição do Projeto

O SoloAnimeList é uma aplicação web pessoal para rastrear animes que você deseja assistir, está assistindo ou já assistiu. Organize suas listas, acompanhe seu progresso de episódios, avalie animes completados e veja suas estatísticas de visualização.

## Funcionalidades

*   **Minhas Listas:** Organize animes nas categorias "Quero Assistir" e "Assistidos".
*   **Rastreamento de Progresso:** Acompanhe em qual episódio você parou em animes assistindo.
*   **Avaliação de Animes:** Dê notas aos animes que você completou.
*   **Estatísticas:** Veja um resumo do seu consumo de animes (total assistidos, horas, nota média, nível Otaku).
*   **Perfil:** Personalize seu perfil com um avatar e acompanhe suas conquistas (funcionalidade em desenvolvimento).
*   **Autenticação:** Login seguro para manter seus dados sincronizados.
*   **Recursos Premium (Exemplo):** Demonstração de funcionalidades exclusivas para usuários premium (como arquivamento e acesso a conteúdo recomendado).

## Tecnologias Utilizadas

*   **Frontend:**
    *   [React](https://reactjs.org/): Biblioteca JavaScript para construir a interface do usuário.
    *   [TypeScript](https://www.typescriptlang.org/): Adiciona tipagem estática ao JavaScript.
    *   [Vite](https://vitejs.dev/): Ferramenta de build rápida.
    *   [Tailwind CSS](https://tailwindcss.com/): Framework CSS utilitário para estilização rápida e responsiva.
    *   [shadcn-ui](https://ui.shadcn.com/): Componentes UI construídos com Tailwind CSS e Radix UI.

*   **Backend (BaaS - Backend as a Service):**
    *   [Supabase](https://supabase.io/): Utilizado para:
        *   Banco de Dados (PostgreSQL) para armazenar dados de usuários, animes, listas e progresso.
        *   Autenticação: Gerenciamento de usuários e login.
        *   Storage: Armazenamento de avatares de usuário.

## Como Rodar o Projeto Localmente

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd anime-watch-tracker # Ou o nome da pasta do seu projeto
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Supabase:**
    *   Crie um projeto no [Supabase](https://app.supabase.io/).
    *   Obtenha sua **URL** e **Anon Key** nas configurações do projeto (Settings -> API).
    *   Crie as tabelas `profiles`, `anime_lists`, e `anime_progress` conforme a estrutura utilizada no código (você pode inspecionar os hooks em `src/hooks/use-anime-lists.ts` para ver os campos esperados).
    *   Configure o Supabase Storage criando um bucket chamado `avatars`.
    *   Crie um arquivo `.env.local` na raiz do projeto com suas chaves do Supabase:
        ```env
        VITE_SUPABASE_URL=SUA_SUPABASE_URL
        VITE_SUPABASE_ANON_KEY=SUA_SUPABASE_ANON_KEY
        ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

O aplicativo estará disponível em `http://localhost:5173` (ou outra porta disponível).

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou novas funcionalidades. Por favor, abra uma issue para discutir as mudanças propostas antes de enviar um Pull Request.

## Licença

Este projeto está licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT).

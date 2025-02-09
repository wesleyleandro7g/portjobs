# PortJOBS

Este é um projeto [Next.js](https://nextjs.org) criado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Sumário

- [Introdução](#introdução)
- [Funcionalidades](#funcionalidades)
- [Telas](#telas)
- [Configuração](#configuração)
- [Execução](#execução)
- [Deploy](#deploy)
- [Aprenda Mais](#aprenda-mais)

## Introdução

PortJOBS é uma aplicação web que ajuda os usuários a encontrar empregos dos sonhos. A aplicação utiliza Next.js e Tailwind CSS para fornecer uma experiência de usuário rápida e responsiva.

## Funcionalidades

- Autenticação de usuários
- Pesquisa de vagas de emprego
- Cadastro de empresas e candidatos
- Sistema de breadcrumbs para navegação
- Integração com Supabase para gerenciamento de dados

## Telas

### Página Inicial

A página inicial exibe uma visão geral das vagas de emprego disponíveis e permite que os usuários naveguem para outras seções do site.

### Página de Login

Permite que os usuários façam login na aplicação.

### Página de Cadastro

Permite que novos usuários se cadastrem como candidatos ou empresas.

### Página de Vagas

Exibe uma lista de vagas de emprego disponíveis. Os usuários podem filtrar e pesquisar vagas.

### Painel do Usuário

Os usuários autenticados podem acessar seu painel para gerenciar suas informações e candidaturas.

## Configuração

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm, yarn, pnpm ou bun (gerenciador de pacotes)

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/portjobs.git
   cd portjobs
   ```

2. Instale as dependências:

   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   # ou
   bun install
   ```

3. Configure as variáveis de ambiente:

   Crie um arquivo .env.local na raiz do projeto e adicione as variáveis de ambiente necessárias. Exemplo:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### Execução

Para iniciar o servidor de desenvolvimento, execute:

    ```bash
    npm run dev
    # ou
    yarn dev
    # ou
    pnpm dev
    # ou
    bun dev
    ```

Abra http://localhost:3000 no seu navegador para ver o resultado.

Você pode começar a editar a página modificando `page.tsx`. A página será atualizada automaticamente conforme você edita o arquivo.

### Deploy

A maneira mais fácil de fazer o deploy da sua aplicação Next.js é usar a Plataforma Vercel dos criadores do Next.js.

Confira a [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.

Aprenda Mais
Para saber mais sobre Next.js, veja os seguintes recursos:

[Documentação do Next.js](https://nextjs.org/docs) - aprenda sobre os recursos e a API do Next.js.

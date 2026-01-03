# Creeper Bet - Cassino Online Simulado

Esta é uma plataforma de cassino online desenvolvida com **Next.js 15**, **Tailwind CSS**, **Prisma** e **NextAuth.js**. O projeto simula jogos de cassino com dinheiro fictício.

## 🚀 Funcionalidades

- **Autenticação**: Cadastro e Login (Credenciais).
- **Carteira Fictícia**: Depósitos e Saques simulados.
- **Jogos**:
  - 🚀 **Crash**: Multiplicador crescente, retire antes de explodir.
  - 💣 **Mines**: Encontre diamantes e evite as bombas.
  - 🎲 **Dice**: Ajuste sua chance de vitória.
  - 🎡 **Roleta**: Aposte em números ou cores.
  - 🎰 **Slots**: Gire os rolos para combinar símbolos.
  - 🎥 **Cassino Ao Vivo**: Simulação com vídeo e apostas em tempo real.
- **Painel Administrativo**: Visualize usuários e transações (/admin).
- **Responsivo**: Funciona em Desktop e Mobile.

## 🛠️ Tecnologias

- **Frontend**: Next.js (App Router), React, Tailwind CSS, Framer Motion.
- **Backend**: Next.js API Routes, NextAuth.js.
- **Banco de Dados**: SQLite (Desenvolvimento) / PostgreSQL (Produção/Vercel).
- **ORM**: Prisma.

## 📦 Como Rodar Localmente

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz.
   - Adicione `DATABASE_URL` (use `file:./dev.db` para SQLite local ou sua URL do Postgres).
   - Adicione `NEXTAUTH_SECRET` e `NEXTAUTH_URL`.

4. Configure o banco de dados (SQLite por padrão):
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse `http://localhost:3000`.

## ☁️ Como Deployar na Vercel

Para colocar este projeto em produção na Vercel, você precisa mudar o banco de dados de SQLite para PostgreSQL, pois o SQLite não persiste dados em ambiente Serverless.

### Passos:

1. **Crie um Banco de Dados Postgres**:
   - Você pode usar o Vercel Postgres, Neon, Supabase ou Railway.
   - Obtenha a `DATABASE_URL` (ex: `postgres://user:pass@host:5432/db`).

2. **Ajuste o Schema do Prisma**:
   - Abra `prisma/schema.prisma`.
   - Altere o provider de `sqlite` para `postgresql`.

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Deploy na Vercel**:
   - Importe o projeto do GitHub para a Vercel.
   - Nas configurações do projeto na Vercel, adicione a variável de ambiente:
     - `DATABASE_URL`: Sua string de conexão do Postgres.
     - `NEXTAUTH_SECRET`: Uma string aleatória para segurança (gere com `openssl rand -base64 32`).
     - `NEXTAUTH_URL`: A URL do seu site (ex: `https://seu-projeto.vercel.app`).

4. **Build Build Command**:
   - Certifique-se de que o comando de build inclua a geração do Prisma:
     - `prisma generate && next build` (ou adicione `postinstall`: `prisma generate` no package.json).

## 📝 Notas
- O sistema utiliza dinheiro **FICTÍCIO**. Nenhuma transação real é processada.
- Este projeto é apenas para fins educacionais e de demonstração.

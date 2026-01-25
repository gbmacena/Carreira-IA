# 🤖 Assistente de Análise de Currículos com IA

Sistema inteligente para análise automatizada de currículos utilizando IA, desenvolvido com NestJS, Next.js e integração com múltiplos modelos de linguagem (Gemini, OpenAI, Groq).

## 📋 Sobre o Projeto

Este projeto oferece uma plataforma completa para análise de currículos, permitindo que recrutadores e empresas avaliem candidatos de forma rápida e objetiva através de inteligência artificial. O sistema analisa diversos aspectos do currículo, gerando scores detalhados e identificando o nível de senioridade do candidato.

### ✨ Funcionalidades

- 📄 **Upload e Processamento de Currículos** (PDF/HTML)
- 🧠 **Análise por IA** usando múltiplos modelos (Gemini, OpenAI, Groq)
- 📊 **Scores Detalhados** em diferentes categorias:
  - Experiência Profissional
  - Formação Acadêmica
  - Habilidades Técnicas
  - Projetos e Portfólio
  - Certificações
- 🎯 **Detecção Automática de Nível** (Júnior, Pleno, Sênior)
- 📈 **Histórico de Análises** com busca e filtros
- 🔐 **Sistema de Autenticação** JWT com refresh tokens
- ⚡ **Processamento Assíncrono** com filas (BullMQ)
- 🔄 **Atualização em Tempo Real** do status das análises

## 🛠️ Tecnologias

### Backend

- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript tipado
- **[Prisma](https://www.prisma.io/)** - ORM moderno para Node.js
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[BullMQ](https://docs.bullmq.io/)** - Sistema de filas para processamento assíncrono
- **[Redis](https://redis.io/)** - Cache e gerenciamento de filas
- **[Passport JWT](http://www.passportjs.org/)** - Autenticação com tokens
- **[pdf-parse](https://www.npmjs.com/package/pdf-parse)** - Extração de texto de PDFs

### Frontend

- **[Next.js 14](https://nextjs.org/)** - Framework React com SSR
- **[React 18](https://react.dev/)** - Biblioteca JavaScript para UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis
- **[Axios](https://axios-http.com/)** - Cliente HTTP
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** - Validação de schemas

### IA & APIs

- **[Google Gemini](https://ai.google.dev/)** - Modelo de IA do Google
- **[OpenAI GPT](https://platform.openai.com/)** - Modelos GPT-4/3.5
- **[Groq](https://groq.com/)** - LLMs de alta performance

### DevOps

- **[Docker](https://www.docker.com/)** - Containerização
- **[Docker Compose](https://docs.docker.com/compose/)** - Orquestração de containers

## 📁 Estrutura do Projeto

```

├── backend/                    # API NestJS
│   ├── src/
│   │   ├── analysis/          # Módulo de análise de currículos
│   │   │   ├── ai.service.ts         # Integração com APIs de IA
│   │   │   ├── analysis.processor.ts # Processador de fila
│   │   │   └── config/               # Configuração de prompts
│   │   ├── auth/              # Autenticação e autorização
│   │   ├── upload/            # Upload de arquivos
│   │   ├── prisma/            # Cliente Prisma
│   │   └── shared/            # Utilitários compartilhados
│   ├── prisma/
│   │   ├── schema.prisma      # Schema do banco de dados
│   │   └── migrations/        # Migrations do Prisma
│   └── package.json
│
├── frontend/                   # Interface Next.js
│   ├── app/                   # App Router (Next.js 14)
│   │   ├── dashboard/         # Área logada
│   │   ├── login/             # Página de login
│   │   └── register/          # Página de registro
│   ├── components/            # Componentes React
│   │   ├── Analysis/          # Componentes de análise
│   │   ├── Dashboard/         # Componentes do dashboard
│   │   └── ui/                # Componentes base (Radix UI)
│   ├── context/               # Contextos React
│   ├── hooks/                 # Hooks customizados
│   ├── lib/                   # Utilitários e API client
│   └── package.json
│
├── docker-compose.yml         # Configuração Docker
├── .env.example              # Template de variáveis de ambiente
└── README.md                 # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Chave de API de pelo menos um provedor de IA (Gemini, OpenAI ou Groq)

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
```

### 2. Configure as Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env e adicione suas chaves de API
nano .env
```

**Variáveis obrigatórias:**

```env
# Banco de Dados
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carreira_ai

# JWT
JWT_SECRET=seu-secret-aqui
JWT_REFRESH_SECRET=seu-refresh-secret-aqui

# IA (pelo menos uma das três)
GEMINI_API_KEY=sua-chave-gemini
OPENAI_API_KEY=sua-chave-openai
GROQ_API_KEY=sua-chave-groq
```

**Como obter as chaves de API (grátis):**

- **Gemini**: https://aistudio.google.com/app/apikey
- **OpenAI**: https://platform.openai.com/api-keys (requer cartão)
- **Groq**: https://console.groq.com (gratuito e rápido)

### 3. Inicie os Serviços com Docker

```bash
# Inicia todos os containers (backend, frontend, postgres, redis)
docker-compose up -d

# Acompanhe os logs
docker-compose logs -f
```

### 4. Acesse a Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Banco de Dados**: localhost:5433

### 5. Crie uma Conta

1. Acesse http://localhost:3000
2. Clique em "Criar conta"
3. Preencha seus dados e faça login
4. Comece a analisar currículos!

## 🔧 Comandos Úteis

### Docker

```bash
# Parar todos os serviços
docker-compose down

# Reiniciar um serviço específico
docker-compose restart backend

# Ver logs de um serviço
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild após mudanças
docker-compose up -d --build

# Executar migrations
docker-compose exec backend npx prisma migrate dev
```

### Desenvolvimento Local (sem Docker)

#### Backend:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev        # API
npm run start:worker     # Worker (em outro terminal)
```

#### Frontend:

```bash
cd frontend
npm install
npm run dev
```

## 📊 Fluxo de Análise

1. **Upload**: Usuário faz upload de um currículo (PDF/HTML)
2. **Extração**: Sistema extrai texto do arquivo
3. **Fila**: Análise é adicionada à fila do BullMQ
4. **Processamento**: Worker processa a análise usando IA
5. **Scores**: IA gera scores e identifica nível de senioridade
6. **Resultado**: Usuário visualiza análise detalhada

## 🎯 Critérios de Avaliação

O sistema avalia currículos em 5 categorias principais:

1. **Experiência Profissional** (0-100)
   - Tempo de experiência
   - Relevância das posições
   - Progressão de carreira

2. **Formação Acadêmica** (0-100)
   - Nível de formação
   - Relevância do curso
   - Instituições

3. **Habilidades Técnicas** (0-100)
   - Stack tecnológico
   - Ferramentas e frameworks
   - Linguagens de programação

4. **Projetos e Portfólio** (0-100)
   - Qualidade dos projetos
   - Contribuições open source
   - GitHub/Portfolio

5. **Certificações** (0-100)
   - Certificações relevantes
   - Cursos complementares
   - Especializações

**Score Total**: Média ponderada das 5 categorias

**Classificação de Nível**:

- 🟢 **Sênior**: 80-100 pontos
- 🟡 **Pleno**: 60-79 pontos
- 🔵 **Júnior**: 0-59 pontos

## 🔐 Segurança

- ✅ Autenticação JWT com refresh tokens
- ✅ Senhas hasheadas com bcrypt
- ✅ Validação de entrada com class-validator
- ✅ CORS configurado
- ✅ Variáveis de ambiente protegidas
- ✅ Rate limiting (recomendado para produção)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commitar suas mudanças (`git commit -m 'Add: Minha nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👤 Autor

Desenvolvido com ❤️ para facilitar processos de recrutamento

---

**⭐ Se este projeto foi útil, considere dar uma estrela!**

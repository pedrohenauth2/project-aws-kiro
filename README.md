# NUTRIX - Plataforma de Saúde e Condicionamento Físico

Aplicação web para gerenciamento de saúde e treinos, com calculadora de TMB, montador de treino semanal e banco de exercícios.

## URLs de Produção

| Serviço | URL |
|---------|-----|
| **Frontend** | https://project-aws-kiro.vercel.app |
| **Backend** | https://nutrix-backend-fibs.onrender.com |
| **Swagger (API Docs)** | https://nutrix-backend-fibs.onrender.com/swagger-ui.html |

**Credenciais de teste:** `admin` / `senha123`

## Tech Stack

- **Backend:** Java 17, Spring Boot 3.2.5, Spring Security (JWT), Spring Data JPA
- **Frontend:** Angular 17+ (Standalone Components), TypeScript, SCSS
- **Banco de Dados:** PostgreSQL (Supabase)
- **Deploy:** Render (backend), Vercel (frontend)

---

## Desafios

### Desafio 1 — Criação da Aplicação

Desenvolvimento completo da plataforma NUTRIX do zero, incluindo backend, frontend, banco de dados e deploy.

**Funcionalidades entregues:**
- Autenticação JWT com Spring Security
- Calculadora de TMB/TDEE (fórmula Mifflin-St Jeor)
- Histórico de cálculos com persistência
- Montador de treino semanal com banco de exercícios
- Dashboard com cards de funcionalidades
- Design system com paleta verde, toast notifications, navbar global
- Responsividade mobile-first
- Deploy no Render (backend) e Vercel (frontend)

### Desafio 2 — Modernização

Melhorias técnicas aplicadas ao projeto existente, sem alterar deploy, banco ou comportamento funcional.

📄 **Documento:** [DESAFIO_2_MODERNIZATION.md](DESAFIO_2_MODERNIZATION.md)

**Melhorias implementadas:**
- Java Records nos DTOs (código mais limpo e imutável)
- SpringDoc OpenAPI / Swagger UI (documentação interativa da API)
- Spring Boot Actuator (health check endpoint)
- Interceptor global de erros 401 no frontend (tratamento centralizado de sessão expirada)

### Desafio 3 — Agent Hooks no Kiro

Criação de 3 Agent Hooks para automatizar atividades recorrentes do fluxo de desenvolvimento.

📄 **Documento:** [DESAFIO_3_HOOKS.md](DESAFIO_3_HOOKS.md)

**Hooks criados:**
- Build antes de commit (preToolUse) — roda `mvn clean install` antes de qualquer git commit
- Validar padrões Java (fileEdited) — verifica se arquivos `.java` seguem os padrões do projeto
- Sugerir testes para Services (fileEdited) — sugere testes ao editar arquivos `*Service.java`

### Desafio 4 — Kiro Power com MCP

Criação de um Kiro Power customizado que usa MCP para verificar a saúde dos serviços NUTRIX em produção.

📄 **Documento:** [DESAFIO_4_POWER.md](DESAFIO_4_POWER.md)

**Power criado:**
- NUTRIX Health Check — verifica Backend (Render), Frontend (Vercel) e API via MCP server customizado em Node.js

---

## Estrutura do Projeto

```
project-aws-kiro/
├── nutrix-backend/          # Backend Spring Boot
│   ├── src/main/java/com/nutrix/
│   │   ├── auth/            # Autenticação JWT
│   │   ├── config/          # Security, Swagger, Exception Handler
│   │   ├── exercise/        # Exercícios (dados estáticos)
│   │   ├── tmb/             # Calculadora TMB
│   │   ├── user/            # Usuários
│   │   └── workout/         # Montador de Treino
│   ├── Dockerfile
│   └── pom.xml
├── nutrix-frontend/         # Frontend Angular
│   ├── src/app/
│   │   ├── core/            # Guards, Interceptors, Services
│   │   ├── features/        # Login, Dashboard, TMB, Workout
│   │   └── shared/          # Navbar, Toast
│   ├── vercel.json
│   └── package.json
├── migrations/              # Migrations SQL
├── schema.sql               # Schema inicial do banco
├── DESAFIO_2_MODERNIZATION.md  # Documento do Desafio 2
├── DESAFIO_3_HOOKS.md          # Documento do Desafio 3
├── DESAFIO_4_POWER.md          # Documento do Desafio 4
├── ARCHITECTURE.md          # Arquitetura técnica
└── TESTING_GUIDE.md         # Guia de testes
```

## Documentação

| Arquivo | Conteúdo |
|---------|----------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitetura técnica, módulos, endpoints, banco de dados, segurança e deploy |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | Roteiro de testes, URLs, credenciais e exemplos de curl |
| [DESAFIO_2_MODERNIZATION.md](DESAFIO_2_MODERNIZATION.md) | Comparativo antes vs depois das melhorias do Desafio 2 |
| [DESAFIO_3_HOOKS.md](DESAFIO_3_HOOKS.md) | Definição dos 3 Agent Hooks, gatilhos e comportamento esperado |
| [DESAFIO_4_POWER.md](DESAFIO_4_POWER.md) | Kiro Power com MCP para health check dos serviços |

## Como Executar Localmente

### Pré-requisitos
- Java 17+, Maven 3.8+, Node.js 18+

### Backend
```bash
cd nutrix-backend
mvn spring-boot:run
# Disponível em http://localhost:8080
```

### Frontend
```bash
cd nutrix-frontend
npm install
npm start
# Disponível em http://localhost:4200
```

## Licença

Projeto em desenvolvimento.

# NUTRIX - Plataforma de Saúde e Condicionamento Físico

Aplicação web para gerenciamento de saúde e treinos, com calculadora de TMB, montador de treino semanal e banco de exercícios.

## URLs de Produção

| Serviço | URL |
|---------|-----|
| **Frontend** | https://project-aws-kiro.vercel.app |
| **Backend** | https://nutrix-backend-fibs.onrender.com |

**Credenciais de teste:** `admin` / `senha123`

## Tech Stack

- **Backend:** Java 17, Spring Boot 3.2.5, Spring Security (JWT), Spring Data JPA
- **Frontend:** Angular 17+ (Standalone Components), TypeScript, SCSS
- **Banco de Dados:** PostgreSQL (Supabase)
- **Deploy:** Render (backend), Vercel (frontend)

## Funcionalidades

- **Autenticação JWT** — Login seguro com token de 24h
- **Calculadora de TMB/TDEE** — Fórmula Mifflin-St Jeor com 5 níveis de atividade
- **Histórico de Cálculos** — Salvar, consultar e limpar histórico
- **Montador de Treino** — Plano semanal com exercícios, séries, repetições e carga
- **Banco de Exercícios** — 9 grupos musculares com variações
- **Dashboard** — 4 cards (2 ativos, 2 planejados para o futuro)

## Estrutura do Projeto

```
project-aws-kiro/
├── nutrix-backend/          # Backend Spring Boot
│   ├── src/main/java/com/nutrix/
│   │   ├── auth/            # Autenticação JWT
│   │   ├── config/          # Configurações Spring
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
├── ARCHITECTURE.md          # Documentação técnica e arquitetura
└── TESTING_GUIDE.md         # Guia de testes com roteiro completo
```

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

## Documentação

| Arquivo | Conteúdo |
|---------|----------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitetura técnica, módulos, endpoints, banco de dados, segurança e deploy |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | Roteiro de testes, URLs, credenciais e exemplos de curl |

## Licença

Projeto em desenvolvimento.

# NUTRIX - Arquitetura e Documentação Técnica

## Visão Geral

O NUTRIX é uma aplicação monorepo com backend Java/Spring Boot e frontend Angular, conectados a um banco PostgreSQL gerenciado pelo Supabase. O deploy é feito no Render (backend via Docker) e Vercel (frontend).

---

## Backend

### Stack
- **Java 17** + **Spring Boot 3.2.5**
- **Spring Security** com JWT (JJWT 0.12.5)
- **Spring Data JPA** + Hibernate
- **PostgreSQL** (Supabase)
- **Lombok** para redução de boilerplate
- **Bean Validation** para validação de entrada

### Módulos

| Módulo | Pacote | Descrição |
|--------|--------|-----------|
| Auth | `com.nutrix.auth` | Login JWT, filtro de autenticação, log de falhas |
| Config | `com.nutrix.config` | SecurityConfig, JwtConfig, GlobalExceptionHandler |
| User | `com.nutrix.user` | Entidade User e repositório |
| TMB | `com.nutrix.tmb` | Calculadora TMB (Mifflin-St Jeor), histórico |
| Exercise | `com.nutrix.exercise` | Banco de exercícios (dados estáticos em código) |
| Workout | `com.nutrix.workout` | CRUD de planos de treino semanais |

### Endpoints da API

| Método | Endpoint | Auth | Descrição |
|--------|----------|:----:|-----------|
| POST | `/api/auth/login` | Não | Login, retorna JWT |
| GET | `/api/exercises` | Sim | Exercícios agrupados por músculo |
| POST | `/api/tmb/calculate` | Sim | Calcular TMB/TDEE |
| POST | `/api/tmb/history` | Sim | Calcular e salvar no histórico |
| GET | `/api/tmb/history` | Sim | Listar histórico |
| DELETE | `/api/tmb/history` | Sim | Limpar histórico |
| GET | `/api/workout/plans` | Sim | Listar planos |
| GET | `/api/workout/plans/latest` | Sim | Último plano |
| POST | `/api/workout/plans` | Sim | Criar plano |
| PUT | `/api/workout/plans/{id}` | Sim | Atualizar plano |
| DELETE | `/api/workout/plans/{id}` | Sim | Deletar plano |

### Autenticação

1. `POST /api/auth/login` com username/password
2. Backend valida com bcrypt, gera JWT (24h de expiração)
3. Frontend armazena token no localStorage
4. Todas as requests incluem header `Authorization: Bearer <token>`
5. `JwtAuthenticationFilter` valida o token em cada request

### Exercícios

Os exercícios são dados estáticos definidos em `ExerciseData.java` (9 grupos musculares). Não estão no banco de dados. Para adicionar exercícios, edite esse arquivo.

---

## Frontend

### Stack
- **Angular 17+** (Standalone Components)
- **TypeScript 5.4**
- **SCSS** com CSS Variables
- **RxJS** para programação reativa

### Estrutura

```
src/app/
├── core/
│   ├── guards/          # AuthGuard
│   ├── interceptors/    # JWT Interceptor
│   └── services/        # Auth, TMB, Workout, Exercise, Toast
├── features/
│   ├── login/           # Tela de login
│   ├── dashboard/       # Dashboard com cards
│   ├── tmb-calculator/  # Calculadora + Histórico TMB
│   └── workout-builder/ # Montador de treino + Exercise Picker
└── shared/
    └── components/      # Navbar, Toast
```

### Rotas

| Rota | Componente | Protegida |
|------|-----------|:---------:|
| `/login` | LoginComponent | Não |
| `/dashboard` | DashboardComponent | Sim |
| `/tmb` | TmbCalculatorComponent | Sim |
| `/tmb/history` | TmbHistoryComponent | Sim |
| `/workout` | WorkoutBuilderComponent | Sim |

### Design System

- **Cor primária:** `#22c55e` (verde)
- **Gradiente:** `linear-gradient(135deg, #16a34a, #22c55e)`
- **Fontes:** Poppins (headings), Roboto (body)
- **Responsivo:** Mobile-first, breakpoint em 768px

---

## Banco de Dados

### Tabelas

| Tabela | Descrição |
|--------|-----------|
| `users` | Usuários (id, username, email, password, fullName) |
| `tmb_history` | Histórico de cálculos TMB |
| `workout_plans` | Planos de treino (vinculados ao usuário) |
| `workout_days` | Dias da semana dentro de um plano |
| `exercise_entries` | Exercícios dentro de um dia (séries, reps, carga) |
| `auth_failure_log` | Log de tentativas de login falhas |

### Migrations

- **V1** (`schema.sql`): Schema inicial completo
- **V2** (`migrations/V2__remove_exercise_tables.sql`): Remove tabelas de exercícios do banco (agora gerenciados em código), adiciona `exercise_name` e `exercise_variation_name` em `exercise_entries`

---

## Segurança

- Senhas com hash bcrypt
- JWT com HMAC-SHA256, expiração de 24h
- CORS configurável via variável `CORS_ALLOWED_ORIGINS`
- Validação de entrada em todos os endpoints
- Dados isolados por usuário (userId em todas as queries)
- Log de tentativas de login falhas com IP

---

## Deploy

### Backend (Render)

- **Tipo:** Web Service com Docker
- **Root Directory:** `nutrix-backend`
- **Dockerfile:** `./nutrix-backend/Dockerfile`
- **Variáveis de ambiente:**

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | JDBC URL do Supabase (pooler) |
| `DATABASE_USERNAME` | Username do banco |
| `DATABASE_PASSWORD` | Senha do banco |
| `JWT_SECRET` | Chave secreta para JWT |
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `CORS_ALLOWED_ORIGINS` | Domínios permitidos |

### Frontend (Vercel)

- **Root Directory:** `nutrix-frontend`
- **Build Command:** `npm run build -- --configuration production`
- **Output Directory:** `dist/nutrix-frontend`
- O `environment.prod.ts` aponta para a URL do Render
- O `vercel.json` configura rewrite para SPA routing

### Banco (Supabase)

- Conexão via Session Pooler (IPv4): `aws-1-sa-east-1.pooler.supabase.com:5432`
- Username no formato: `postgres.<project-ref>`

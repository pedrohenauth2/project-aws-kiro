# Design Document — NUTRIX

## Overview

NUTRIX é uma aplicação web de saúde e condicionamento físico composta por:

- **Backend**: Java 17+ com Spring Boot 3.x, expondo uma API REST protegida por JWT via Spring Security.
- **Frontend**: Angular 17+ (standalone components), consumindo a API REST.
- **Banco de dados**: Supabase (PostgreSQL gerenciado), com schema definido em `schema.sql`.

A aplicação oferece ao usuário autenticado:
1. **Calculadora de TMB/TDEE** — cálculo pela fórmula Mifflin-St Jeor com histórico persistido.
2. **Montador de Treino de Musculação** — criação e edição de planos semanais com exercícios do banco de dados.
3. **Dashboard** — tela central com cards de navegação para funcionalidades ativas e indicação visual de funcionalidades futuras.

### Decisões de Design

| Decisão | Escolha | Justificativa |
|---|---|---|
| Autenticação | JWT stateless via Spring Security | Sem estado no servidor; escalável; compatível com SPA Angular |
| Banco de dados | Supabase (PostgreSQL) | Gerenciado, com RLS nativa, schema já definido em `schema.sql` |
| Cálculo TMB | Exclusivamente no backend | Garante consistência, auditabilidade e facilita testes unitários |
| Persistência de credenciais | Variáveis de ambiente | Nunca hardcoded; compatível com ambientes de CI/CD |
| Hash de senha | BCrypt | Padrão da indústria, suportado nativamente pelo Spring Security |

---

## Architecture

### Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                        │
│                    Angular SPA (porta 4200)                     │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  Login   │  │  Dashboard   │  │  TMB / Workout Builder   │  │
│  └──────────┘  └──────────────┘  └──────────────────────────┘  │
│         │              │                       │                │
│         └──────────────┴───────────────────────┘                │
│                        HTTP + JWT (HTTPS)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Spring Boot — porta 8080)            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Spring Security Filter Chain           │   │
│  │  JwtAuthenticationFilter → SecurityContextHolder        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ AuthController│  │TmbController │  │WorkoutController     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │              │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────────▼───────────┐  │
│  │  AuthService │  │  TmbService  │  │  WorkoutService      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │              │
│  ┌──────▼─────────────────▼──────────────────────▼───────────┐  │
│  │                  Repository Layer (Spring Data JPA)        │  │
│  └──────────────────────────────┬─────────────────────────────┘  │
└─────────────────────────────────┼───────────────────────────────┘
                                  │ JDBC / PostgreSQL Driver
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                  SUPABASE (PostgreSQL)                          │
│  users │ tmb_history │ workout_plans │ workout_days │           │
│  exercise_entries │ exercises │ exercise_variations │           │
│  muscle_groups │ auth_failure_log                               │
└─────────────────────────────────────────────────────────────────┘
```

### Fluxo de Autenticação

```
Angular                    Spring Boot                  Supabase
  │                             │                           │
  │── POST /api/auth/login ────►│                           │
  │   {username, password}      │── SELECT users WHERE ────►│
  │                             │   username = ?            │
  │                             │◄── user row ──────────────│
  │                             │                           │
  │                             │ BCrypt.verify(password)   │
  │                             │ JwtUtil.generate(userId)  │
  │◄── 200 {token, expiresIn} ──│                           │
  │                             │                           │
  │── GET /api/tmb/history ────►│                           │
  │   Authorization: Bearer JWT │ JwtAuthFilter.validate()  │
  │                             │── SELECT tmb_history ────►│
  │◄── 200 [{...}, {...}] ──────│◄── rows ──────────────────│
```

---

## Components and Interfaces

### Backend — Estrutura de Pacotes

```
com.nutrix
├── config/
│   ├── SecurityConfig.java          # Spring Security + CORS
│   └── JwtConfig.java               # Propriedades JWT (secret, expiration)
├── auth/
│   ├── AuthController.java          # POST /api/auth/login
│   ├── AuthService.java             # Lógica de autenticação
│   ├── JwtUtil.java                 # Geração e validação de JWT
│   └── JwtAuthenticationFilter.java # Filtro de requisições
├── user/
│   ├── User.java                    # Entidade JPA
│   └── UserRepository.java          # Spring Data JPA
├── tmb/
│   ├── TmbController.java           # POST /api/tmb/calculate, GET /api/tmb/history, POST /api/tmb/history
│   ├── TmbService.java              # Cálculo Mifflin-St Jeor + persistência
│   ├── TmbHistory.java              # Entidade JPA
│   ├── TmbHistoryRepository.java    # Spring Data JPA
│   └── dto/
│       ├── TmbRequestDto.java
│       └── TmbResponseDto.java
├── workout/
│   ├── WorkoutController.java       # CRUD /api/workout/plans
│   ├── WorkoutService.java          # Lógica de negócio
│   ├── WorkoutPlan.java             # Entidade JPA
│   ├── WorkoutDay.java              # Entidade JPA
│   ├── ExerciseEntry.java           # Entidade JPA
│   ├── WorkoutPlanRepository.java
│   ├── WorkoutDayRepository.java
│   ├── ExerciseEntryRepository.java
│   └── dto/
│       ├── WorkoutPlanDto.java
│       ├── WorkoutDayDto.java
│       └── ExerciseEntryDto.java
└── exercise/
    ├── ExerciseController.java      # GET /api/exercises, GET /api/exercises?muscleGroupId=
    ├── ExerciseService.java
    ├── Exercise.java                # Entidade JPA
    ├── ExerciseVariation.java       # Entidade JPA
    ├── MuscleGroup.java             # Entidade JPA
    ├── ExerciseRepository.java
    ├── MuscleGroupRepository.java
    └── dto/
        ├── ExerciseDto.java
        └── MuscleGroupWithExercisesDto.java
```

### API REST — Endpoints

#### Autenticação

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| POST | `/api/auth/login` | ❌ | Login com username/password → retorna JWT |

**Request Body:**
```json
{ "username": "string", "password": "string" }
```
**Response 200:**
```json
{ "token": "eyJ...", "expiresIn": 86400, "username": "string", "fullName": "string" }
```
**Response 401:**
```json
{ "error": "Credenciais inválidas" }
```

#### TMB

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| POST | `/api/tmb/calculate` | ✅ JWT | Calcula TMB e TDEE (sem persistir) |
| POST | `/api/tmb/history` | ✅ JWT | Salva resultado no histórico |
| GET | `/api/tmb/history` | ✅ JWT | Lista histórico do usuário autenticado |

**POST /api/tmb/calculate — Request:**
```json
{
  "weightKg": 75.0,
  "heightCm": 175.0,
  "ageYears": 30,
  "biologicalSex": "MALE",
  "activityLevel": "MODERATELY_ACTIVE"
}
```
**Response 200:**
```json
{ "tmbKcal": 1756.25, "tdeeKcal": 2722.19 }
```

**GET /api/tmb/history — Response 200:**
```json
[
  {
    "id": 1,
    "weightKg": 75.0,
    "heightCm": 175.0,
    "ageYears": 30,
    "biologicalSex": "MALE",
    "activityLevel": "MODERATELY_ACTIVE",
    "tmbKcal": 1756.25,
    "tdeeKcal": 2722.19,
    "calculatedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Exercícios

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/api/exercises` | ✅ JWT | Todos os exercícios agrupados por grupo muscular |
| GET | `/api/exercises?muscleGroupId={id}` | ✅ JWT | Exercícios filtrados por grupo muscular |

#### Planos de Treino

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/api/workout/plans` | ✅ JWT | Lista planos do usuário (mais recente primeiro) |
| GET | `/api/workout/plans/latest` | ✅ JWT | Plano mais recente do usuário |
| POST | `/api/workout/plans` | ✅ JWT | Cria novo plano de treino |
| PUT | `/api/workout/plans/{id}` | ✅ JWT | Atualiza plano existente |
| DELETE | `/api/workout/plans/{id}` | ✅ JWT | Remove plano |
| POST | `/api/workout/plans/{planId}/days/{dayId}/entries` | ✅ JWT | Adiciona exercício ao dia |
| PUT | `/api/workout/plans/{planId}/days/{dayId}/entries/{entryId}` | ✅ JWT | Edita entrada de exercício |
| DELETE | `/api/workout/plans/{planId}/days/{dayId}/entries/{entryId}` | ✅ JWT | Remove entrada de exercício |

### Frontend — Estrutura de Módulos Angular

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts            # Redireciona para /login se não autenticado
│   ├── interceptors/
│   │   └── jwt.interceptor.ts       # Injeta Authorization header em todas as requisições
│   └── services/
│       ├── auth.service.ts          # Login, logout, armazenamento de token
│       ├── tmb.service.ts           # Chamadas à API de TMB
│       ├── workout.service.ts       # Chamadas à API de treino
│       └── exercise.service.ts     # Chamadas à API de exercícios
├── features/
│   ├── login/
│   │   ├── login.component.ts
│   │   └── login.component.html
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   ├── dashboard.component.html
│   │   └── feature-card/
│   │       ├── feature-card.component.ts
│   │       └── feature-card.component.html
│   ├── tmb-calculator/
│   │   ├── tmb-calculator.component.ts
│   │   ├── tmb-calculator.component.html
│   │   └── tmb-history/
│   │       ├── tmb-history.component.ts
│   │       └── tmb-history.component.html
│   └── workout-builder/
│       ├── workout-builder.component.ts
│       ├── workout-builder.component.html
│       ├── workout-day/
│       │   ├── workout-day.component.ts
│       │   └── workout-day.component.html
│       └── exercise-picker/
│           ├── exercise-picker.component.ts
│           └── exercise-picker.component.html
└── app.routes.ts                    # Rotas com AuthGuard
```

### Rotas Angular

```typescript
const routes: Routes = [
  { path: 'login',     component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent,     canActivate: [AuthGuard] },
  { path: 'tmb',       component: TmbCalculatorComponent, canActivate: [AuthGuard] },
  { path: 'workout',   component: WorkoutBuilderComponent, canActivate: [AuthGuard] },
  { path: '',          redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**',        redirectTo: 'dashboard' }
];
```

---

## Data Models

### Entidades JPA (Backend)

#### User
```java
@Entity @Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;   // UNIQUE NOT NULL
    private String email;      // UNIQUE NOT NULL
    private String password;   // BCrypt hash
    private String fullName;
    private Instant createdAt;
    private Instant updatedAt;
}
```

#### TmbHistory
```java
@Entity @Table(name = "tmb_history")
public class TmbHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "user_id")
    private User user;
    private BigDecimal weightKg;
    private BigDecimal heightCm;
    private Integer ageYears;
    private String biologicalSex;   // "MALE" | "FEMALE"
    private String activityLevel;   // enum string
    private BigDecimal tmbKcal;
    private BigDecimal tdeeKcal;
    private Instant calculatedAt;
}
```

#### WorkoutPlan / WorkoutDay / ExerciseEntry
```java
@Entity @Table(name = "workout_plans")
public class WorkoutPlan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "user_id")
    private User user;
    private String name;
    private Instant createdAt;
    private Instant updatedAt;
    @OneToMany(mappedBy = "workoutPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkoutDay> days;
}

@Entity @Table(name = "workout_days")
public class WorkoutDay {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "workout_plan_id")
    private WorkoutPlan workoutPlan;
    private Integer dayOfWeek;   // 1=Segunda ... 7=Domingo
    private String label;
    @OneToMany(mappedBy = "workoutDay", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExerciseEntry> entries;
}

@Entity @Table(name = "exercise_entries")
public class ExerciseEntry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "workout_day_id")
    private WorkoutDay workoutDay;
    @ManyToOne @JoinColumn(name = "exercise_id")
    private Exercise exercise;
    @ManyToOne @JoinColumn(name = "exercise_variation_id")
    private ExerciseVariation exerciseVariation;  // nullable
    private Integer sets;
    private Integer reps;
    private BigDecimal weightKg;  // nullable
    private Integer sortOrder;
    private String notes;
}
```

#### Exercise / ExerciseVariation / MuscleGroup
```java
@Entity @Table(name = "muscle_groups")
public class MuscleGroup {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @OneToMany(mappedBy = "muscleGroup")
    private List<Exercise> exercises;
}

@Entity @Table(name = "exercises")
public class Exercise {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "muscle_group_id")
    private MuscleGroup muscleGroup;
    private String name;
    private String description;
    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL)
    private List<ExerciseVariation> variations;
}

@Entity @Table(name = "exercise_variations")
public class ExerciseVariation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "exercise_id")
    private Exercise exercise;
    private String name;
}
```

### Enums de Domínio

```java
public enum BiologicalSex { MALE, FEMALE }

public enum ActivityLevel {
    SEDENTARY(1.2),
    LIGHTLY_ACTIVE(1.375),
    MODERATELY_ACTIVE(1.55),
    VERY_ACTIVE(1.725),
    EXTREMELY_ACTIVE(1.9);

    private final double factor;
    ActivityLevel(double factor) { this.factor = factor; }
    public double getFactor() { return factor; }
}
```

### Fórmula Mifflin-St Jeor (implementação de referência)

```
TMB (MALE)   = (10 × weightKg) + (6.25 × heightCm) − (5 × ageYears) + 5
TMB (FEMALE) = (10 × weightKg) + (6.25 × heightCm) − (5 × ageYears) − 161
TDEE         = TMB × activityLevel.getFactor()
```

### Configuração de Ambiente (application.properties / variáveis de ambiente)

```properties
# Supabase / PostgreSQL
spring.datasource.url=${SUPABASE_DB_URL}
spring.datasource.username=${SUPABASE_DB_USER}
spring.datasource.password=${SUPABASE_DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration-ms=86400000
```

---

## Correctness Properties

*Uma propriedade é uma característica ou comportamento que deve ser verdadeiro em todas as execuções válidas de um sistema — essencialmente, uma declaração formal sobre o que o sistema deve fazer. Propriedades servem como ponte entre especificações legíveis por humanos e garantias de corretude verificáveis por máquina.*

### Property 1: Cálculo de TMB — Fórmula Mifflin-St Jeor

*Para qualquer* combinação válida de peso (> 0), altura (> 0), idade (1–120) e sexo biológico, o valor de TMB calculado pelo backend deve ser exatamente igual ao resultado da fórmula Mifflin-St Jeor aplicada manualmente aos mesmos parâmetros.

**Validates: Requirements 3.3**

### Property 2: Cálculo de TDEE — Multiplicação pelo fator de atividade

*Para qualquer* valor de TMB calculado e qualquer nível de atividade física válido, o TDEE deve ser exatamente igual a `TMB × activityLevel.getFactor()`, sem arredondamento intermediário.

**Validates: Requirements 3.4**

### Property 3: Rejeição de entradas inválidas na TMB

*Para qualquer* entrada com peso ≤ 0, altura ≤ 0, idade ≤ 0 ou idade > 120, o sistema deve rejeitar o cálculo e retornar um erro descritivo, sem produzir nenhum resultado numérico.

**Validates: Requirements 3.6**

### Property 4: Isolamento de histórico por usuário

*Para qualquer* usuário autenticado, a lista de registros de histórico de TMB retornada deve conter exclusivamente registros cujo `user_id` corresponde ao usuário autenticado — nunca registros de outros usuários.

**Validates: Requirements 4.4**

### Property 5: Round-trip de persistência do histórico de TMB

*Para qualquer* conjunto válido de parâmetros de entrada de TMB, após salvar o resultado no histórico e consultá-lo, o registro recuperado deve conter exatamente os mesmos valores de TMB, TDEE e dados de entrada originais.

**Validates: Requirements 3.8, 4.2**

### Property 6: Rejeição de Exercise_Entry com séries ou repetições inválidas

*Para qualquer* Exercise_Entry com número de séries ≤ 0 ou número de repetições ≤ 0, o sistema deve rejeitar a operação e não persistir o registro.

**Validates: Requirements 6.3**

### Property 7: Isolamento de Workout_Plans por usuário

*Para qualquer* usuário autenticado, todos os Workout_Plans retornados pela API devem pertencer exclusivamente a esse usuário — nenhum plano de outro usuário deve ser exposto.

**Validates: Requirements 6.12**

### Property 8: Proteção de endpoints autenticados

*Para qualquer* requisição a um endpoint protegido sem JWT válido (ausente, expirado ou malformado), o sistema deve retornar HTTP 401 e não processar a requisição.

**Validates: Requirements 1.4, 1.5, 8.1**

---

## Error Handling

### Estratégia Global — Spring Boot

Um `@RestControllerAdvice` centralizado trata todas as exceções e retorna respostas padronizadas:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Peso deve ser maior que zero",
  "path": "/api/tmb/calculate"
}
```

### Mapeamento de Exceções

| Exceção | HTTP Status | Mensagem ao cliente |
|---------|-------------|---------------------|
| `BadCredentialsException` | 401 | "Credenciais inválidas" (genérica — não revela qual campo está errado) |
| `ExpiredJwtException` | 401 | "Token expirado" |
| `JwtException` | 401 | "Token inválido" |
| `ValidationException` (entrada TMB) | 400 | Mensagem descritiva do campo inválido |
| `ValidationException` (Exercise_Entry) | 400 | "Séries e repetições devem ser maiores que zero" |
| `EntityNotFoundException` | 404 | "Recurso não encontrado" |
| `AccessDeniedException` | 403 | "Acesso negado" |
| `Exception` (genérica) | 500 | "Erro interno do servidor" |

### Registro de Falhas de Autenticação

Toda tentativa de login malsucedida é registrada na tabela `auth_failure_log` com:
- `username_attempted` (nunca a senha)
- `attempted_at`
- `ip_address` (extraído do `HttpServletRequest`)

### Validação de Entrada

- **Backend**: Bean Validation (`@NotNull`, `@Positive`, `@Max(120)`) nos DTOs + validação customizada no `TmbService`.
- **Frontend**: Reactive Forms com validadores Angular antes de enviar a requisição.

---

## Testing Strategy

### Abordagem Dual

A estratégia combina testes unitários com exemplos concretos e testes baseados em propriedades (PBT) para cobertura abrangente.

### Testes Unitários (Backend — JUnit 5 + Mockito)

- `TmbServiceTest`: exemplos concretos de cálculo para ambos os sexos e todos os níveis de atividade.
- `AuthServiceTest`: cenários de login válido, senha incorreta, usuário inexistente.
- `WorkoutServiceTest`: criação, edição, remoção de planos e entradas; validação de séries/repetições.
- `JwtUtilTest`: geração, validação, expiração de tokens.
- `GlobalExceptionHandlerTest`: mapeamento correto de exceções para status HTTP.

### Testes Baseados em Propriedades (Backend — jqwik)

A biblioteca escolhida é **[jqwik](https://jqwik.net/)** (Java, integração nativa com JUnit 5), configurada com mínimo de **100 iterações** por propriedade.

Cada teste de propriedade deve ser anotado com:
```java
// Feature: nutrix-app, Property N: <texto da propriedade>
```

| Propriedade | Classe de Teste | Geradores |
|---|---|---|
| Property 1: Fórmula Mifflin-St Jeor | `TmbCalculationPropertyTest` | `@ForAll @Positive double weight`, `@ForAll @Positive double height`, `@ForAll @IntRange(min=1, max=120) int age`, `@ForAll BiologicalSex sex` |
| Property 2: TDEE = TMB × fator | `TmbCalculationPropertyTest` | `@ForAll @Positive double tmb`, `@ForAll ActivityLevel level` |
| Property 3: Rejeição de entradas inválidas | `TmbValidationPropertyTest` | Geradores de valores inválidos (≤ 0, idade > 120) |
| Property 4: Isolamento de histórico | `TmbHistoryPropertyTest` | Múltiplos usuários com registros distintos |
| Property 5: Round-trip de persistência | `TmbHistoryPropertyTest` | Parâmetros válidos aleatórios |
| Property 6: Rejeição de séries/reps inválidas | `ExerciseEntryPropertyTest` | `@ForAll @IntRange(max=0) int sets`, `@ForAll @IntRange(max=0) int reps` |
| Property 7: Isolamento de planos por usuário | `WorkoutPlanPropertyTest` | Múltiplos usuários com planos distintos |
| Property 8: Proteção de endpoints | `SecurityPropertyTest` | Tokens ausentes, expirados, malformados |

### Testes de Integração (Backend — Spring Boot Test + Testcontainers)

- Sobe um container PostgreSQL via Testcontainers com o `schema.sql` aplicado.
- Testa o fluxo completo: login → cálculo TMB → salvar histórico → consultar histórico.
- Testa CRUD completo de Workout_Plans.
- Verifica que endpoints protegidos retornam 401 sem JWT.

### Testes de Componente (Frontend — Jest + Angular Testing Library)

- `LoginComponent`: submissão de formulário válido e inválido.
- `DashboardComponent`: renderização dos 4 cards; navegação em cards ativos; mensagem em cards bloqueados.
- `TmbCalculatorComponent`: validação de formulário; exibição de resultado; fluxo de salvar/não salvar.
- `WorkoutBuilderComponent`: adição/remoção de exercícios; carregamento do plano mais recente.

### Testes E2E (Cypress — opcional, fase futura)

- Fluxo completo de login → cálculo TMB → salvar → visualizar histórico.
- Fluxo de montagem de treino semanal.

### Configuração de PBT (jqwik)

```java
@Property(tries = 100)
// Feature: nutrix-app, Property 1: Cálculo de TMB — Fórmula Mifflin-St Jeor
void tmbCalculationMatchesMifflinStJeorFormula(
    @ForAll @DoubleRange(min = 0.1, max = 500.0) double weightKg,
    @ForAll @DoubleRange(min = 0.1, max = 300.0) double heightCm,
    @ForAll @IntRange(min = 1, max = 120) int ageYears,
    @ForAll BiologicalSex sex
) {
    double expected = sex == BiologicalSex.MALE
        ? (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) + 5
        : (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) - 161;
    double actual = tmbService.calculateTmb(weightKg, heightCm, ageYears, sex);
    assertThat(actual).isCloseTo(expected, within(0.01));
}
```

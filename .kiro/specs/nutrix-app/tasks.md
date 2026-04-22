# Tasks — NUTRIX

## Task List

- [x] 1. Setup do Projeto Backend (Spring Boot)
  - [x] 1.1 Criar projeto Spring Boot 3.x via Spring Initializr com Java 17
  - [x] 1.2 Configurar dependências no `pom.xml`: Spring Web, Spring Security, Spring Data JPA, PostgreSQL Driver, JJWT (JWT), Validation, Lombok, jqwik (PBT), Testcontainers
  - [x] 1.3 Criar estrutura de pacotes: `com.nutrix.config`, `com.nutrix.auth`, `com.nutrix.user`, `com.nutrix.tmb`, `com.nutrix.workout`, `com.nutrix.exercise`
  - [x] 1.4 Criar `application.properties` com variáveis de ambiente para Supabase (`SUPABASE_DB_URL`, `SUPABASE_DB_USER`, `SUPABASE_DB_PASSWORD`) e JWT (`JWT_SECRET`, `jwt.expiration-ms=86400000`)
  - [x] 1.5 Criar `application-test.properties` para ambiente de testes com Testcontainers (datasource apontando para container PostgreSQL)
  - [x] 1.6 Configurar `spring.jpa.hibernate.ddl-auto=validate` e `spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect`
  - [x] 1.7 Verificar que o projeto compila e sobe sem erros com as variáveis de ambiente configuradas

- [x] 2. Setup do Projeto Frontend (Angular)
  - [x] 2.1 Criar projeto Angular 17+ com `ng new nutrix-frontend --standalone --routing --style=scss`
  - [x] 2.2 Criar estrutura de pastas: `src/app/core/guards`, `src/app/core/interceptors`, `src/app/core/services`, `src/app/features/login`, `src/app/features/dashboard`, `src/app/features/tmb-calculator`, `src/app/features/workout-builder`
  - [x] 2.3 Instalar dependências adicionais: `@angular/forms`, `@angular/common/http`
  - [x] 2.4 Configurar `environment.ts` e `environment.prod.ts` com `apiUrl: 'http://localhost:8080'`
  - [x] 2.5 Configurar `app.routes.ts` com as rotas: `/login`, `/dashboard` (AuthGuard), `/tmb` (AuthGuard), `/workout` (AuthGuard), redirect `/` → `/dashboard`, wildcard → `/dashboard`
  - [x] 2.6 Configurar `provideHttpClient(withInterceptors([jwtInterceptor]))` no `app.config.ts`
  - [x] 2.7 Verificar que o projeto Angular compila sem erros com `ng build`

- [x] 3. Implementação da Autenticação (Backend)
  - [x] 3.1 Criar entidade JPA `User` (`com.nutrix.user.User`) mapeada para a tabela `users` com campos: `id`, `username`, `email`, `password`, `fullName`, `createdAt`, `updatedAt`
  - [x] 3.2 Criar `UserRepository` estendendo `JpaRepository<User, Long>` com método `findByUsername(String username): Optional<User>`
  - [x] 3.3 Criar `JwtConfig.java` em `com.nutrix.config` com `@ConfigurationProperties` lendo `jwt.secret` e `jwt.expiration-ms` das variáveis de ambiente
  - [x] 3.4 Criar `JwtUtil.java` em `com.nutrix.auth` com métodos: `generateToken(Long userId, String username): String`, `validateToken(String token): boolean`, `extractUserId(String token): Long`, `extractUsername(String token): String`
  - [x] 3.5 Criar `JwtAuthenticationFilter.java` estendendo `OncePerRequestFilter`: extrair token do header `Authorization: Bearer <token>`, validar via `JwtUtil`, popular `SecurityContextHolder`
  - [x] 3.6 Criar `SecurityConfig.java` em `com.nutrix.config`: desabilitar CSRF, configurar CORS (permitir origem `http://localhost:4200`), liberar `/api/auth/login` e bloquear todos os demais endpoints com autenticação JWT
  - [x] 3.7 Criar DTOs: `LoginRequestDto` (`username`, `password`) e `LoginResponseDto` (`token`, `expiresIn`, `username`, `fullName`)
  - [x] 3.8 Criar `AuthService.java`: buscar usuário por username, verificar senha com `BCryptPasswordEncoder`, registrar falha em `auth_failure_log` se inválido, gerar JWT se válido
  - [x] 3.9 Criar entidade `AuthFailureLog` mapeada para `auth_failure_log` e respectivo `AuthFailureLogRepository`
  - [x] 3.10 Criar `AuthController.java` com `POST /api/auth/login`: chamar `AuthService`, retornar 200 com `LoginResponseDto` ou 401 com mensagem genérica `"Credenciais inválidas"`
  - [x] 3.11 Criar `GlobalExceptionHandler.java` com `@RestControllerAdvice` tratando: `BadCredentialsException` → 401, `ExpiredJwtException` → 401, `JwtException` → 401, `MethodArgumentNotValidException` → 400, `EntityNotFoundException` → 404, `AccessDeniedException` → 403, `Exception` → 500; todos retornando JSON padronizado com `timestamp`, `status`, `error`, `message`, `path`

- [x] 4. Implementação da Calculadora de TMB (Backend)
  - [x] 4.1 Criar enum `BiologicalSex` com valores `MALE` e `FEMALE`
  - [x] 4.2 Criar enum `ActivityLevel` com valores `SEDENTARY(1.2)`, `LIGHTLY_ACTIVE(1.375)`, `MODERATELY_ACTIVE(1.55)`, `VERY_ACTIVE(1.725)`, `EXTREMELY_ACTIVE(1.9)` e método `getFactor(): double`
  - [x] 4.3 Criar `TmbRequestDto` com campos anotados com Bean Validation: `weightKg` (`@Positive`), `heightCm` (`@Positive`), `ageYears` (`@Min(1) @Max(120)`), `biologicalSex` (`@NotNull`), `activityLevel` (`@NotNull`)
  - [x] 4.4 Criar `TmbResponseDto` com campos `tmbKcal` e `tdeeKcal` (ambos `BigDecimal`)
  - [x] 4.5 Criar entidade JPA `TmbHistory` mapeada para `tmb_history` com todos os campos do schema: `id`, `user` (ManyToOne), `weightKg`, `heightCm`, `ageYears`, `biologicalSex`, `activityLevel`, `tmbKcal`, `tdeeKcal`, `calculatedAt`
  - [x] 4.6 Criar `TmbHistoryRepository` estendendo `JpaRepository<TmbHistory, Long>` com método `findByUserIdOrderByCalculatedAtDesc(Long userId): List<TmbHistory>`
  - [x] 4.7 Criar `TmbService.java` com método `calculateTmb(TmbRequestDto): TmbResponseDto` implementando a fórmula Mifflin-St Jeor: MALE = `(10 × weight) + (6.25 × height) − (5 × age) + 5`; FEMALE = `(10 × weight) + (6.25 × height) − (5 × age) − 161`; TDEE = `TMB × activityLevel.getFactor()`
  - [x] 4.8 Criar método `saveHistory(TmbRequestDto, TmbResponseDto, Long userId): TmbHistory` no `TmbService` para persistir o registro no banco
  - [x] 4.9 Criar `TmbController.java` com endpoints: `POST /api/tmb/calculate` (calcula sem persistir, retorna `TmbResponseDto`), `POST /api/tmb/history` (salva resultado), `GET /api/tmb/history` (lista histórico do usuário autenticado ordenado por data decrescente)
  - [x] 4.10 Garantir que o `TmbController` extrai o `userId` do `SecurityContextHolder` (via `Authentication`) para isolar dados por usuário

- [x] 5. Implementação do Banco de Exercícios (Backend)
  - [x] 5.1 Criar entidade JPA `MuscleGroup` mapeada para `muscle_groups` com campos `id`, `name` e relacionamento `@OneToMany` com `Exercise`
  - [x] 5.2 Criar entidade JPA `Exercise` mapeada para `exercises` com campos `id`, `muscleGroup` (ManyToOne), `name`, `description` e relacionamento `@OneToMany` com `ExerciseVariation`
  - [x] 5.3 Criar entidade JPA `ExerciseVariation` mapeada para `exercise_variations` com campos `id`, `exercise` (ManyToOne), `name`
  - [x] 5.4 Criar `MuscleGroupRepository` e `ExerciseRepository` estendendo `JpaRepository`; adicionar método `findByMuscleGroupId(Long muscleGroupId)` no `ExerciseRepository`
  - [x] 5.5 Criar `ExerciseDto` com campos `id`, `name`, `description`, `variations` (lista de `ExerciseVariationDto`)
  - [x] 5.6 Criar `MuscleGroupWithExercisesDto` com campos `id`, `name`, `exercises` (lista de `ExerciseDto`)
  - [x] 5.7 Criar `ExerciseService.java` com métodos: `getAllGroupedByMuscleGroup(): List<MuscleGroupWithExercisesDto>` e `getByMuscleGroup(Long muscleGroupId): List<ExerciseDto>`
  - [x] 5.8 Criar `ExerciseController.java` com endpoints: `GET /api/exercises` (todos agrupados por grupo muscular) e `GET /api/exercises?muscleGroupId={id}` (filtrado por grupo); ambos protegidos por JWT

- [x] 6. Implementação do Montador de Treino (Backend)
  - [x] 6.1 Criar entidade JPA `WorkoutPlan` mapeada para `workout_plans` com campos `id`, `user` (ManyToOne), `name`, `createdAt`, `updatedAt` e relacionamento `@OneToMany(cascade = ALL, orphanRemoval = true)` com `WorkoutDay`
  - [x] 6.2 Criar entidade JPA `WorkoutDay` mapeada para `workout_days` com campos `id`, `workoutPlan` (ManyToOne), `dayOfWeek` (1–7), `label` e relacionamento `@OneToMany(cascade = ALL, orphanRemoval = true)` com `ExerciseEntry`
  - [x] 6.3 Criar entidade JPA `ExerciseEntry` mapeada para `exercise_entries` com campos `id`, `workoutDay` (ManyToOne), `exercise` (ManyToOne), `exerciseVariation` (ManyToOne, nullable), `sets`, `reps`, `weightKg` (nullable), `sortOrder`, `notes`
  - [x] 6.4 Criar `WorkoutPlanRepository` com método `findByUserIdOrderByUpdatedAtDesc(Long userId): List<WorkoutPlan>` e `findFirstByUserIdOrderByUpdatedAtDesc(Long userId): Optional<WorkoutPlan>`
  - [x] 6.5 Criar `WorkoutDayRepository` e `ExerciseEntryRepository` estendendo `JpaRepository`
  - [x] 6.6 Criar DTOs: `WorkoutPlanDto`, `WorkoutDayDto`, `ExerciseEntryDto` com validações Bean Validation (`sets @Positive`, `reps @Positive`)
  - [x] 6.7 Criar `WorkoutService.java` com métodos: `getLatestPlan(Long userId)`, `getAllPlans(Long userId)`, `createPlan(WorkoutPlanDto, Long userId)`, `updatePlan(Long planId, WorkoutPlanDto, Long userId)`, `deletePlan(Long planId, Long userId)`, `addEntry(Long planId, Long dayId, ExerciseEntryDto, Long userId)`, `updateEntry(Long planId, Long dayId, Long entryId, ExerciseEntryDto, Long userId)`, `deleteEntry(Long planId, Long dayId, Long entryId, Long userId)`
  - [x] 6.8 Garantir no `WorkoutService` que operações de escrita/leitura verificam que o `WorkoutPlan` pertence ao `userId` autenticado (lançar `AccessDeniedException` ou `EntityNotFoundException` caso contrário)
  - [x] 6.9 Criar `WorkoutController.java` com todos os endpoints CRUD definidos no design: `GET /api/workout/plans`, `GET /api/workout/plans/latest`, `POST /api/workout/plans`, `PUT /api/workout/plans/{id}`, `DELETE /api/workout/plans/{id}`, `POST /api/workout/plans/{planId}/days/{dayId}/entries`, `PUT /api/workout/plans/{planId}/days/{dayId}/entries/{entryId}`, `DELETE /api/workout/plans/{planId}/days/{dayId}/entries/{entryId}`; todos protegidos por JWT

- [x] 7. Implementação do Frontend Angular — Autenticação
  - [x] 7.1 Criar `AuthService` (`core/services/auth.service.ts`) com métodos: `login(username, password): Observable<LoginResponse>`, `logout(): void`, `getToken(): string | null`, `isAuthenticated(): boolean`, `getUsername(): string | null`; armazenar token no `localStorage`
  - [x] 7.2 Criar `JwtInterceptor` (`core/interceptors/jwt.interceptor.ts`) como função interceptora funcional: adicionar header `Authorization: Bearer <token>` em todas as requisições quando o token estiver presente
  - [x] 7.3 Criar `AuthGuard` (`core/guards/auth.guard.ts`) como função guard: verificar `AuthService.isAuthenticated()`, redirecionar para `/login` se não autenticado
  - [x] 7.4 Criar `LoginComponent` (`features/login/`) como standalone component com Reactive Form: campos `username` e `password` com validação `required`; chamar `AuthService.login()` ao submeter; redirecionar para `/dashboard` em caso de sucesso; exibir mensagem de erro em caso de falha (401)
  - [x] 7.5 Criar template HTML do `LoginComponent` com formulário acessível (labels, aria-attributes), botão de submit e área de exibição de erros

- [x] 8. Implementação do Frontend Angular — Dashboard
  - [x] 8.1 Criar `FeatureCardComponent` (`features/dashboard/feature-card/`) como standalone component com inputs: `title: string`, `description: string`, `icon: string`, `active: boolean`, `route: string`; emitir evento `(cardClick)` ao ser clicado
  - [x] 8.2 Criar template HTML do `FeatureCardComponent`: exibir ícone, título, descrição; quando `active = false`, exibir ícone de cadeado e badge "Em breve"; aplicar classes CSS distintas para cards ativos e bloqueados
  - [x] 8.3 Criar `DashboardComponent` (`features/dashboard/`) como standalone component: exibir nome do usuário autenticado (via `AuthService`); renderizar exatamente 4 `FeatureCardComponent`; navegar para `/tmb` e `/workout` nos cards ativos; exibir mensagem "Funcionalidade disponível em breve" (sem navegar) nos cards bloqueados
  - [x] 8.4 Criar template HTML do `DashboardComponent` com grid de 4 cards, header com nome do usuário e botão de logout

- [x] 9. Implementação do Frontend Angular — Calculadora de TMB
  - [x] 9.1 Criar `TmbService` (`core/services/tmb.service.ts`) com métodos: `calculate(request: TmbRequest): Observable<TmbResponse>`, `saveHistory(request: TmbRequest, response: TmbResponse): Observable<TmbHistory>`, `getHistory(): Observable<TmbHistory[]>`
  - [x] 9.2 Criar `TmbCalculatorComponent` (`features/tmb-calculator/`) como standalone component com Reactive Form: campos `weightKg` (`required, min: 0.1`), `heightCm` (`required, min: 0.1`), `ageYears` (`required, min: 1, max: 120`), `biologicalSex` (`required`), `activityLevel` (`required`)
  - [x] 9.3 Implementar lógica do `TmbCalculatorComponent`: ao submeter formulário válido, chamar `TmbService.calculate()`; exibir resultado (TMB e TDEE em kcal com 2 casas decimais); perguntar ao usuário se deseja salvar; chamar `TmbService.saveHistory()` se confirmado
  - [x] 9.4 Criar template HTML do `TmbCalculatorComponent` com formulário acessível, seletor de sexo biológico, dropdown de nível de atividade, área de resultado e botões "Salvar" / "Não salvar"
  - [x] 9.5 Criar `TmbHistoryComponent` (`features/tmb-calculator/tmb-history/`) como standalone component: chamar `TmbService.getHistory()` no `ngOnInit`; exibir lista de registros com data, TMB, TDEE e dados de entrada; exibir mensagem "Nenhum histórico encontrado" quando lista vazia

- [x] 10. Implementação do Frontend Angular — Montador de Treino
  - [x] 10.1 Criar `ExerciseService` (`core/services/exercise.service.ts`) com métodos: `getAllGrouped(): Observable<MuscleGroupWithExercises[]>`, `getByMuscleGroup(id: number): Observable<Exercise[]>`
  - [x] 10.2 Criar `WorkoutService` (`core/services/workout.service.ts`) com métodos para todos os endpoints CRUD de planos de treino
  - [x] 10.3 Criar `ExercisePickerComponent` (`features/workout-builder/exercise-picker/`) como standalone component: exibir grupos musculares como abas ou dropdown; listar exercícios do grupo selecionado com suas variações; emitir evento `(exerciseSelected)` com o exercício escolhido
  - [x] 10.4 Criar `WorkoutDayComponent` (`features/workout-builder/workout-day/`) como standalone component: receber `day: WorkoutDay` como input; exibir lista de `ExerciseEntry` do dia; permitir adicionar entrada via `ExercisePickerComponent`; permitir editar séries, repetições e carga de cada entrada; permitir remover entradas individuais
  - [x] 10.5 Criar `WorkoutBuilderComponent` (`features/workout-builder/`) como standalone component: carregar plano mais recente via `WorkoutService.getLatestPlan()` no `ngOnInit`; exibir 7 abas (Segunda a Domingo) com `WorkoutDayComponent` para cada dia; botão "Salvar Treino" que chama `WorkoutService.createPlan()` ou `updatePlan()` conforme existência de plano; botão "Novo Treino" para criar plano em branco
  - [x] 10.6 Criar template HTML do `WorkoutBuilderComponent` com navegação por abas dos dias da semana, área de exercícios por dia e controles de salvar/novo treino

- [-] 11. Testes Unitários do Backend
  - [x] 11.1 Criar `TmbServiceTest` com JUnit 5 + Mockito: testar cálculo correto para sexo masculino com todos os 5 níveis de atividade; testar cálculo correto para sexo feminino com todos os 5 níveis de atividade; testar que `saveHistory` persiste o registro com os valores corretos
  - [ ] 11.2 Criar `AuthServiceTest` com JUnit 5 + Mockito: testar login com credenciais válidas retorna JWT; testar login com senha incorreta lança `BadCredentialsException`; testar login com usuário inexistente lança `BadCredentialsException`; testar que falha de login registra entrada em `auth_failure_log`
  - [ ] 11.3 Criar `JwtUtilTest` com JUnit 5: testar geração de token retorna string não nula; testar que token gerado é válido imediatamente após geração; testar que token expirado é inválido; testar extração correta de `userId` e `username` do token
  - [ ] 11.4 Criar `WorkoutServiceTest` com JUnit 5 + Mockito: testar criação de plano vincula ao usuário correto; testar que `updatePlan` com `userId` diferente do dono lança exceção; testar que `deletePlan` com `userId` diferente do dono lança exceção; testar que `addEntry` com `sets <= 0` lança `ValidationException`; testar que `addEntry` com `reps <= 0` lança `ValidationException`
  - [ ] 11.5 Criar `GlobalExceptionHandlerTest` com `@WebMvcTest`: testar que `BadCredentialsException` retorna 401 com mensagem genérica; testar que `MethodArgumentNotValidException` retorna 400 com mensagem descritiva; testar que `EntityNotFoundException` retorna 404; testar que `Exception` genérica retorna 500

- [~] 12. Testes Baseados em Propriedades (jqwik — Backend)
  - [ ] 12.1 Criar `TmbCalculationPropertyTest` — Property 1: para qualquer `weightKg ∈ (0.1, 500]`, `heightCm ∈ (0.1, 300]`, `ageYears ∈ [1, 120]` e `BiologicalSex`, o resultado de `TmbService.calculateTmb()` deve ser exatamente igual ao resultado da fórmula Mifflin-St Jeor aplicada manualmente; anotar com `@Property(tries = 100)` e comentário `// Feature: nutrix-app, Property 1: Cálculo de TMB — Fórmula Mifflin-St Jeor` — **Validates: Requirements 3.3**
  - [ ] 12.2 Criar `TmbCalculationPropertyTest` — Property 2: para qualquer `tmb > 0` e qualquer `ActivityLevel`, o TDEE calculado deve ser exatamente `tmb × activityLevel.getFactor()` sem arredondamento intermediário; anotar com `@Property(tries = 100)` e comentário `// Feature: nutrix-app, Property 2: Cálculo de TDEE — Multiplicação pelo fator de atividade` — **Validates: Requirements 3.4**
  - [ ] 12.3 Criar `TmbValidationPropertyTest` — Property 3: para qualquer entrada com `weightKg ≤ 0`, `heightCm ≤ 0`, `ageYears ≤ 0` ou `ageYears > 120`, o sistema deve rejeitar o cálculo e lançar exceção de validação sem produzir resultado numérico; anotar com `@Property(tries = 100)` e comentário `// Feature: nutrix-app, Property 3: Rejeição de entradas inválidas na TMB` — **Validates: Requirements 3.6**
  - [ ] 12.4 Criar `TmbHistoryPropertyTest` — Property 4: para qualquer conjunto de registros de TMB salvos por dois usuários distintos, a consulta de histórico de cada usuário deve retornar exclusivamente seus próprios registros (nenhum `user_id` diferente do autenticado); anotar com `@Property(tries = 100)` e comentário `// Feature: nutrix-app, Property 4: Isolamento de histórico por usuário` — **Validates: Requirements 4.4**
  - [ ] 12.5 Criar `TmbHistoryPropertyTest` — Property 5: para qualquer conjunto válido de parâmetros de TMB, após salvar e consultar o histórico, o registro recuperado deve conter exatamente os mesmos valores de TMB, TDEE e dados de entrada originais (round-trip de persistência); anotar com `@Property(tries = 100)` e comentário `// Feature: nutrix-app, Property 5: Round-trip de persistência do histórico de TMB` — **Validates: Requirements 3.8, 4.2**
  - [ ] 12.6 Criar `ExerciseEntryPropertyTest` — Property 6: para qualquer `ExerciseEntry` com `sets ≤ 0` ou `reps ≤ 0`, o sistema deve rejeitar a operação e não persistir o registro; anotar com `@Property(tries = 100)` e comentário `// Feature: nutrix-app, Property 6: Rejeição de Exercise_Entry com séries ou repetições inválidas` — **Validates: Requirements 6.3**
  - [ ] 12.7 Criar `WorkoutPlanPropertyTest` — Property 7: para qualquer conjunto de planos de treino criados por dois usuários distintos, a API deve retornar para cada usuário exclusivamente seus próprios planos (nenhum plano de outro usuário exposto); anotar com `@Property(tries = 100)` e comentário `// Feature: nutrix-app, Property 7: Isolamento de Workout_Plans por usuário` — **Validates: Requirements 6.12**
  - [ ] 12.8 Criar `SecurityPropertyTest` — Property 8: para qualquer requisição a endpoint protegido com token ausente, expirado ou malformado, o sistema deve retornar HTTP 401 e não processar a requisição; anotar com `@Property(tries = 100)` e comentário `// Feature: nutrix-app, Property 8: Proteção de endpoints autenticados` — **Validates: Requirements 1.4, 1.5, 8.1**

- [~] 13. Testes de Integração com Testcontainers (Backend)
  - [ ] 13.1 Configurar dependência `testcontainers-postgresql` no `pom.xml` e criar `AbstractIntegrationTest` base que sobe container PostgreSQL, aplica `schema.sql` e configura `@DynamicPropertySource` para apontar o datasource ao container
  - [ ] 13.2 Criar `AuthIntegrationTest` estendendo `AbstractIntegrationTest`: testar fluxo completo de login com usuário real no banco; verificar que JWT retornado é válido; verificar que credenciais inválidas retornam 401; verificar que falha de login registra entrada em `auth_failure_log`
  - [ ] 13.3 Criar `TmbIntegrationTest` estendendo `AbstractIntegrationTest`: testar fluxo completo login → `POST /api/tmb/calculate` → `POST /api/tmb/history` → `GET /api/tmb/history`; verificar que o registro salvo aparece no histórico com valores corretos; verificar que `GET /api/tmb/history` sem JWT retorna 401
  - [ ] 13.4 Criar `WorkoutIntegrationTest` estendendo `AbstractIntegrationTest`: testar CRUD completo de `WorkoutPlan` (criar, buscar, atualizar, deletar); testar adição e remoção de `ExerciseEntry`; verificar que `GET /api/workout/plans/latest` retorna o plano mais recente; verificar que endpoints sem JWT retornam 401; verificar que usuário A não acessa planos do usuário B
  - [ ] 13.5 Criar `ExerciseIntegrationTest` estendendo `AbstractIntegrationTest`: verificar que `GET /api/exercises` retorna todos os grupos musculares com exercícios e variações do `schema.sql`; verificar que `GET /api/exercises?muscleGroupId={id}` filtra corretamente; verificar que endpoint sem JWT retorna 401

- [~] 14. Testes de Componente do Frontend (Angular — Jest)
  - [ ] 14.1 Criar `login.component.spec.ts`: testar que formulário inválido (campos vazios) não chama `AuthService.login()`; testar que formulário válido chama `AuthService.login()` com os valores corretos; testar que erro 401 exibe mensagem de erro na tela; testar que login bem-sucedido redireciona para `/dashboard`
  - [ ] 14.2 Criar `dashboard.component.spec.ts`: testar que exatamente 4 `FeatureCardComponent` são renderizados; testar que cards de TMB e Workout navegam para as rotas corretas ao clicar; testar que cards bloqueados exibem mensagem "Em breve" e não navegam; testar que nome do usuário autenticado é exibido
  - [ ] 14.3 Criar `tmb-calculator.component.spec.ts`: testar que formulário com valores inválidos exibe erros de validação; testar que formulário válido chama `TmbService.calculate()`; testar que resultado é exibido com 2 casas decimais; testar que clicar "Salvar" chama `TmbService.saveHistory()`; testar que clicar "Não salvar" mantém resultado sem chamar `saveHistory()`
  - [ ] 14.4 Criar `workout-builder.component.spec.ts`: testar que `WorkoutService.getLatestPlan()` é chamado no `ngOnInit`; testar que plano carregado é exibido corretamente; testar que adicionar exercício cria nova `ExerciseEntry`; testar que remover exercício remove a entrada da lista; testar que salvar chama `WorkoutService.createPlan()` ou `updatePlan()` conforme o caso

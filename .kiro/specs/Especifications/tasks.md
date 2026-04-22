# Implementation Plan: NUTRIX Frontend Redesign

## Overview

Implementação incremental do redesign completo do frontend NUTRIX em Angular 17+ (standalone components). O plano segue a ordem lógica de dependências: Design System → serviços globais → componentes globais → correções de bugs → redesign de cada feature. Cada etapa é validada antes de avançar para a próxima.

## Tasks

- [x] 1. Atualizar Design System global (`styles.scss`)
  - Substituir o conteúdo de `nutrix-frontend/src/styles.scss` pelas variáveis CSS custom properties (`:root`) definidas no design: paleta verde (`--color-primary`, `--color-primary-dark`, etc.), gradientes, paleta neutra, variáveis de tipografia, espaçamento, border-radius, sombras e transições
  - Adicionar import da fonte Inter via `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')` e aplicar `font-family: var(--font-family)` no `body`
  - Criar classes utilitárias: `.btn-primary` com gradiente verde, `.btn-secondary`, `.card` com sombra, `.gradient-primary`, `.form-control` com estados focus/error, `.spinner` inline
  - Garantir que todos os layouts usem `box-sizing: border-box` e que não haja overflow horizontal em viewports < 768px
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 2. Criar `ToastService`
  - [x] 2.1 Implementar `src/app/core/services/toast.service.ts`
    - Definir a interface `Toast { id: string; type: 'success' | 'error' | 'info'; message: string; createdAt: number }`
    - Implementar o serviço com `providedIn: 'root'`, usando `BehaviorSubject<Toast[]>` para expor `toasts$: Observable<Toast[]>`
    - Implementar `showSuccess(message)`, `showError(message)` e `showInfo(message)` — cada método gera um `id` único (via `crypto.randomUUID()` ou `Date.now().toString()`), adiciona o toast à lista e agenda remoção automática com `setTimeout` de 4000ms
    - Implementar `dismiss(id: string)` que remove o toast imediatamente da lista
    - _Requirements: 3.1, 3.3, 3.6_

  - [x]* 2.2 Escrever testes de propriedade para `ToastService`
    - Instalar `fast-check` como dev dependency: `npm install --save-dev fast-check`
    - Criar `src/app/core/services/toast.service.spec.ts`
    - **Property 5: Toast renderiza com tipo e estilo corretos** — para qualquer mensagem e tipo (`success`/`error`/`info`), o toast criado deve ter `type` e `message` correspondentes
    - **Property 6: Toasts preservam ordem de inserção** — para qualquer sequência de N chamadas, a lista deve preservar a ordem FIFO
    - **Property 7: Clique em toast o remove imediatamente** — `dismiss(id)` deve remover o toast da lista sem aguardar timeout
    - Cada propriedade deve executar no mínimo 100 iterações
    - Anotar cada teste com `// Feature: nutrix-frontend-redesign, Property N: <texto>`
    - _Requirements: 3.2, 3.4, 3.6_

- [x] 3. Criar `ToastComponent`
  - [x] 3.1 Implementar `src/app/shared/components/toast/toast.component.ts`
    - Standalone component que injeta `ToastService` e assina `toasts$` via `async` pipe
    - Template: container fixo (`position: fixed; top: 1rem; right: 1rem; z-index: 9999`) com lista de toasts empilhados verticalmente
    - Cada toast exibe ícone (✅/❌/ℹ️), mensagem e aplica classe CSS correspondente ao tipo (`toast--success`, `toast--error`, `toast--info`)
    - Clique em qualquer toast chama `toastService.dismiss(toast.id)`
    - _Requirements: 3.2, 3.4, 3.6_

  - [x] 3.2 Criar `toast.component.scss`
    - Estilos para o container fixo e para cada variante de toast (fundo verde claro/vermelho claro/azul claro, borda colorida, padding, border-radius, sombra)
    - Animação de entrada com `@keyframes` (slide-in da direita ou fade-in)
    - _Requirements: 3.2_

- [x] 4. Registrar `ToastComponent` no `AppComponent`
  - Modificar `src/app/app.component.ts` para importar e incluir `ToastComponent` no template ao lado do `<router-outlet>`
  - O `ToastComponent` deve ser renderizado fora do `router-outlet` para persistir entre navegações
  - _Requirements: 3.2, 3.4_

- [x] 5. Verificar e corrigir registro do `jwtInterceptor` em `app.config.ts`
  - Confirmar que `provideHttpClient(withInterceptors([jwtInterceptor]))` está presente em `src/app/app.config.ts` (já está correto — verificar e documentar no código se necessário)
  - Garantir que o interceptor cobre todas as rotas autenticadas (`/tmb`, `/tmb/history`, `/workout`)
  - _Requirements: 2.1, 2.2_

  - [x]* 5.1 Escrever testes de propriedade para `jwtInterceptor`
    - Criar `src/app/core/interceptors/jwt.interceptor.spec.ts`
    - **Property 3: JWT Interceptor injeta token em todas as requisições autenticadas** — para qualquer URL e token válido, o header `Authorization: Bearer <token>` deve estar presente na requisição clonada
    - **Property 4: JWT Interceptor não injeta header sem token** — para qualquer URL quando `getToken()` retorna `null`, a requisição não deve conter o header `Authorization`
    - _Requirements: 2.1, 2.2_

- [x] 6. Corrigir `AuthService.logout()`
  - Verificar que `src/app/core/services/auth.service.ts` remove corretamente `nutrix_token`, `nutrix_username` e `nutrix_fullname` do `localStorage` (já implementado — confirmar as chaves usadas)
  - O `AuthService.logout()` deve permanecer sem dependência do `Router` (responsabilidade de navegação fica no componente chamador)
  - _Requirements: 1.1_

  - [x]* 6.1 Escrever testes de propriedade para `AuthService.logout()`
    - Criar ou atualizar `src/app/core/services/auth.service.spec.ts`
    - **Property 1: Logout limpa completamente o estado de autenticação** — para qualquer combinação de token, username e fullName armazenados, após `logout()`, `getToken()`, `getUsername()` e `getFullName()` devem retornar `null`
    - _Requirements: 1.1_

  - [x]* 6.2 Escrever testes de propriedade para `authGuard`
    - Criar `src/app/core/guards/auth.guard.spec.ts`
    - **Property 2: authGuard bloqueia acesso sem autenticação** — para qualquer rota protegida, quando `isAuthenticated()` retorna `false`, o guard deve retornar um `UrlTree` apontando para `/login`
    - _Requirements: 1.3_

- [x] 7. Criar `NavbarComponent`
  - [x] 7.1 Implementar `src/app/shared/components/navbar/navbar.component.ts`
    - Standalone component que injeta `AuthService` e `Router`
    - Exibe logo "NUTRIX" com `routerLink="/dashboard"`, nome completo do usuário via `authService.getFullName()` (fallback para `getUsername()` e depois `'Usuário'`), e botão "Sair"
    - Método `logout()`: chama `authService.logout()` e em seguida `router.navigate(['/login'])`
    - _Requirements: 1.2, 7.2, 7.3, 7.4_

  - [x] 7.2 Criar `navbar.component.html` e `navbar.component.scss`
    - Layout horizontal com logo à esquerda, nome do usuário e botão de logout à direita
    - Responsividade mobile (< 768px): ocultar nome completo, exibir apenas avatar com inicial e botão de logout
    - Aplicar variáveis do Design System (gradiente verde no fundo ou borda inferior, sombra `--shadow-md`)
    - _Requirements: 7.1, 7.5_

- [x] 8. Integrar `NavbarComponent` no `AppComponent`
  - Modificar `src/app/app.component.ts` para importar `NavbarComponent`, `RouterOutlet`, `ToastComponent` e `CommonModule`/`AsyncPipe`
  - Injetar `AuthService` no `AppComponent`
  - Exibir `<app-navbar>` condicionalmente com `*ngIf="authService.isAuthenticated()"` (ou `@if` com Angular 17 control flow)
  - _Requirements: 7.1_

- [x] 9. Redesign do `LoginComponent`
  - [x] 9.1 Atualizar `src/app/features/login/login.component.ts`
    - Substituir todas as chamadas a `alert()` por `toastService.showError()`
    - Adicionar propriedade `isLoading: boolean` controlada durante a chamada HTTP
    - Desabilitar o botão de submit e exibir spinner enquanto `isLoading` for `true`
    - _Requirements: 6.4, 6.5_

  - [x] 9.2 Atualizar `login.component.html`
    - Layout 2 painéis em desktop (> 768px): painel esquerdo com gradiente verde (`--gradient-hero`), logo NUTRIX, tagline e lista de features; painel direito com formulário de login
    - Formulário com campos de usuário e senha, mensagens de erro inline abaixo de cada campo inválido (exibidas quando campo está `touched && invalid`)
    - Botão "Entrar" com spinner inline quando `isLoading` for `true`
    - Mobile (< 768px): apenas o painel do formulário em tela cheia
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6_

  - [x] 9.3 Atualizar `login.component.scss`
    - Aplicar variáveis do Design System, gradiente no painel esquerdo, layout flexbox/grid 50/50
    - Media query para < 768px ocultar painel esquerdo
    - _Requirements: 6.1, 6.6_

- [x] 10. Redesign do `DashboardComponent`
  - [x] 10.1 Atualizar `src/app/features/dashboard/dashboard.component.ts`
    - Remover botão de logout inline (substituído pelo `NavbarComponent`)
    - Injetar `ToastService`
    - Implementar `getGreetingPeriod(hour: number): GreetingPeriod` como função pura exportada (para testabilidade)
    - Exibir saudação personalizada com nome do usuário e período do dia (Bom dia 🌅 / Boa tarde ☀️ / Boa noite 🌙)
    - Método `onCardClick(feature)`: navegar se `feature.active`, chamar `toastService.showInfo('Funcionalidade disponível em breve!')` se inativo
    - _Requirements: 8.4, 8.5_

  - [x] 10.2 Atualizar `dashboard.component.html`
    - Saudação personalizada no topo
    - Grid responsivo de feature cards (2 colunas desktop, 1 coluna mobile)
    - Cards ativos: gradiente verde, ícone grande, título, descrição, seta →, efeito hover (`translateY(-4px)` + sombra aumentada)
    - Cards inativos: fundo cinza, badge "Em breve", `cursor: not-allowed`
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 10.3 Atualizar `dashboard.component.scss`
    - Grid CSS responsivo, estilos de card com gradiente, animações de hover, badge "Em breve"
    - _Requirements: 8.1, 8.2, 8.3_

  - [x]* 10.4 Escrever testes de propriedade para `DashboardComponent`
    - **Property 10: Card inativo sempre dispara notificação info** — para qualquer feature com `active: false`, clicar no card deve chamar `ToastService.showInfo` e nunca navegar
    - **Property 11: Saudação corresponde corretamente ao período do dia** — para qualquer hora entre 0 e 23, `getGreetingPeriod(hour)` deve retornar `'morning'` (5–11), `'afternoon'` (12–17) ou `'evening'` (demais)
    - _Requirements: 8.4, 8.5_

- [x] 11. Checkpoint — Verificar integração dos componentes globais
  - Garantir que todos os testes passam, que `ToastComponent` e `NavbarComponent` estão corretamente registrados no `AppComponent`, e que o fluxo de login → dashboard → logout funciona sem erros de compilação. Perguntar ao usuário se há dúvidas antes de continuar.

- [x] 12. Redesign do `TmbCalculatorComponent`
  - [x] 12.1 Atualizar `src/app/features/tmb-calculator/tmb-calculator.component.ts`
    - Injetar `ToastService`
    - Substituir todas as chamadas a `alert()` por `toastService.showError()` ou `toastService.showSuccess()`
    - Adicionar propriedade `isLoading: boolean` para controlar spinner no botão de submit
    - Desabilitar botão e campos do formulário enquanto `isLoading` for `true`
    - _Requirements: 4.1, 4.2, 9.4, 9.5, 9.6, 9.7_

  - [x] 12.2 Atualizar `tmb-calculator.component.html`
    - Adicionar botão "← Voltar ao Dashboard" no cabeçalho com `routerLink="/dashboard"`
    - Campos do formulário agrupados em grid 2 colunas com labels descritivas e placeholders informativos
    - Mensagens de erro inline por campo (exibidas quando `touched && invalid`)
    - Botão de submit com spinner inline quando `isLoading` for `true`
    - Cards de resultado com gradiente verde exibindo TMB e TDEE em destaque (visíveis apenas após cálculo bem-sucedido)
    - _Requirements: 4.1, 4.2, 9.1, 9.2, 9.3, 9.7_

  - [x] 12.3 Atualizar `tmb-calculator.component.scss`
    - Estilos para o botão de voltar, grid de campos, cards de resultado com gradiente, spinner inline
    - _Requirements: 9.1, 9.3_

- [x] 13. Redesign do `TmbHistoryComponent`
  - [x] 13.1 Atualizar `src/app/features/tmb-calculator/tmb-history/tmb-history.component.ts`
    - Injetar `ToastService`
    - Substituir todas as chamadas a `alert()` por `toastService.showError()`
    - Implementar `getSortedHistory()`: retorna os registros ordenados por `calculatedAt` em ordem decrescente
    - Implementar `calculateTrend(current: number, previous: number): TrendIndicator` como função pura exportada (para testabilidade)
    - Adicionar propriedade `isLoading: boolean` para controlar skeleton loader
    - _Requirements: 10.1, 10.5, 10.6_

  - [x] 13.2 Atualizar `tmb-history.component.html`
    - Skeleton loader (3 cards placeholder animados com `@keyframes pulse`) exibido quando `isLoading` for `true`
    - Empty state com ícone 📊, mensagem "Nenhum cálculo encontrado" e botão "Fazer Primeiro Cálculo" com `routerLink="/tmb"` (exibido quando `!isLoading && history.length === 0`)
    - Lista de cards com layout de timeline (linha vertical à esquerda, data formatada no topo, valores de TMB e TDEE em destaque, parâmetros utilizados)
    - Indicador de tendência entre registros consecutivos (↑ verde / ↓ vermelho / → cinza) usando `calculateTrend()`
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.6_

  - [x] 13.3 Atualizar `tmb-history.component.scss`
    - Estilos para skeleton loader (animação pulse), empty state, cards de timeline (linha vertical, data, valores em destaque), indicadores de tendência coloridos
    - _Requirements: 10.2, 10.3, 10.4, 10.6_

  - [x]* 13.4 Escrever testes de propriedade para `TmbHistoryComponent`
    - **Property 13: Histórico TMB exibido em ordem decrescente de data** — para qualquer array de registros com datas variadas, `getSortedHistory()` deve retornar os registros com `history[i].calculatedAt >= history[i+1].calculatedAt` para todo `i`
    - **Property 15: Indicador de tendência reflete corretamente a variação de TDEE** — para qualquer par `(currentTdee, previousTdee)`, `calculateTrend()` deve retornar `'up'` quando `delta > 0`, `'down'` quando `delta < 0`, e `'stable'` quando `|delta| < 1`
    - _Requirements: 10.1, 10.6_

- [x] 14. Instalar `fast-check` e criar testes de propriedade restantes
  - [x] 14.1 Instalar `fast-check`
    - Executar `npm install --save-dev fast-check` em `nutrix-frontend/`
    - _Requirements: (infraestrutura de testes)_

  - [x]* 14.2 Escrever testes de propriedade para `AuthService.logout()` (Property 1)
    - Arquivo: `src/app/core/services/auth.service.spec.ts`
    - **Property 1: Logout limpa completamente o estado de autenticação**
    - Para qualquer combinação de strings `(token, username, fullName)` armazenadas no localStorage, após `authService.logout()`, `getToken()`, `getUsername()` e `getFullName()` devem retornar `null`
    - Anotar com `// Feature: nutrix-frontend-redesign, Property 1: Logout limpa completamente o estado de autenticação`
    - **Validates: Requirements 1.1**

  - [x]* 14.3 Escrever testes de propriedade para `authGuard` (Property 2)
    - Arquivo: `src/app/core/guards/auth.guard.spec.ts`
    - **Property 2: authGuard bloqueia acesso sem autenticação**
    - Para qualquer rota protegida (`/dashboard`, `/tmb`, `/tmb/history`, `/workout`), quando `isAuthenticated()` retorna `false`, o guard deve retornar um `UrlTree` apontando para `/login`
    - Anotar com `// Feature: nutrix-frontend-redesign, Property 2: authGuard bloqueia acesso sem autenticação`
    - **Validates: Requirements 1.3**

  - [x]* 14.4 Escrever testes de propriedade para `jwtInterceptor` (Properties 3 e 4)
    - Arquivo: `src/app/core/interceptors/jwt.interceptor.spec.ts`
    - **Property 3: JWT Interceptor injeta token em todas as requisições autenticadas**
    - **Property 4: JWT Interceptor não injeta header sem token**
    - Anotar cada teste com `// Feature: nutrix-frontend-redesign, Property N: <texto>`
    - **Validates: Requirements 2.1, 2.2**

  - [x]* 14.5 Escrever testes de propriedade para `ToastService` (Properties 5, 6 e 7)
    - Arquivo: `src/app/core/services/toast.service.spec.ts`
    - **Property 5: Toast renderiza com tipo e estilo corretos**
    - **Property 6: Toasts preservam ordem de inserção**
    - **Property 7: Clique em toast o remove imediatamente**
    - Anotar cada teste com `// Feature: nutrix-frontend-redesign, Property N: <texto>`
    - **Validates: Requirements 3.2, 3.4, 3.6**

  - [x]* 14.6 Escrever testes de propriedade para `getGreetingPeriod()` (Property 11)
    - Arquivo: `src/app/features/dashboard/dashboard.component.spec.ts`
    - **Property 11: Saudação corresponde corretamente ao período do dia**
    - Para qualquer inteiro entre 0 e 23, `getGreetingPeriod(hour)` deve retornar `'morning'` (5–11), `'afternoon'` (12–17) ou `'evening'` (demais)
    - Anotar com `// Feature: nutrix-frontend-redesign, Property 11: Saudação corresponde corretamente ao período do dia`
    - **Validates: Requirements 8.5**

  - [x]* 14.7 Escrever testes de propriedade para `calculateTrend()` (Property 15)
    - Arquivo: `src/app/features/tmb-calculator/tmb-history/tmb-history.component.spec.ts`
    - **Property 15: Indicador de tendência reflete corretamente a variação de TDEE**
    - Para qualquer par `(currentTdee, previousTdee)` floats entre 1000 e 6000, `calculateTrend()` deve retornar `direction: 'up'` quando `delta > 0`, `'down'` quando `delta < 0`, `'stable'` quando `|delta| < 1`
    - Anotar com `// Feature: nutrix-frontend-redesign, Property 15: Indicador de tendência reflete corretamente a variação de TDEE`
    - **Validates: Requirements 10.6**

  - [x]* 14.8 Escrever testes de propriedade para `getSortedHistory()` (Property 13)
    - Arquivo: `src/app/features/tmb-calculator/tmb-history/tmb-history.component.spec.ts`
    - **Property 13: Histórico TMB exibido em ordem decrescente de data**
    - Para qualquer array de registros `TmbHistory` com `minLength: 2`, `getSortedHistory()` deve retornar array onde `sorted[i].calculatedAt >= sorted[i+1].calculatedAt` para todo `i`
    - Anotar com `// Feature: nutrix-frontend-redesign, Property 13: Histórico TMB exibido em ordem decrescente de data`
    - **Validates: Requirements 10.1**

- [x] 15. Checkpoint final — Garantir que todos os testes passam
  - Executar `ng test --run` (ou `ng test --watch=false`) para confirmar que todos os testes unitários e de propriedade passam sem erros
  - Verificar que não há erros de compilação TypeScript (`ng build`)
  - Perguntar ao usuário se há ajustes antes de encerrar

## Notes

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada tarefa referencia os requisitos específicos para rastreabilidade
- Os checkpoints garantem validação incremental antes de avançar
- As funções puras `getGreetingPeriod` e `calculateTrend` devem ser exportadas dos seus respectivos arquivos para facilitar os testes de propriedade
- O `AuthService.logout()` já está implementado corretamente — a tarefa 6 é de verificação e documentação
- O `jwtInterceptor` já está registrado corretamente em `app.config.ts` — a tarefa 5 é de verificação
- Testes de propriedade usam `fast-check` com mínimo de 100 iterações por propriedade

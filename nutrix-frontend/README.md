# NUTRIX Frontend

Frontend da aplicação NUTRIX - Plataforma de Saúde e Condicionamento Físico.

## Stack Tecnológica

- **Angular 17+** (Standalone Components)
- **TypeScript**
- **SCSS**
- **RxJS**

## Pré-requisitos

- Node.js 18+ e npm
- Angular CLI 17+

## Instalação

```bash
# Instalar dependências
npm install

# Instalar Angular CLI globalmente (se necessário)
npm install -g @angular/cli
```

## Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm start
# ou
ng serve

# A aplicação estará disponível em http://localhost:4200
```

## Build

```bash
# Build de produção
npm run build
# ou
ng build

# Os arquivos compilados estarão em dist/nutrix-frontend
```

## Testes

```bash
# Executar testes unitários
npm test
# ou
ng test
```

## Estrutura do Projeto

```
src/app/
├── core/
│   ├── guards/          # Guards de rota (AuthGuard)
│   ├── interceptors/    # Interceptors HTTP (JWT)
│   └── services/        # Services (Auth, TMB, Workout, Exercise)
├── features/
│   ├── login/           # Componente de Login
│   ├── dashboard/       # Dashboard principal
│   ├── tmb-calculator/  # Calculadora de TMB
│   └── workout-builder/ # Montador de Treino
├── app.component.ts     # Componente raiz
├── app.config.ts        # Configuração da aplicação
└── app.routes.ts        # Definição de rotas
```

## Funcionalidades

### Autenticação
- Login com JWT
- Guard de rotas protegidas
- Interceptor automático de token

### Dashboard
- 4 cards de funcionalidades
- 2 ativas: TMB e Workout
- 2 futuras: Nutrição e Bioimpedância

### Calculadora de TMB
- Formulário com validação
- Cálculo de TMB e TDEE
- Histórico de cálculos

### Montador de Treino
- Plano semanal (7 dias)
- Banco de exercícios por grupo muscular
- CRUD completo de treinos

## Configuração da API

A URL da API backend é configurada em:
- `src/environments/environment.ts` (desenvolvimento)
- `src/environments/environment.prod.ts` (produção)

Padrão: `http://localhost:8080`

## Comandos Úteis

```bash
# Gerar novo componente
ng generate component features/nome-componente --standalone

# Gerar novo service
ng generate service core/services/nome-service

# Gerar novo guard
ng generate guard core/guards/nome-guard --functional

# Gerar novo interceptor
ng generate interceptor core/interceptors/nome-interceptor --functional
```

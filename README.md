# NUTRIX - Plataforma de Saúde e Condicionamento Físico

Aplicação web completa para gerenciamento de saúde e treinos, desenvolvida com Java/Spring Boot no backend e Angular no frontend.

## 📋 Sobre o Projeto

NUTRIX é uma plataforma que oferece:
- **Calculadora de TMB/TDEE** - Cálculo de Taxa Metabólica Basal usando a fórmula Mifflin-St Jeor
- **Montador de Treino** - Criação de planos de treino semanais personalizados
- **Banco de Exercícios** - Catálogo completo com 9 grupos musculares e variações
- **Autenticação JWT** - Sistema seguro de login e proteção de dados

## 🏗️ Arquitetura

### Backend
- **Java 17** + **Spring Boot 3.2.5**
- **Spring Security** com JWT
- **Spring Data JPA** + **PostgreSQL** (Supabase)
- **Maven** para gerenciamento de dependências
- **jqwik** para testes baseados em propriedades
- **Testcontainers** para testes de integração

### Frontend
- **Angular 17+** (Standalone Components)
- **TypeScript**
- **SCSS** para estilização
- **RxJS** para programação reativa
- **Reactive Forms** com validação

### Banco de Dados
- **Supabase** (PostgreSQL gerenciado)
- Schema completo em `schema.sql`
- Row Level Security (RLS) habilitado

## 📁 Estrutura do Projeto

```
nutrix/
├── nutrix-backend/          # Backend Spring Boot
│   ├── src/main/java/com/nutrix/
│   │   ├── auth/           # Autenticação JWT
│   │   ├── user/           # Entidades de usuário
│   │   ├── tmb/            # Calculadora TMB
│   │   ├── exercise/       # Banco de exercícios
│   │   ├── workout/        # Montador de treino
│   │   └── config/         # Configurações Spring
│   └── pom.xml
│
├── nutrix-frontend/         # Frontend Angular
│   ├── src/app/
│   │   ├── core/           # Guards, Interceptors, Services
│   │   └── features/       # Componentes de funcionalidades
│   └── package.json
│
├── schema.sql              # Schema do banco de dados
└── .kiro/specs/nutrix-app/ # Documentação do projeto
    ├── requirements.md     # Requisitos detalhados
    ├── design.md          # Design técnico
    └── tasks.md           # Lista de tarefas
```

## 🚀 Como Executar

### Pré-requisitos
- Java 17+
- Node.js 18+
- Maven 3.8+
- Conta no Supabase

### 1. Configurar o Banco de Dados

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o arquivo `schema.sql` no SQL Editor do Supabase
3. Anote as credenciais de conexão

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` ou configure as variáveis:

```bash
# Backend
SUPABASE_DB_URL=jdbc:postgresql://[HOST]:[PORT]/[DATABASE]
SUPABASE_DB_USER=seu_usuario
SUPABASE_DB_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta_minimo_256_bits
```

### 3. Executar o Backend

```bash
cd nutrix-backend
mvn clean install
mvn spring-boot:run
```

O backend estará disponível em `http://localhost:8080`

### 4. Executar o Frontend

```bash
cd nutrix-frontend
npm install
npm start
```

O frontend estará disponível em `http://localhost:4200`

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login (público)

### TMB
- `POST /api/tmb/calculate` - Calcular TMB/TDEE
- `POST /api/tmb/history` - Salvar no histórico
- `GET /api/tmb/history` - Listar histórico

### Exercícios
- `GET /api/exercises` - Listar todos os exercícios agrupados
- `GET /api/exercises?muscleGroupId={id}` - Filtrar por grupo muscular

### Treinos
- `GET /api/workout/plans` - Listar planos
- `GET /api/workout/plans/latest` - Plano mais recente
- `POST /api/workout/plans` - Criar plano
- `PUT /api/workout/plans/{id}` - Atualizar plano
- `DELETE /api/workout/plans/{id}` - Deletar plano

**Nota:** Todos os endpoints (exceto `/api/auth/login`) requerem autenticação JWT.

## 🧪 Testes

### Backend

```bash
# Todos os testes
mvn test

# Apenas testes unitários
mvn test -Dtest="*Test"

# Apenas testes de propriedade (jqwik)
mvn test -Dtest="*PropertyTest"

# Apenas testes de integração
mvn test -Dtest="*IntegrationTest"
```

### Frontend

```bash
npm test
```

## 📊 Status de Implementação

### ✅ Backend Completo
- [x] Setup do projeto Backend (Spring Boot)
- [x] Sistema de Autenticação JWT
- [x] Calculadora de TMB/TDEE
- [x] Banco de Exercícios
- [x] Montador de Treino (CRUD completo)
- [x] Schema SQL completo
- [x] Global Exception Handler
- [x] Validações Bean Validation
- [x] Isolamento de dados por usuário

### ✅ Frontend Base
- [x] Setup do projeto Frontend (Angular)
- [x] AuthService + JWT Interceptor
- [x] AuthGuard para rotas protegidas
- [x] LoginComponent funcional
- [x] DashboardComponent com 4 cards

### 🚧 Em Desenvolvimento
- [ ] Componentes Frontend (TMB Calculator, Workout Builder)
- [ ] Testes Unitários
- [ ] Testes de Propriedade (PBT)
- [ ] Testes de Integração

### 📅 Planejado
- [ ] Nutrição Inteligente
- [ ] Cadastro de Exames de Bioimpedância

## 🔒 Segurança

- Autenticação via JWT com expiração de 24h
- Senhas armazenadas com BCrypt
- CORS configurado para `http://localhost:4200`
- CSRF desabilitado (API stateless)
- Row Level Security no Supabase
- Validação de entrada em todos os endpoints
- Log de tentativas de login malsucedidas

## 📝 Documentação Adicional

- **Requirements**: `.kiro/specs/nutrix-app/requirements.md`
- **Design**: `.kiro/specs/nutrix-app/design.md`
- **Tasks**: `.kiro/specs/nutrix-app/tasks.md`
- **Backend README**: `nutrix-backend/README.md`
- **Frontend README**: `nutrix-frontend/README.md`

## 🤝 Contribuindo

Este é um projeto em desenvolvimento ativo. Para contribuir:

1. Leia a documentação em `.kiro/specs/nutrix-app/`
2. Verifique as tasks pendentes em `tasks.md`
3. Siga os padrões de código estabelecidos
4. Execute os testes antes de commitar

## 📄 Licença

Este projeto está em desenvolvimento.

---

**Desenvolvido com ❤️ usando Spring Boot e Angular**

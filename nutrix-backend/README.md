# NUTRIX Backend

Backend da aplicação NUTRIX - Plataforma de Saúde e Condicionamento Físico.

## Stack Tecnológica

- **Java 17**
- **Spring Boot 3.2.5**
- **Spring Security** (JWT)
- **Spring Data JPA**
- **PostgreSQL** (Supabase)
- **Maven**

## Pré-requisitos

- Java 17+
- Maven 3.8+
- Conta no Supabase com banco PostgreSQL configurado

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto ou configure as seguintes variáveis de ambiente:

```bash
SUPABASE_DB_URL=jdbc:postgresql://[HOST]:[PORT]/[DATABASE]
SUPABASE_DB_USER=seu_usuario
SUPABASE_DB_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta_minimo_256_bits
```

### Executar o Schema SQL

Antes de iniciar a aplicação, execute o arquivo `schema.sql` (localizado na raiz do workspace) no SQL Editor do Supabase para criar todas as tabelas e dados iniciais.

## Compilar e Executar

```bash
# Compilar o projeto
mvn clean compile

# Executar testes
mvn test

# Executar a aplicação
mvn spring-boot:run

# Gerar o JAR
mvn clean package
```

A aplicação estará disponível em: `http://localhost:8080`

## Estrutura de Pacotes

```
com.nutrix
├── config/          # Configurações Spring (Security, JWT)
├── auth/            # Autenticação e JWT
├── user/            # Entidades e repositórios de usuários
├── tmb/             # Calculadora de TMB
├── workout/         # Montador de Treino
└── exercise/        # Banco de Exercícios
```

## Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login (público)

### TMB
- `POST /api/tmb/calculate` - Calcular TMB/TDEE
- `POST /api/tmb/history` - Salvar no histórico
- `GET /api/tmb/history` - Listar histórico

### Exercícios
- `GET /api/exercises` - Listar todos os exercícios
- `GET /api/exercises?muscleGroupId={id}` - Filtrar por grupo muscular

### Treinos
- `GET /api/workout/plans` - Listar planos
- `GET /api/workout/plans/latest` - Plano mais recente
- `POST /api/workout/plans` - Criar plano
- `PUT /api/workout/plans/{id}` - Atualizar plano
- `DELETE /api/workout/plans/{id}` - Deletar plano

Todos os endpoints (exceto `/api/auth/login`) requerem autenticação JWT via header:
```
Authorization: Bearer <token>
```

## Testes

O projeto inclui:
- **Testes Unitários** (JUnit 5 + Mockito)
- **Testes de Propriedade** (jqwik)
- **Testes de Integração** (Testcontainers)

```bash
# Executar todos os testes
mvn test

# Executar apenas testes unitários
mvn test -Dtest="*Test"

# Executar apenas testes de propriedade
mvn test -Dtest="*PropertyTest"

# Executar apenas testes de integração
mvn test -Dtest="*IntegrationTest"
```

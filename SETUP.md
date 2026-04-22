# 🏋️ NUTRIX - Guia de Configuração

## 📋 Visão Geral

NUTRIX é uma aplicação full-stack de saúde e fitness com:
- **Backend**: Java 17 + Spring Boot 3.2.5 + PostgreSQL (Supabase)
- **Frontend**: Angular 17+ (standalone components)
- **Autenticação**: JWT com Spring Security
- **Banco de Dados**: Supabase (PostgreSQL)

## ✨ Mudanças Importantes

### Exercícios Agora São Dados Estáticos

Os exercícios, grupos musculares e variações **não estão mais no banco de dados**. Eles são gerenciados como dados estáticos no código Java (`ExerciseData.java`).

**Vantagens:**
- ✅ Setup mais simples (sem necessidade de popular banco com exercícios)
- ✅ Dados consistentes em todos os ambientes
- ✅ Fácil de adicionar/modificar exercícios (apenas editar o código)
- ✅ Melhor performance (sem queries ao banco)

## 🚀 Passo a Passo para Subir a Aplicação

### 1️⃣ Configurar o Banco de Dados no Supabase

1. Acesse seu projeto: https://app.supabase.com
2. Selecione o projeto `zbdavihuugvrygzzeblk`
3. Vá em **SQL Editor** → **New Query**
4. **Se for primeira vez**: Execute o arquivo `schema.sql` (na raiz do projeto)
5. **Se já executou o schema.sql**: Execute as migrations pendentes em `migrations/` em ordem (V2, V3, etc.)
6. Anote as credenciais de conexão:
   - URL: `jdbc:postgresql://db.zbdavihuugvrygzzeblk.supabase.co:5432/postgres`
   - Usuário: `postgres`
   - Senha: `Pedrous#47980`
   - Project URL: https://app.supabase.com

**⚠️ Importante sobre Migrations:**
- O `schema.sql` é a versão V1 (inicial)
- Mudanças futuras serão feitas via migrations (V2, V3, V4...)
- Sempre execute as migrations em ordem
- Veja `migrations/README.md` para mais detalhes
- **V2 é CRÍTICA**: Sem ela, os nomes dos exercícios não persistem no Workout Builder

### 2️⃣ Configurar Variáveis de Ambiente do Backend

O backend já está configurado para ler do arquivo `.env.local`. Verifique se o arquivo existe em `nutrix-backend/.env.local`:

```env
SUPABASE_DB_URL=jdbc:postgresql://db.zbdavihuugvrygzzeblk.supabase.co:5432/postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=Pedrous#47980
JWT_SECRET=sua-chave-secreta-jwt-minimo-256-bits
```

**Se o arquivo não existir**, crie-o com as credenciais acima.

**Dica para gerar JWT_SECRET:**
```powershell
# PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### 3️⃣ Criar Usuário de Teste no Banco

Execute no SQL Editor do Supabase:

```sql
-- Senha: "senha123" (hash bcrypt)
INSERT INTO users (username, email, password, full_name) VALUES
('admin', 'admin@nutrix.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCy', 'Administrador');
```

### 4️⃣ Iniciar o Backend

```bash
cd nutrix-backend
mvn spring-boot:run
```

O backend estará disponível em: **http://localhost:8080**

### 5️⃣ Iniciar o Frontend

```bash
cd nutrix-frontend
npm install  # (se ainda não instalou)
npm start
```

O frontend estará disponível em: **http://localhost:4200**

## 🔐 Credenciais de Teste

- **Usuário**: `admin`
- **Senha**: `senha123`

## 🎨 Frontend Redesign

O frontend foi completamente redesenhado com:
- ✅ Design System com paleta verde (cor principal)
- ✅ Toast Notifications (substituindo alertas do browser)
- ✅ Navbar global em todas as telas autenticadas
- ✅ Login com layout 2 painéis (desktop) / 1 painel (mobile)
- ✅ Dashboard com cards de funcionalidades
- ✅ TMB Calculator com botão "Voltar ao Dashboard"
- ✅ TMB History com timeline e indicadores de tendência
- ✅ Responsividade mobile-first (< 768px)

## 📁 Estrutura do Projeto

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
│   └── pom.xml
├── nutrix-frontend/         # Frontend Angular
│   ├── src/app/
│   │   ├── core/            # Guards, Interceptors, Services
│   │   └── features/        # Componentes de funcionalidades
│   └── package.json
└── schema.sql               # Schema do banco (simplificado)
```

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação
- Login com JWT
- Proteção de rotas
- Logout

### ✅ Dashboard
- 4 cards de funcionalidades
- 2 ativas (TMB e Workout)
- 2 bloqueadas (Nutrição e Bioimpedância)

### ✅ Calculadora de TMB
- Cálculo usando fórmula Mifflin-St Jeor
- 5 níveis de atividade física
- Histórico de cálculos
- Salvar resultados

### ✅ Montador de Treino
- 7 dias da semana (Segunda a Domingo)
- Seleção de exercícios por grupo muscular
- Variações de exercícios
- Séries, repetições e carga
- Observações por exercício
- Salvar/Atualizar planos

## 🐛 Troubleshooting

### Backend não inicia

**Erro**: `Driver org.postgresql.Driver claims to not accept jdbcUrl`

**Solução**: Verifique se as variáveis de ambiente estão configuradas corretamente.

### Frontend não compila

**Erro**: `This command is not available when running the Angular CLI outside a workspace`

**Solução**: Certifique-se de que o arquivo `angular.json` existe na pasta `nutrix-frontend/`.

### Erro de CORS

**Solução**: O backend já está configurado para aceitar requisições de `http://localhost:4200`. Verifique se o frontend está rodando nessa porta.

## 📝 Próximos Passos

- [ ] Implementar testes unitários (Task 11)
- [ ] Implementar testes baseados em propriedades com jqwik (Task 12)
- [ ] Implementar testes de integração com Testcontainers (Task 13)
- [ ] Implementar testes de componente Angular (Task 14)

## 🤝 Contribuindo

Para adicionar novos exercícios, edite o arquivo:
`nutrix-backend/src/main/java/com/nutrix/exercise/ExerciseData.java`

## 📧 Suporte

Se encontrar problemas, verifique:
1. Variáveis de ambiente configuradas
2. Banco de dados criado no Supabase
3. Portas 8080 e 4200 disponíveis
4. Java 17 e Node.js instalados

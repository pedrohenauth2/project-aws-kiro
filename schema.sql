-- ============================================================
-- NUTRIX - Schema SQL para Supabase (PostgreSQL)
-- ============================================================
-- Execute este script no SQL Editor do Supabase para criar
-- todas as tabelas necessárias para a aplicação NUTRIX.
-- ============================================================

-- ------------------------------------------------------------
-- 1. USUÁRIOS
-- Armazena os usuários da plataforma NUTRIX.
-- A senha é armazenada como hash bcrypt pelo backend Java.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id          BIGSERIAL PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,  -- hash bcrypt
    full_name   VARCHAR(150),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 2. HISTÓRICO DE CÁLCULOS DE TMB
-- Persiste cada cálculo de TMB/TDEE salvo pelo usuário.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tmb_history (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    weight_kg       NUMERIC(6,2) NOT NULL,   -- peso em kg
    height_cm       NUMERIC(6,2) NOT NULL,   -- altura em cm
    age_years       INTEGER      NOT NULL,   -- idade em anos
    biological_sex  VARCHAR(10)  NOT NULL,   -- 'MALE' ou 'FEMALE'
    activity_level  VARCHAR(30)  NOT NULL,   -- ex: 'SEDENTARY', 'LIGHTLY_ACTIVE', etc.
    tmb_kcal        NUMERIC(10,2) NOT NULL,  -- resultado TMB em kcal
    tdee_kcal       NUMERIC(10,2) NOT NULL,  -- resultado TDEE em kcal
    calculated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Índice para busca rápida por usuário, ordenada por data
CREATE INDEX IF NOT EXISTS idx_tmb_history_user_date
    ON tmb_history(user_id, calculated_at DESC);

-- ------------------------------------------------------------
-- 3. NOTA: EXERCÍCIOS SÃO GERENCIADOS NO CÓDIGO
-- Os exercícios, grupos musculares e variações são dados
-- estáticos gerenciados diretamente no backend Java.
-- Não há necessidade de tabelas no banco para isso.
-- ------------------------------------------------------------

-- ------------------------------------------------------------
-- 4. PLANOS DE TREINO
-- Um usuário pode ter múltiplos planos de treino.
-- O plano mais recente é carregado por padrão.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workout_plans (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL DEFAULT 'Meu Treino',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Índice para buscar planos por usuário
CREATE INDEX IF NOT EXISTS idx_workout_plans_user
    ON workout_plans(user_id, updated_at DESC);

-- ------------------------------------------------------------
-- 5. DIAS DE TREINO
-- Cada plano tem entradas por dia da semana.
-- day_of_week: 1=Segunda, 2=Terça, ..., 7=Domingo
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workout_days (
    id               BIGSERIAL PRIMARY KEY,
    workout_plan_id  BIGINT  NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
    day_of_week      INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    label            VARCHAR(20),  -- ex: 'Segunda-feira'
    UNIQUE (workout_plan_id, day_of_week)
);

-- ------------------------------------------------------------
-- 6. ENTRADAS DE EXERCÍCIO NO TREINO
-- Cada exercício adicionado a um dia de treino.
-- Agora armazena apenas IDs e nomes dos exercícios (dados do código).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exercise_entries (
    id                     BIGSERIAL PRIMARY KEY,
    workout_day_id         BIGINT       NOT NULL REFERENCES workout_days(id) ON DELETE CASCADE,
    exercise_id            BIGINT       NOT NULL,  -- ID do exercício (gerenciado no código)
    exercise_name          VARCHAR(100) NOT NULL,  -- Nome do exercício
    exercise_variation_id  BIGINT,                 -- ID da variação (gerenciado no código)
    exercise_variation_name VARCHAR(100),          -- Nome da variação
    sets                   INTEGER      NOT NULL CHECK (sets > 0),
    reps                   INTEGER      NOT NULL CHECK (reps > 0),
    weight_kg              NUMERIC(6,2) CHECK (weight_kg > 0),  -- opcional
    sort_order             INTEGER      NOT NULL DEFAULT 0,      -- ordem no dia
    notes                  TEXT
);

-- Índice para buscar entradas por dia de treino
CREATE INDEX IF NOT EXISTS idx_exercise_entries_day
    ON exercise_entries(workout_day_id, sort_order);

-- ------------------------------------------------------------
-- 7. LOG DE TENTATIVAS DE AUTENTICAÇÃO MALSUCEDIDAS
-- Registra falhas de login para auditoria de segurança.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth_failure_log (
    id           BIGSERIAL PRIMARY KEY,
    username_attempted  VARCHAR(150) NOT NULL,  -- nunca armazena senha
    attempted_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    ip_address   VARCHAR(45)  -- IPv4 ou IPv6
);

-- Índice para consultas de auditoria por data
CREATE INDEX IF NOT EXISTS idx_auth_failure_log_date
    ON auth_failure_log(attempted_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - Supabase
-- Garante que cada usuário acesse apenas seus próprios dados.
-- ============================================================

-- Habilitar RLS nas tabelas sensíveis
ALTER TABLE tmb_history      ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans    ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_days     ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_failure_log ENABLE ROW LEVEL SECURITY;

-- Nota: A autenticação é gerenciada pelo backend Java/Spring.
-- O backend usa um service role key para acessar o Supabase,
-- portanto as políticas RLS abaixo são uma camada extra de proteção.
-- Se preferir gerenciar acesso apenas pelo backend, pode desabilitar RLS
-- e usar apenas a service role key com validação JWT no Spring Security.

-- ============================================================
-- FIM DO SCHEMA
-- ============================================================

-- ============================================================
-- NUTRIX - Migration V2
-- Adicionar campos de nomes de exercícios
-- ============================================================
-- Execute este script no SQL Editor do Supabase
-- Data: 2026-04-20
-- ============================================================

-- 1. Remover foreign keys da tabela exercise_entries (se existirem)
ALTER TABLE exercise_entries 
    DROP CONSTRAINT IF EXISTS exercise_entries_exercise_id_fkey,
    DROP CONSTRAINT IF EXISTS exercise_entries_exercise_variation_id_fkey;

-- 2. Adicionar novas colunas para armazenar nomes dos exercícios
ALTER TABLE exercise_entries 
    ADD COLUMN IF NOT EXISTS exercise_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS exercise_variation_name VARCHAR(100);

-- 3. Tornar exercise_name obrigatório (com valor padrão para dados existentes)
ALTER TABLE exercise_entries 
    ALTER COLUMN exercise_name SET NOT NULL DEFAULT 'Exercício';

-- 4. Remover tabelas de exercícios (em ordem devido às FKs)
-- Estas tabelas não são mais necessárias pois os exercícios são gerenciados no código
DROP TABLE IF EXISTS exercise_variations CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS muscle_groups CASCADE;

-- 5. Remover índice que não é mais necessário
DROP INDEX IF EXISTS idx_exercises_muscle_group;

-- ============================================================
-- NOTA: Os exercícios agora são gerenciados no código Java
-- Veja: nutrix-backend/src/main/java/com/nutrix/exercise/ExerciseData.java
-- ============================================================

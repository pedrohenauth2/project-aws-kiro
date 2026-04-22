# 🔧 Instruções para Aplicar Migration V2

## ⚠️ CRÍTICO: Aplicar esta migration para que os nomes dos exercícios persistam

A migration V2 adiciona os campos `exercise_name` e `exercise_variation_name` à tabela `exercise_entries`. Sem isso, os nomes dos exercícios não serão salvos no banco de dados.

## 📋 Passo a Passo

### 1. Acesse o Supabase
- URL: https://app.supabase.com
- Projeto: zbdavihuugvrygzzeblk
- Vá em **SQL Editor**

### 2. Crie uma nova query
- Clique em **New Query**
- Copie e cole o SQL abaixo

### 3. Execute o SQL

```sql
-- ============================================================
-- NUTRIX - Migration V2
-- Remove tabelas de exercícios (agora gerenciados no código)
-- ============================================================

-- 1. Remover foreign keys da tabela exercise_entries
ALTER TABLE exercise_entries 
    DROP CONSTRAINT IF EXISTS exercise_entries_exercise_id_fkey,
    DROP CONSTRAINT IF EXISTS exercise_entries_exercise_variation_id_fkey;

-- 2. Adicionar novas colunas para armazenar nomes dos exercícios
ALTER TABLE exercise_entries 
    ADD COLUMN IF NOT EXISTS exercise_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS exercise_variation_name VARCHAR(100);

-- 3. Copiar dados existentes (se houver) antes de remover as FKs
-- Atualizar exercise_name com base no exercise_id
UPDATE exercise_entries ee
SET exercise_name = e.name
FROM exercises e
WHERE ee.exercise_id = e.id
AND ee.exercise_name IS NULL;

-- Atualizar exercise_variation_name com base no exercise_variation_id
UPDATE exercise_entries ee
SET exercise_variation_name = ev.name
FROM exercise_variations ev
WHERE ee.exercise_variation_id = ev.id
AND ee.exercise_variation_name IS NULL;

-- 4. Alterar coluna exercise_id para não ser mais FK (apenas BIGINT)
ALTER TABLE exercise_entries 
    ALTER COLUMN exercise_id DROP NOT NULL;

-- 5. Tornar exercise_name obrigatório
ALTER TABLE exercise_entries 
    ALTER COLUMN exercise_name SET NOT NULL;

-- 6. Remover tabelas de exercícios (em ordem devido às FKs)
DROP TABLE IF EXISTS exercise_variations CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS muscle_groups CASCADE;

-- 7. Remover índice que não é mais necessário
DROP INDEX IF EXISTS idx_exercises_muscle_group;
```

### 4. Clique em **Run**

Você verá uma mensagem de sucesso quando a migration for aplicada.

## ✅ Verificar se funcionou

Após aplicar a migration, execute esta query para verificar:

```sql
-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'exercise_entries' 
AND column_name IN ('exercise_name', 'exercise_variation_name');
```

Você deve ver:
- `exercise_name` | `character varying`
- `exercise_variation_name` | `character varying`

## 🧪 Testar o Ciclo Completo

Após aplicar a migration:

1. **Abra o app** em http://localhost:4200
2. **Faça login** com `admin` / `senha123`
3. **Vá para Workout Builder**
4. **Adicione um exercício** (ex: Supino Reto)
5. **Salve o treino** (você verá "Treino salvo com sucesso!")
6. **Saia e volte** para o Workout Builder
7. **Verifique** se o nome do exercício aparece (não deve estar vazio)

## 🆘 Se der erro

Se receber um erro como:
- `ERROR: constraint "exercise_entries_exercise_id_fkey" does not exist`
  - Isso é normal! O `IF EXISTS` vai ignorar se a constraint não existir

- `ERROR: column "exercise_name" already exists`
  - Isso significa que a migration já foi aplicada. Tudo bem!

- Outro erro?
  - Verifique se você está no projeto correto (zbdavihuugvrygzzeblk)
  - Verifique se tem permissão de admin no Supabase

## 📝 Próximos Passos

Após aplicar a migration:
1. ✅ Reinicie o backend (ou deixe rodando, ele vai reconectar)
2. ✅ Teste o ciclo de save/reload
3. ✅ Verifique se os nomes dos exercícios persistem
4. ✅ Proceda com os testes de propriedade

---

**Avise quando terminar de aplicar a migration!**

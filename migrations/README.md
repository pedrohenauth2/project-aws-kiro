# 📦 Migrations do NUTRIX

Este diretório contém as migrations do banco de dados do NUTRIX.

## 🔄 Como Aplicar Migrations

### No Supabase:

1. Acesse seu projeto: https://app.supabase.com
2. Selecione o projeto `zbdavihuugvrygzzeblk`
3. Vá em **SQL Editor** → **New Query**
4. Abra o arquivo da migration (ex: `V2__remove_exercise_tables.sql`)
5. Copie todo o conteúdo
6. Cole no SQL Editor
7. Clique em **Run**
8. Verifique se a execução foi bem-sucedida

## 📋 Histórico de Migrations

### V1 - Schema Inicial (schema.sql)
**Data**: 2026-04-19  
**Status**: ✅ Aplicado

**Criado:**
- Tabela `users`
- Tabela `tmb_history`
- Tabela `muscle_groups`
- Tabela `exercises`
- Tabela `exercise_variations`
- Tabela `workout_plans`
- Tabela `workout_days`
- Tabela `exercise_entries`
- Tabela `auth_failure_log`
- Dados iniciais de exercícios

### V2 - Remover Tabelas de Exercícios
**Data**: 2026-04-20  
**Status**: ⏳ Pendente  
**Arquivo**: `V2__remove_exercise_tables.sql`

**Mudanças:**
- Remove tabelas `muscle_groups`, `exercises`, `exercise_variations`
- Adiciona colunas `exercise_name` e `exercise_variation_name` em `exercise_entries`
- Migra dados existentes antes de remover as tabelas
- Remove foreign keys de exercícios

**Motivo:**  
Os exercícios agora são gerenciados como dados estáticos no código Java (`ExerciseData.java`), não mais no banco de dados.

**⚠️ CRÍTICO**: Sem esta migration, os nomes dos exercícios **NÃO PERSISTEM** quando você salva um treino no Workout Builder.

## ⚠️ Importante

- **Sempre faça backup** antes de aplicar uma migration
- **Execute as migrations em ordem** (V1 → V2 → V3...)
- **Não pule versões**
- **Teste em ambiente de desenvolvimento primeiro**

## 🔍 Verificar Versão Atual

Para saber qual versão está aplicada, você pode criar uma tabela de controle:

```sql
-- Criar tabela de controle de migrations (opcional)
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(10) PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description TEXT
);

-- Registrar versão aplicada
INSERT INTO schema_migrations (version, description) VALUES
('V1', 'Schema inicial'),
('V2', 'Remover tabelas de exercícios');
```

## 📝 Convenção de Nomenclatura

```
V{número}__{descrição}.sql
```

Exemplos:
- `V1__initial_schema.sql`
- `V2__remove_exercise_tables.sql`
- `V3__add_user_profile.sql`

## 🆘 Rollback

Se precisar reverter uma migration, crie uma nova migration com as alterações inversas:

```
V{número}__rollback_{versão}.sql
```

Exemplo: `V3__rollback_v2.sql`

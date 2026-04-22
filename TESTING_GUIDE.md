# 🧪 NUTRIX - Guia de Testes

## URLs da Aplicação

| Serviço | URL |
|---------|-----|
| **Frontend (Vercel)** | https://project-aws-kiro.vercel.app |
| **Backend (Render)** | https://nutrix-backend-fibs.onrender.com |
| **Banco de Dados** | Supabase PostgreSQL (acesso via backend) |

> **Nota:** O plano gratuito do Render adormece o backend após 15 minutos de inatividade. O primeiro acesso pode demorar 30-50 segundos para "acordar".

---

## Credenciais de Teste

- **Usuário:** `admin`
- **Senha:** `senha123`

---

## Roteiro de Testes

### 1. Login

1. Acesse https://project-aws-kiro.vercel.app
2. Você será redirecionado para a tela de login
3. Insira `admin` e `senha123`
4. Clique em **Entrar**
5. **Esperado:** Toast verde "Login realizado com sucesso!" e redirecionamento para o Dashboard

**Teste de erro:**
- Tente logar com senha errada
- **Esperado:** Toast vermelho "Credenciais inválidas"

---

### 2. Dashboard

1. Após o login, você verá o Dashboard com saudação personalizada (Bom dia/Boa tarde/Boa noite)
2. Existem 4 cards de funcionalidades:
   - **Calculadora de TMB** — ativo (clicável)
   - **Montador de Treino** — ativo (clicável)
   - **Nutrição Inteligente** — bloqueado
   - **Exames de Bioimpedância** — bloqueado
3. Clique em um card bloqueado
4. **Esperado:** Toast azul "Funcionalidade disponível em breve!"

---

### 3. Calculadora de TMB

1. No Dashboard, clique em **Calculadora de TMB**
2. Preencha os campos:
   - Peso: `75`
   - Altura: `180`
   - Idade: `25`
   - Sexo Biológico: `Masculino`
   - Nível de Atividade: `Moderadamente Ativo`
3. Clique em **Calcular**
4. **Esperado:** Cards com valores de TMB e TDEE calculados
5. Clique em **Salvar no Histórico**
6. **Esperado:** Toast verde "Resultado salvo no histórico!"

**Teste de validação:**
- Tente calcular com campos vazios
- **Esperado:** Campos inválidos ficam com borda vermelha

---

### 4. Histórico de TMB

1. Na calculadora TMB, clique em **Ver Histórico** (ou acesse via menu)
2. **Esperado:** Lista de cálculos salvos em ordem decrescente (mais recente primeiro)
3. Cada registro mostra: data, TMB, TDEE e parâmetros usados
4. Indicadores de tendência entre registros (↑ ↓ →)

**Teste de limpar histórico:**
1. Clique em **Limpar Histórico**
2. Confirme no diálogo
3. **Esperado:** Histórico fica vazio
4. Saia e volte ao histórico
5. **Esperado:** Histórico continua vazio (dados foram deletados do banco)

---

### 5. Montador de Treino

1. No Dashboard, clique em **Montador de Treino**
2. Você verá 7 abas (Segunda a Domingo)
3. Selecione um dia (ex: Segunda-feira)
4. Clique em **Adicionar Exercício**
5. Selecione um grupo muscular (ex: Peito)
6. Escolha um exercício e variação
7. Defina séries, repetições e carga
8. Confirme
9. **Esperado:** Exercício aparece na lista do dia
10. Repita para outros dias
11. Clique em **Salvar Treino**
12. **Esperado:** Toast verde "Treino salvo com sucesso!"

**Teste de persistência:**
1. Salve um treino
2. Saia da tela (volte ao Dashboard)
3. Volte ao Montador de Treino
4. **Esperado:** O treino salvo é carregado automaticamente

---

### 6. Logout

1. Clique em **Sair** na navbar (canto superior direito)
2. **Esperado:** Redirecionamento para a tela de login
3. Tente acessar https://project-aws-kiro.vercel.app/dashboard diretamente
4. **Esperado:** Redirecionamento para login (rota protegida)

---

## Endpoints da API (para testes manuais)

Base URL: `https://nutrix-backend-fibs.onrender.com`

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|:------------:|-----------|
| POST | `/api/auth/login` | Não | Login |
| GET | `/api/exercises` | Sim | Listar exercícios |
| POST | `/api/tmb/calculate` | Sim | Calcular TMB |
| POST | `/api/tmb/history` | Sim | Calcular e salvar TMB |
| GET | `/api/tmb/history` | Sim | Listar histórico TMB |
| DELETE | `/api/tmb/history` | Sim | Limpar histórico TMB |
| GET | `/api/workout/plans` | Sim | Listar planos de treino |
| GET | `/api/workout/plans/latest` | Sim | Último plano de treino |
| POST | `/api/workout/plans` | Sim | Criar plano de treino |
| PUT | `/api/workout/plans/{id}` | Sim | Atualizar plano |
| DELETE | `/api/workout/plans/{id}` | Sim | Deletar plano |

### Exemplo de teste via curl

```bash
# Login (obter token)
curl -X POST https://nutrix-backend-fibs.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"senha123"}'

# Usar o token retornado nas próximas requisições
curl https://nutrix-backend-fibs.onrender.com/api/tmb/history \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## Responsividade

Teste a aplicação em diferentes tamanhos de tela:
- **Desktop:** Layout completo com 2 painéis no login, grid de cards no dashboard
- **Mobile (< 768px):** Layout em coluna única, navbar compacta

---

## Problemas Conhecidos

- O backend no Render (plano free) adormece após inatividade — o primeiro request demora mais
- Exercícios são dados estáticos no código (não há CRUD de exercícios)
- Funcionalidades "Nutrição" e "Bioimpedância" estão bloqueadas (planejadas para versões futuras)

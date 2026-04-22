# ⚡ NUTRIX - Quick Start Guide

**Tempo estimado**: 5 minutos para testar tudo

---

## 🎯 Status Atual

✅ Backend rodando em `http://localhost:8080`  
✅ Frontend rodando em `http://localhost:4200`  
✅ Banco de dados configurado (Supabase)  
✅ Migration V2 aplicada  

---

## 🚀 Começar a Testar

### 1. Abra o Frontend
```
http://localhost:4200
```

### 2. Faça Login
- **Usuário**: `admin`
- **Senha**: `senha123`

### 3. Teste as Funcionalidades

#### 📊 Dashboard (1 minuto)
- Veja os 4 cards
- Clique em um card bloqueado → vê notificação "Em breve"
- Clique em "Calculadora de TMB" → vai para a calculadora

#### 🧮 Calculadora TMB (2 minutos)
1. Preencha os dados:
   - Peso: 75 kg
   - Altura: 180 cm
   - Idade: 30 anos
   - Sexo: Masculino
   - Atividade: Moderadamente Ativo

2. Clique em "Calcular"
3. Veja o resultado em cards verdes
4. Clique em "Salvar no Histórico"
5. Clique em "← Voltar ao Dashboard"

#### 📈 Histórico TMB (1 minuto)
1. No Dashboard, clique em "Histórico TMB"
2. Veja o cálculo que você acabou de fazer
3. Veja a timeline com data e valores
4. Veja o indicador de tendência

#### 🏋️ Montador de Treino (1 minuto)
1. No Dashboard, clique em "Montador de Treino"
2. Selecione "Segunda-feira"
3. Clique em "Adicionar Exercício"
4. Selecione um exercício (ex: Supino Reto)
5. Preencha: 4 séries, 8 repetições, 100 kg
6. Clique em "Adicionar"
7. Clique em "Salvar Treino"
8. **Saia e volte** para verificar se o exercício persiste

#### 🚪 Logout (30 segundos)
1. Clique em "Sair" na navbar
2. Será redirecionado para login

---

## 🎨 Destaques do Design

- ✅ Paleta verde fitness
- ✅ Toast notifications elegantes
- ✅ Navbar global
- ✅ Responsividade mobile
- ✅ Animações suaves
- ✅ Feedback visual em todas as ações

---

## 🔍 O Que Verificar

### Backend
- [ ] Login funciona
- [ ] Calculadora TMB calcula corretamente
- [ ] Histórico salva e carrega
- [ ] Treino salva e persiste
- [ ] Logout limpa o token

### Frontend
- [ ] Design verde aplicado
- [ ] Toast notifications aparecem
- [ ] Navbar mostra nome do usuário
- [ ] Botão "Voltar" funciona
- [ ] Responsividade mobile funciona
- [ ] Sem alertas do browser

### Banco de Dados
- [ ] Dados salvos persistem
- [ ] Histórico TMB carrega
- [ ] Treino carrega após logout/login
- [ ] Nomes de exercícios aparecem

---

## 📱 Testar Responsividade Mobile

1. Abra o DevTools (F12)
2. Clique em "Toggle device toolbar" (Ctrl+Shift+M)
3. Selecione um dispositivo mobile (ex: iPhone 12)
4. Verifique:
   - [ ] Layout em 1 coluna
   - [ ] Navbar colapsada
   - [ ] Botões acessíveis
   - [ ] Sem overflow horizontal

---

## 🐛 Se Algo Não Funcionar

### Backend não responde
```bash
# Verifique se está rodando
curl http://localhost:8080/api/health
```

### Frontend não carrega
```bash
# Verifique se está rodando
curl http://localhost:4200
```

### Erro de autenticação
- Verifique credenciais: `admin` / `senha123`
- Verifique se o banco está conectado

### Exercícios não persistem
- Verifique se Migration V2 foi aplicada
- Veja `migrations/README.md`

---

## 📊 Endpoints Disponíveis

### Autenticação
```
POST /api/auth/login
Body: { "username": "admin", "password": "senha123" }
Response: { "token": "...", "username": "admin", "fullName": "Administrador" }
```

### Calculadora TMB
```
POST /api/tmb/calculate
Body: { "weight": 75, "height": 180, "age": 30, "sex": "MALE", "activityLevel": "MODERATE" }
Response: { "tmb": 1800.5, "tdee": 2700.75 }
```

### Histórico TMB
```
GET /api/tmb/history
Response: [{ "id": 1, "tmb": 1800.5, "tdee": 2700.75, "calculatedAt": "2026-04-22T..." }]
```

### Exercícios
```
GET /api/exercises
Response: [{ "id": 1, "name": "Supino Reto", "muscleGroup": "Peito", "variations": [...] }]
```

### Treino
```
GET /api/workouts
POST /api/workouts
PUT /api/workouts/{id}
DELETE /api/workouts/{id}
```

---

## 💡 Dicas

1. **Testar com dados diferentes**: Tente pesos, alturas e idades diferentes
2. **Testar múltiplos cálculos**: Faça vários cálculos para ver o histórico crescer
3. **Testar em mobile**: Use o DevTools para testar responsividade
4. **Testar logout/login**: Verifique se os dados persistem
5. **Testar notificações**: Veja as diferentes cores de toast (verde, vermelho, azul)

---

## 📝 Checklist Final

- [ ] Login funciona
- [ ] Dashboard mostra 4 cards
- [ ] Calculadora TMB funciona
- [ ] Histórico TMB carrega
- [ ] Montador de Treino funciona
- [ ] Exercícios persistem
- [ ] Logout funciona
- [ ] Design verde aplicado
- [ ] Toast notifications funcionam
- [ ] Navbar mostra nome do usuário
- [ ] Responsividade mobile funciona

---

## 🎉 Pronto!

Se tudo passou no checklist, o NUTRIX está **100% funcional** e pronto para produção!

---

**Tempo total**: ~5 minutos  
**Dificuldade**: Fácil  
**Status**: ✅ Pronto para Testar

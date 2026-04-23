# NUTRIX - DESAFIO 4: Kiro Power com MCP

## Definição do Power

**Nome:** NUTRIX Health Check

**Descrição:** Power que verifica a saúde de todos os serviços da plataforma NUTRIX em produção (Backend no Render, Frontend na Vercel e API) usando MCP (Model Context Protocol).

---

## Problema que resolve

Durante o desenvolvimento do NUTRIX, os serviços estão distribuídos em 3 plataformas diferentes:
- **Backend** no Render (plano free, adormece após inatividade)
- **Frontend** na Vercel
- **Banco de dados** no Supabase

Para verificar se tudo está funcionando, o desenvolvedor precisa abrir múltiplas abas, acessar dashboards diferentes e testar endpoints manualmente. Com este Power, basta perguntar no chat do Kiro e ele verifica tudo automaticamente.

---

## MCP Utilizado

**Tipo:** MCP Server customizado em Node.js usando `@modelcontextprotocol/sdk`

**Protocolo:** JSON-RPC 2.0 via stdio (padrão MCP)

**Localização:** `.kiro/powers/nutrix-health-check/server/index.js`

**Ferramentas expostas:**

| Ferramenta | Descrição |
|------------|-----------|
| `check_all_services` | Verifica todos os serviços de uma vez |
| `check_backend` | Verifica apenas o backend (Render + Actuator) |
| `check_frontend` | Verifica apenas o frontend (Vercel) |
| `check_api` | Testa o endpoint de login da API |

---

## Fluxo de Uso

1. O desenvolvedor pergunta no chat: "Verifica se o NUTRIX está no ar"
2. O Kiro ativa o Power `nutrix-health-check`
3. O Power chama a ferramenta `check_all_services` via MCP
4. O MCP server faz requisições HTTP para os 3 endpoints
5. O resultado é formatado e exibido no chat:

```
=== NUTRIX Health Check ===

✅ Backend (Render): UP (1234ms) [HTTP 200]
   Health: UP
✅ Frontend (Vercel): UP (156ms) [HTTP 200]
✅ API Login: UP (1456ms) [HTTP 401]
   Respondendo corretamente (401 esperado sem credenciais)

🟢 Todos os servicos estao funcionando!
```

Ou em caso de falha:

```
=== NUTRIX Health Check ===

❌ Backend (Render): DOWN (15000ms)
   Erro: The operation was aborted due to timeout
✅ Frontend (Vercel): UP (203ms) [HTTP 200]
❌ API Login: DOWN (15001ms)
   Erro: The operation was aborted due to timeout

🔴 Alguns servicos estao com problemas.
```

---

## Prompt / Instruções

O Power responde a perguntas como:
- "Verifica se o NUTRIX está no ar"
- "Faz um health check"
- "O backend está funcionando?"
- "Testa a API"
- "O frontend está online?"

---

## Arquitetura Técnica

```
Kiro Chat
    │
    ▼
Kiro Power (nutrix-health-check)
    │
    ▼ MCP Protocol (JSON-RPC via stdio)
    │
MCP Server (Node.js)
    │
    ├── fetch → https://nutrix-backend-fibs.onrender.com/actuator/health
    ├── fetch → https://project-aws-kiro.vercel.app
    └── fetch → https://nutrix-backend-fibs.onrender.com/api/auth/login
```

### Estrutura de Arquivos

```
.kiro/
├── powers/
│   └── nutrix-health-check/
│       ├── POWER.md                    # Documentação do Power
│       └── server/
│           ├── package.json            # Dependências (MCP SDK)
│           ├── index.js                # MCP Server com 4 ferramentas
│           └── node_modules/           # Dependências instaladas
└── settings/
    └── mcp.json                        # Configuração do MCP server
```

### Configuração MCP

```json
{
  "mcpServers": {
    "nutrix-health-check": {
      "command": "node",
      "args": [".kiro/powers/nutrix-health-check/server/index.js"],
      "disabled": false,
      "autoApprove": ["check_all_services", "check_backend", "check_frontend", "check_api"]
    }
  }
}
```

---

## Evidência de Execução

O MCP server foi testado e responde corretamente ao protocolo MCP:

**Inicialização:**
```json
Request:  {"method":"initialize","params":{"protocolVersion":"2024-11-05"}}
Response: {"result":{"capabilities":{"tools":{"listChanged":true}},"serverInfo":{"name":"nutrix-health-check","version":"1.0.0"}}}
```

---

## Ferramentas Utilizadas

- **Kiro Powers** — Sistema de extensões do IDE Kiro
- **Model Context Protocol (MCP)** — Protocolo padrão para comunicação entre IDE e ferramentas externas
- **@modelcontextprotocol/sdk** — SDK oficial do MCP para Node.js
- **Node.js Fetch API** — Para requisições HTTP aos serviços

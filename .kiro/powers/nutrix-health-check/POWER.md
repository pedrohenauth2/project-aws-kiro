# NUTRIX Health Check Power

Power para verificar a saúde de todos os serviços da plataforma NUTRIX (Backend, Frontend e API).

## Problema que resolve

Durante o desenvolvimento, é necessário verificar se os serviços em produção (Render, Vercel) estão funcionando. Sem este Power, o desenvolvedor precisa abrir múltiplas abas no navegador e verificar manualmente cada serviço.

## Como usar

Peça ao agente:
- "Verifica se o NUTRIX está no ar"
- "Faz um health check dos serviços"
- "O backend está funcionando?"

## Ferramentas disponíveis

- **check_all_services** — Verifica todos os serviços de uma vez (backend, frontend, API)
- **check_backend** — Verifica apenas o backend (Render + Actuator)
- **check_frontend** — Verifica apenas o frontend (Vercel)
- **check_api** — Testa o endpoint de login da API

## URLs monitoradas

| Serviço | URL |
|---------|-----|
| Backend Health | https://nutrix-backend-fibs.onrender.com/actuator/health |
| Frontend | https://project-aws-kiro.vercel.app |
| API Login | https://nutrix-backend-fibs.onrender.com/api/auth/login |

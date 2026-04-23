import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import https from "node:https";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

const agent = new https.Agent({ family: 4, rejectUnauthorized: false });
const TIMEOUT = 90000; // 90 segundos - Render free demora ate 60s para acordar

const SERVICES = {
  backend: {
    name: "Backend (Render)",
    url: "https://nutrix-backend-fibs.onrender.com/actuator/health",
  },
  frontend: {
    name: "Frontend (Vercel)",
    url: "https://project-aws-kiro.vercel.app",
  },
  api: {
    name: "API Login",
    url: "https://nutrix-backend-fibs.onrender.com/api/auth/login",
    method: "POST",
    body: JSON.stringify({ username: "test", password: "test" }),
    headers: { "Content-Type": "application/json" },
    expectedError: 401,
  },
};

function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: options.headers || {},
      agent: agent,
      timeout: TIMEOUT,
    };

    const req = https.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });

    req.on("timeout", () => { req.destroy(); reject(new Error(`Timeout (${TIMEOUT/1000}s)`)); });
    req.on("error", (e) => reject(e));

    if (options.body) req.write(options.body);
    req.end();
  });
}

// Acorda o backend do Render antes de fazer os checks
async function wakeUpBackend() {
  try {
    await httpsRequest(SERVICES.backend.url);
  } catch {
    // Ignora erro no warm up - o check real vai capturar
  }
}

async function checkService(service) {
  const start = Date.now();
  try {
    const response = await httpsRequest(service.url, {
      method: service.method || "GET",
      headers: service.headers || {},
      body: service.body,
    });
    const elapsed = Date.now() - start;

    if (service.expectedError && response.status === service.expectedError) {
      return {
        name: service.name,
        url: service.url,
        status: "UP",
        httpStatus: response.status,
        responseTime: `${elapsed}ms`,
        note: "Respondendo corretamente (401 esperado sem credenciais)",
      };
    }

    if (response.status >= 200 && response.status < 400) {
      let details = null;
      try { details = JSON.parse(response.body); } catch {}
      return {
        name: service.name,
        url: service.url,
        status: "UP",
        httpStatus: response.status,
        responseTime: `${elapsed}ms`,
        details,
      };
    }

    return {
      name: service.name,
      url: service.url,
      status: "DEGRADED",
      httpStatus: response.status,
      responseTime: `${elapsed}ms`,
    };
  } catch (error) {
    const elapsed = Date.now() - start;
    return {
      name: service.name,
      url: service.url,
      status: "DOWN",
      responseTime: `${elapsed}ms`,
      error: error.message || "Connection failed",
    };
  }
}

function formatResult(result) {
  const icon = result.status === "UP" ? "✅" : result.status === "DEGRADED" ? "⚠️" : "❌";
  let line = `${icon} ${result.name}: ${result.status} (${result.responseTime})`;
  if (result.httpStatus) line += ` [HTTP ${result.httpStatus}]`;
  if (result.note) line += `\n   ${result.note}`;
  if (result.error) line += `\n   Erro: ${result.error}`;
  if (result.details?.status) line += `\n   Health: ${result.details.status}`;
  return line;
}

const server = new McpServer({
  name: "nutrix-health-check",
  version: "1.0.0",
});

server.tool("check_all_services", "Verifica a saude de todos os servicos NUTRIX (backend, frontend, API)", {}, async () => {
  // Primeiro acorda o backend (pode demorar ate 60s no plano free do Render)
  await wakeUpBackend();

  const results = await Promise.all([
    checkService(SERVICES.backend),
    checkService(SERVICES.frontend),
    checkService(SERVICES.api),
  ]);

  const allUp = results.every((r) => r.status === "UP");
  const summary = allUp
    ? "🟢 Todos os servicos estao funcionando!"
    : "🔴 Alguns servicos estao com problemas.";

  const output = [
    "=== NUTRIX Health Check ===",
    "",
    ...results.map(formatResult),
    "",
    summary,
  ].join("\n");

  return { content: [{ type: "text", text: output }] };
});

server.tool("check_backend", "Verifica a saude do backend NUTRIX no Render", {}, async () => {
  await wakeUpBackend();
  const result = await checkService(SERVICES.backend);
  return { content: [{ type: "text", text: formatResult(result) }] };
});

server.tool("check_frontend", "Verifica a saude do frontend NUTRIX na Vercel", {}, async () => {
  const result = await checkService(SERVICES.frontend);
  return { content: [{ type: "text", text: formatResult(result) }] };
});

server.tool("check_api", "Testa o endpoint de login da API NUTRIX", {}, async () => {
  await wakeUpBackend();
  const result = await checkService(SERVICES.api);
  return { content: [{ type: "text", text: formatResult(result) }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);

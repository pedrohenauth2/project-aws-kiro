# NUTRIX - DESAFIO 3: Agent Hooks no Kiro

## Resumo

Criação de 3 Agent Hooks no Kiro para automatizar atividades recorrentes do fluxo de desenvolvimento do projeto NUTRIX.

---

## Hook 1: Build antes de Commit

**Arquivo:** `.kiro/hooks/build-before-commit.json`

**Gatilho:** `preToolUse` — Antes de executar qualquer comando shell

**Ação:** `askAgent` — O agente verifica se o comando é um `git commit`. Se for, roda `mvn clean install` no backend primeiro. Se o build falhar, o commit é bloqueado.

**Prompt:**
> Verifique se o comando que está prestes a ser executado é um git commit. Se for, primeiro rode 'mvn clean install -f nutrix-backend/pom.xml' e verifique se o build passou. Se o build falhar, NÃO prossiga com o commit e informe o erro. Se não for um git commit, prossiga normalmente.

**Valor gerado:**
- Previne commits com código que não compila
- Garante que testes passam antes de cada commit
- Evita deploys quebrados no Render (que faz build a partir do commit)

**Comportamento esperado:**
1. Desenvolvedor (ou agente) executa `git commit`
2. Hook intercepta antes da execução
3. Agente roda `mvn clean install`
4. Se BUILD SUCCESS → commit prossegue
5. Se BUILD FAILURE → commit é bloqueado, erro é informado

---

## Hook 2: Validar Padrões Java

**Arquivo:** `.kiro/hooks/validate-java-patterns.json`

**Gatilho:** `fileEdited` — Quando qualquer arquivo `*.java` é salvo

**Ação:** `askAgent` — O agente analisa o arquivo e verifica se segue os padrões do projeto NUTRIX.

**Prompt:**
> O arquivo Java foi editado. Verifique se ele segue os padrões do projeto NUTRIX: 1) DTOs sem validação devem ser Java Records. 2) DTOs com Bean Validation devem usar Lombok @Data. 3) O arquivo deve estar no pacote correto. 4) Imports não utilizados devem ser removidos. Se encontrar problemas, sugira as correções.

**Valor gerado:**
- Mantém consistência de código no projeto
- Garante que novos DTOs usem Records (padrão moderno do Java 17)
- Detecta imports não utilizados automaticamente
- Valida estrutura de pacotes

**Comportamento esperado:**
1. Desenvolvedor salva um arquivo `.java`
2. Hook dispara automaticamente
3. Agente lê o arquivo e verifica os 4 critérios
4. Se tudo ok → nenhuma ação
5. Se encontrar problemas → sugere correções no chat

---

## Hook 3: Sugerir Testes para Services

**Arquivo:** `.kiro/hooks/suggest-tests-on-service.json`

**Gatilho:** `fileEdited` — Quando um arquivo `*Service.java` é salvo

**Ação:** `askAgent` — O agente analisa o Service editado e sugere testes que devem ser criados ou atualizados.

**Prompt:**
> Um arquivo Service Java foi editado. Analise o arquivo e verifique: 1) Existem testes unitários correspondentes? 2) Se métodos foram adicionados ou alterados, sugira testes específicos. 3) Para cálculos matemáticos, sugira testes de propriedade com jqwik. 4) Para operações de banco, sugira testes de integração. Não implemente os testes, apenas liste o que deve ser testado.

**Valor gerado:**
- Lembra o desenvolvedor de criar testes ao alterar lógica de negócio
- Sugere o tipo correto de teste (unitário, propriedade, integração)
- Melhora a cobertura de testes do projeto
- Específico para a camada de serviço, onde está a lógica crítica

**Comportamento esperado:**
1. Desenvolvedor edita `TmbService.java` (por exemplo)
2. Hook dispara automaticamente
3. Agente analisa os métodos públicos do Service
4. Agente verifica se existem testes em `TmbServiceTest.java`
5. Agente lista no chat os testes que faltam ou precisam ser atualizados

---

## Resumo dos Hooks

| # | Nome | Gatilho | Tipo | Escopo |
|---|------|---------|------|--------|
| 1 | Build antes de Commit | `preToolUse` (shell) | `askAgent` | Qualquer comando shell |
| 2 | Validar Padrões Java | `fileEdited` | `askAgent` | `**/*.java` |
| 3 | Sugerir Testes para Services | `fileEdited` | `askAgent` | `**/*Service.java` |

## Ferramentas Utilizadas

- **Kiro Agent Hooks** — Sistema de gatilhos automáticos do IDE Kiro
- **Maven** — Build tool para validação de compilação e testes
- **jqwik** — Framework de testes de propriedade sugerido pelo Hook 3

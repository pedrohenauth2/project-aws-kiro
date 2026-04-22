# Requirements Document

## Introduction

O NUTRIX é uma aplicação web de saúde e fitness construída com Angular 17+ (standalone components) no frontend e Java Spring Boot no backend. Este documento cobre o redesign completo do frontend, incluindo a correção de bugs críticos de autenticação e navegação, a substituição de alertas nativos do browser por um sistema de notificações in-app, e uma reformulação visual abrangente com design moderno, responsivo e com identidade visual consistente (paleta verde/azul fitness).

O escopo abrange as telas de Login, Dashboard, Calculadora TMB, Histórico TMB e o Montador de Treino, além de componentes globais como Navbar, Toast Notifications e Loading Spinner.

## Glossary

- **NUTRIX_App**: A aplicação Angular 17+ frontend do NUTRIX
- **Auth_Service**: O serviço Angular `AuthService` responsável por login, logout e gerenciamento do token JWT
- **JWT_Interceptor**: O interceptor HTTP funcional `jwtInterceptor` que injeta o header `Authorization: Bearer <token>` em requisições autenticadas
- **Toast_Service**: O novo serviço Angular `ToastService` responsável por exibir notificações não-bloqueantes (toast) ao usuário
- **Toast_Component**: O componente Angular global que renderiza as notificações do `Toast_Service`
- **Navbar_Component**: O componente de cabeçalho global exibido em todas as telas autenticadas, contendo logo, nome do usuário e botão de logout
- **Dashboard_Component**: O componente da tela principal pós-login com cards de acesso às funcionalidades
- **Login_Component**: O componente da tela de autenticação
- **TMB_Calculator_Component**: O componente da calculadora de Taxa Metabólica Basal
- **TMB_History_Component**: O componente que exibe o histórico de cálculos TMB do usuário
- **Workout_Builder_Component**: O componente do montador de treino semanal
- **TMB**: Taxa Metabólica Basal — energia mínima necessária para manutenção das funções vitais em repouso
- **TDEE**: Total Daily Energy Expenditure — gasto calórico total diário considerando o nível de atividade física
- **Design_System**: Conjunto de variáveis CSS (cores, tipografia, espaçamentos, sombras) definidas em `styles.scss` e aplicadas globalmente

---

## Requirements

### Requirement 1: Correção do Logout

**User Story:** Como usuário autenticado, quero que o botão de sair me redirecione para a tela de login, para que eu possa encerrar minha sessão com segurança.

#### Acceptance Criteria

1. WHEN o usuário clica no botão de logout, THE Auth_Service SHALL remover o token JWT, o username e o fullName do `localStorage`.
2. WHEN o usuário clica no botão de logout, THE NUTRIX_App SHALL redirecionar o usuário para a rota `/login`.
3. WHEN o usuário tenta acessar uma rota protegida após o logout, THE NUTRIX_App SHALL redirecionar o usuário para `/login`.

---

### Requirement 2: Envio Correto do Token JWT nas Requisições

**User Story:** Como usuário autenticado, quero que todas as minhas requisições ao backend incluam meu token JWT, para que eu possa acessar endpoints protegidos como o histórico TMB sem erros de autenticação.

#### Acceptance Criteria

1. WHEN o usuário está autenticado e realiza qualquer requisição HTTP ao backend, THE JWT_Interceptor SHALL adicionar o header `Authorization: Bearer <token>` à requisição.
2. WHEN o usuário não está autenticado e realiza uma requisição HTTP, THE JWT_Interceptor SHALL encaminhar a requisição sem o header `Authorization`.
3. WHEN o endpoint `/api/tmb/history` retorna HTTP 401, THE NUTRIX_App SHALL exibir uma notificação de erro via Toast_Service e redirecionar o usuário para `/login`.

---

### Requirement 3: Sistema de Notificações Toast

**User Story:** Como usuário, quero receber notificações visuais elegantes dentro do aplicativo em vez de alertas bloqueantes do browser, para que minha experiência de uso seja fluida e profissional.

#### Acceptance Criteria

1. THE Toast_Service SHALL expor métodos `showSuccess(message: string)`, `showError(message: string)` e `showInfo(message: string)`.
2. WHEN `showSuccess`, `showError` ou `showInfo` é chamado, THE Toast_Component SHALL exibir a notificação com ícone e cor correspondente ao tipo (verde para sucesso, vermelho para erro, azul para info).
3. WHEN uma notificação é exibida, THE Toast_Component SHALL removê-la automaticamente após 4000 milissegundos.
4. WHEN múltiplas notificações são disparadas em sequência, THE Toast_Component SHALL exibi-las empilhadas verticalmente, respeitando a ordem de chegada.
5. THE NUTRIX_App SHALL substituir todas as chamadas a `alert()` por chamadas ao Toast_Service correspondente.
6. WHEN o usuário clica em uma notificação, THE Toast_Component SHALL removê-la imediatamente.

---

### Requirement 4: Botão de Voltar na Calculadora TMB

**User Story:** Como usuário, quero um botão de voltar para o dashboard na tela da calculadora TMB, para que eu possa navegar facilmente entre as telas sem usar o botão do browser.

#### Acceptance Criteria

1. THE TMB_Calculator_Component SHALL exibir um botão "Voltar ao Dashboard" no cabeçalho da tela.
2. WHEN o usuário clica no botão "Voltar ao Dashboard", THE NUTRIX_App SHALL navegar para a rota `/dashboard`.

---

### Requirement 5: Design System Global

**User Story:** Como usuário, quero que o aplicativo tenha uma identidade visual consistente e profissional com verde como cor principal, para que a experiência de uso seja agradável e transmita energia, saúde e vitalidade.

#### Acceptance Criteria

1. THE Design_System SHALL definir verde como cor principal do aplicativo, com a paleta: `--color-primary: #22c55e`, `--color-primary-dark: #16a34a`, `--color-primary-darker: #15803d`, `--color-primary-light: #4ade80`, `--color-primary-bg: #f0fdf4` como variáveis CSS globais em `styles.scss`.
2. THE Design_System SHALL definir verde escuro como cor de gradiente principal: `linear-gradient(135deg, #16a34a 0%, #22c55e 100%)`, aplicado em botões primários, cards ativos e elementos de destaque.
3. THE Design_System SHALL definir cinza neutro (`#1e293b`, `#334155`, `#64748b`, `#f1f5f9`) como paleta secundária para textos, fundos e bordas.
4. THE Design_System SHALL definir variáveis de tipografia, espaçamento, border-radius e box-shadow consistentes.
5. THE NUTRIX_App SHALL aplicar a fonte `Inter` (Google Fonts) como fonte principal em todo o aplicativo.
6. THE Design_System SHALL incluir classes utilitárias para gradientes verdes, cards com sombra e botões com estados hover e focus acessíveis.
7. WHERE o dispositivo tem largura de tela inferior a 768px, THE NUTRIX_App SHALL adaptar todos os layouts para exibição em coluna única sem overflow horizontal.

---

### Requirement 6: Redesign da Tela de Login

**User Story:** Como usuário, quero uma tela de login visualmente impactante e profissional, para que minha primeira impressão do NUTRIX seja positiva.

#### Acceptance Criteria

1. THE Login_Component SHALL exibir um layout dividido em dois painéis em telas com largura superior a 768px: painel esquerdo com gradiente fitness e mensagem motivacional, painel direito com o formulário de login.
2. THE Login_Component SHALL exibir o logo "NUTRIX" com tipografia bold e destaque visual no painel do formulário.
3. WHEN o formulário de login é submetido com campos inválidos, THE Login_Component SHALL exibir mensagens de erro inline abaixo de cada campo inválido.
4. WHEN o login está em progresso, THE Login_Component SHALL exibir um spinner de carregamento no botão de submit e desabilitá-lo.
5. WHEN o login falha, THE Login_Component SHALL exibir a mensagem de erro via Toast_Service com tipo `showError`.
6. WHERE o dispositivo tem largura de tela inferior a 768px, THE Login_Component SHALL exibir apenas o painel do formulário em tela cheia.

---

### Requirement 7: Navbar Global para Telas Autenticadas

**User Story:** Como usuário autenticado, quero um cabeçalho consistente em todas as telas, para que eu sempre saiba onde estou e possa navegar ou sair facilmente.

#### Acceptance Criteria

1. THE Navbar_Component SHALL ser exibido em todas as rotas protegidas pelo `authGuard`.
2. THE Navbar_Component SHALL exibir o logo "NUTRIX" com link de navegação para `/dashboard`.
3. THE Navbar_Component SHALL exibir o nome completo do usuário autenticado obtido via `Auth_Service`.
4. THE Navbar_Component SHALL exibir um botão de logout que, quando clicado, executa o fluxo definido no Requirement 1.
5. WHERE o dispositivo tem largura de tela inferior a 768px, THE Navbar_Component SHALL colapsar o nome do usuário e exibir apenas o ícone de avatar e o botão de logout.

---

### Requirement 8: Redesign do Dashboard

**User Story:** Como usuário, quero um dashboard visualmente atrativo com cards grandes e informativos, para que eu possa acessar as funcionalidades do NUTRIX de forma intuitiva.

#### Acceptance Criteria

1. THE Dashboard_Component SHALL exibir os cards de funcionalidades em um grid responsivo de 2 colunas em desktop e 1 coluna em mobile.
2. THE Dashboard_Component SHALL exibir cada card com gradiente de cor único, ícone grande, título e descrição da funcionalidade.
3. WHEN o usuário passa o cursor sobre um card ativo, THE Dashboard_Component SHALL aplicar um efeito de elevação (transform translateY e box-shadow aumentado).
4. WHEN o usuário clica em um card inativo, THE Toast_Service SHALL exibir uma notificação do tipo `showInfo` com a mensagem "Funcionalidade disponível em breve!".
5. THE Dashboard_Component SHALL exibir uma saudação personalizada com o nome do usuário e a hora do dia (Bom dia/Boa tarde/Boa noite).

---

### Requirement 9: Redesign da Calculadora TMB

**User Story:** Como usuário, quero uma calculadora TMB com formulário elegante e resultado visual impactante, para que eu compreenda facilmente meus dados metabólicos.

#### Acceptance Criteria

1. THE TMB_Calculator_Component SHALL exibir o formulário com campos agrupados visualmente, labels descritivas e placeholders informativos.
2. WHEN um campo do formulário é tocado e está inválido, THE TMB_Calculator_Component SHALL exibir a borda do campo em vermelho e a mensagem de erro correspondente.
3. WHEN o cálculo é concluído com sucesso, THE TMB_Calculator_Component SHALL exibir os valores de TMB e TDEE em cards coloridos com gradiente, valor numérico em destaque e unidade.
4. WHEN o cálculo falha, THE Toast_Service SHALL exibir uma notificação do tipo `showError` com a mensagem de erro.
5. WHEN o resultado é salvo no histórico com sucesso, THE Toast_Service SHALL exibir uma notificação do tipo `showSuccess` com a mensagem "Resultado salvo no histórico!".
6. WHEN o salvamento no histórico falha, THE Toast_Service SHALL exibir uma notificação do tipo `showError`.
7. WHEN o cálculo está em progresso, THE TMB_Calculator_Component SHALL exibir um spinner de carregamento e desabilitar o botão de submit.

---

### Requirement 10: Redesign do Histórico TMB

**User Story:** Como usuário, quero visualizar meu histórico de cálculos TMB em cards elegantes com layout de timeline, para que eu possa acompanhar minha evolução ao longo do tempo.

#### Acceptance Criteria

1. THE TMB_History_Component SHALL exibir os registros do histórico ordenados por data de cálculo em ordem decrescente (mais recente primeiro).
2. THE TMB_History_Component SHALL exibir cada registro em um card com: data formatada, valores de TMB e TDEE em destaque, e detalhes dos parâmetros utilizados.
3. WHEN o histórico está sendo carregado, THE TMB_History_Component SHALL exibir um skeleton loader ou spinner elegante.
4. WHEN o histórico está vazio, THE TMB_History_Component SHALL exibir um estado vazio com ícone, mensagem e botão de ação para realizar o primeiro cálculo.
5. WHEN o carregamento do histórico falha, THE Toast_Service SHALL exibir uma notificação do tipo `showError` com a mensagem de erro.
6. THE TMB_History_Component SHALL exibir um indicador visual de tendência entre registros consecutivos (aumento ou redução do TDEE).

---

### Requirement 11: Loading States Globais

**User Story:** Como usuário, quero feedback visual claro durante operações assíncronas, para que eu saiba que o aplicativo está processando minha solicitação.

#### Acceptance Criteria

1. WHEN qualquer operação assíncrona está em progresso, THE NUTRIX_App SHALL exibir um indicador de carregamento adequado ao contexto (spinner inline em botões, skeleton em listas, overlay em operações globais).
2. WHEN uma operação assíncrona é concluída (com sucesso ou erro), THE NUTRIX_App SHALL remover o indicador de carregamento imediatamente.
3. WHILE uma operação assíncrona está em progresso, THE NUTRIX_App SHALL desabilitar os controles de formulário e botões de ação relacionados para evitar submissões duplicadas.

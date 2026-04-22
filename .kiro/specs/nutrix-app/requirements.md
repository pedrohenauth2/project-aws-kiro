# Requirements Document

## Introduction

NUTRIX é uma aplicação web voltada para saúde e condicionamento físico, composta por um backend em Java com Spring Boot e um frontend em Angular. A plataforma oferece ao usuário autenticado um dashboard centralizado com acesso a ferramentas ativas — Calculadora de Taxa Metabólica Basal (TMB) e Montador de Treino de Musculação — além de indicação visual de funcionalidades futuras planejadas. O sistema persiste dados por usuário utilizando **Supabase (PostgreSQL)** como banco de dados, permitindo histórico de cálculos e treinos salvos. O schema do banco de dados está definido no arquivo `schema.sql` na raiz do projeto.

---

## Glossary

- **NUTRIX**: Nome da aplicação web de saúde e condicionamento físico.
- **System**: A aplicação NUTRIX como um todo (backend + frontend).
- **Auth_Service**: Componente responsável por autenticação e autorização de usuários via JWT.
- **User**: Pessoa cadastrada e autenticada na plataforma NUTRIX.
- **Dashboard**: Tela principal exibida após login, contendo os cards de funcionalidades.
- **Feature_Card**: Bloco visual no Dashboard que representa uma funcionalidade da plataforma.
- **TMB_Calculator**: Componente responsável pelo cálculo da Taxa Metabólica Basal e do Gasto Calórico Total Diário.
- **TMB**: Taxa Metabólica Basal — energia mínima necessária para manutenção das funções vitais em repouso.
- **TDEE**: Total Daily Energy Expenditure — gasto calórico total diário, calculado aplicando o fator de atividade física sobre a TMB.
- **Mifflin_St_Jeor**: Fórmula científica para cálculo de TMB, considerada uma das mais precisas atualmente.
- **Activity_Factor**: Multiplicador aplicado à TMB para obter o TDEE, baseado no nível de atividade física do usuário.
- **History_Service**: Componente responsável por persistir e recuperar registros históricos de cálculos de TMB vinculados ao usuário.
- **Workout_Builder**: Componente responsável pela criação, edição, persistência e consulta de treinos de musculação.
- **Exercise_Database**: Banco de dados de exercícios físicos, contendo nome, grupo muscular e variações.
- **Muscle_Group**: Categoria de agrupamento de exercícios por região muscular trabalhada.
- **Workout_Plan**: Conjunto de exercícios organizados por dia da semana, associado a um usuário.
- **Workout_Day**: Entrada dentro de um Workout_Plan representando os exercícios de um dia específico da semana.
- **Exercise_Entry**: Registro de um exercício dentro de um Workout_Day, contendo séries, repetições e carga opcional.
- **JWT**: JSON Web Token — padrão de token utilizado para autenticação stateless.
- **API**: Interface de programação de aplicações — endpoints REST expostos pelo backend.
- **Supabase**: Plataforma de banco de dados PostgreSQL gerenciado utilizada como camada de persistência da aplicação.
- **schema.sql**: Arquivo SQL na raiz do projeto contendo a definição completa do schema do banco de dados para ser executado no Supabase.

---

## Requirements

### Requirement 1: Autenticação de Usuário

**User Story:** Como um usuário, quero fazer login com meu nome de usuário e senha, para que eu possa acessar as funcionalidades da plataforma NUTRIX de forma segura.

#### Acceptance Criteria

1. THE Auth_Service SHALL expor um endpoint de autenticação que recebe credenciais de usuário (nome de usuário e senha).
2. WHEN o usuário submete credenciais válidas, THE Auth_Service SHALL retornar um JWT com tempo de expiração definido.
3. WHEN o usuário submete credenciais inválidas, THE Auth_Service SHALL retornar uma resposta de erro com código HTTP 401 e mensagem descritiva.
4. WHILE o JWT estiver válido e não expirado, THE System SHALL permitir acesso aos endpoints protegidos da API.
5. WHEN o JWT estiver expirado ou ausente em uma requisição a endpoint protegido, THE Auth_Service SHALL retornar uma resposta de erro com código HTTP 401.
6. THE Auth_Service SHALL armazenar senhas de usuários utilizando algoritmo de hash seguro (bcrypt ou equivalente), nunca em texto plano.
7. THE System SHALL transmitir credenciais e tokens exclusivamente via HTTPS.
8. WHEN o usuário realiza logout, THE System SHALL invalidar o token JWT no lado do cliente e redirecionar para a tela de login.

---

### Requirement 2: Dashboard Principal

**User Story:** Como um usuário autenticado, quero visualizar um dashboard com meu nome e as funcionalidades disponíveis, para que eu possa navegar rapidamente para as ferramentas que desejo usar.

#### Acceptance Criteria

1. WHEN o usuário acessa o Dashboard após autenticação bem-sucedida, THE System SHALL exibir o nome do usuário autenticado na interface.
2. THE Dashboard SHALL exibir exatamente quatro Feature_Cards: Calculadora de TMB, Montador de Treino de Musculação, Nutrição Inteligente e Cadastro de Exames de Bioimpedância.
3. THE Dashboard SHALL apresentar os Feature_Cards de Calculadora de TMB e Montador de Treino de Musculação como ativos e navegáveis.
4. THE Dashboard SHALL apresentar os Feature_Cards de Nutrição Inteligente e Cadastro de Exames de Bioimpedância como indisponíveis, com indicação visual de bloqueio.
5. WHEN o usuário clica em um Feature_Card ativo, THE System SHALL navegar para a funcionalidade correspondente.
6. WHEN o usuário clica em um Feature_Card indisponível, THE System SHALL exibir uma mensagem informando que a funcionalidade estará disponível em breve, sem navegar para outra tela.
7. WHEN um usuário não autenticado tenta acessar o Dashboard diretamente pela URL, THE System SHALL redirecionar para a tela de login.

---

### Requirement 3: Calculadora de Taxa Metabólica Basal (TMB)

**User Story:** Como um usuário autenticado, quero calcular minha Taxa Metabólica Basal e meu gasto calórico diário total, para que eu possa entender minhas necessidades energéticas com base em dados precisos.

#### Acceptance Criteria

1. THE TMB_Calculator SHALL coletar os seguintes dados de entrada do usuário: peso corporal em quilogramas, altura em centímetros, idade em anos, sexo biológico (masculino ou feminino) e nível de atividade física.
2. THE TMB_Calculator SHALL aceitar os seguintes níveis de atividade física: Sedentário, Levemente Ativo, Moderadamente Ativo, Muito Ativo e Extremamente Ativo, cada um com seu respectivo Activity_Factor definido.
3. WHEN o usuário submete os dados de entrada válidos, THE TMB_Calculator SHALL calcular a TMB utilizando a fórmula Mifflin-St Jeor:
   - Para sexo masculino: TMB = (10 × peso) + (6,25 × altura) − (5 × idade) + 5
   - Para sexo feminino: TMB = (10 × peso) + (6,25 × altura) − (5 × idade) − 161
4. WHEN a TMB for calculada, THE TMB_Calculator SHALL calcular o TDEE multiplicando a TMB pelo Activity_Factor correspondente ao nível de atividade informado.
5. WHEN o cálculo for concluído, THE TMB_Calculator SHALL exibir os valores de TMB e TDEE em quilocalorias (kcal) com precisão de duas casas decimais.
6. IF o usuário submete dados de entrada com valores fora dos intervalos aceitáveis (peso ≤ 0, altura ≤ 0, idade ≤ 0 ou idade > 120), THEN THE TMB_Calculator SHALL exibir uma mensagem de erro descritiva e não realizar o cálculo.
7. WHEN o cálculo for exibido, THE TMB_Calculator SHALL perguntar ao usuário se deseja salvar o resultado no histórico.
8. WHEN o usuário confirma o salvamento, THE History_Service SHALL persistir o registro contendo TMB, TDEE, dados de entrada utilizados, data e hora do cálculo, vinculado ao usuário autenticado.
9. WHEN o usuário recusa o salvamento, THE System SHALL manter o resultado exibido na tela sem persistir nenhum dado.
10. THE TMB_Calculator SHALL realizar os cálculos de TMB e TDEE no backend, retornando os resultados via API.

---

### Requirement 4: Histórico de Cálculos de TMB

**User Story:** Como um usuário autenticado, quero consultar meu histórico de cálculos de TMB salvos, para que eu possa acompanhar a evolução dos meus dados ao longo do tempo.

#### Acceptance Criteria

1. THE History_Service SHALL expor um endpoint que retorna todos os registros de TMB salvos pelo usuário autenticado, ordenados por data e hora de forma decrescente.
2. WHEN o usuário acessa o histórico de TMB, THE System SHALL exibir cada registro com: data e hora do cálculo, valores de TMB e TDEE, e os dados de entrada utilizados.
3. WHEN o usuário não possui registros salvos, THE System SHALL exibir uma mensagem informando que nenhum histórico foi encontrado.
4. THE History_Service SHALL retornar exclusivamente os registros pertencentes ao usuário autenticado, sem expor dados de outros usuários.

---

### Requirement 5: Banco de Exercícios

**User Story:** Como um usuário autenticado, quero acessar um banco de exercícios organizado por grupo muscular com variações, para que eu possa selecionar exercícios adequados ao montar meu treino.

#### Acceptance Criteria

1. THE Exercise_Database SHALL conter exercícios organizados pelos seguintes Muscle_Groups: Peito, Costas, Bíceps, Tríceps, Ombros, Pernas, Glúteos, Abdômen e Cardio.
2. THE Exercise_Database SHALL armazenar para cada exercício: nome, Muscle_Group ao qual pertence e lista de variações disponíveis.
3. THE System SHALL expor um endpoint que retorna todos os exercícios do Exercise_Database, agrupados por Muscle_Group.
4. THE System SHALL expor um endpoint que retorna os exercícios filtrados por um Muscle_Group específico.
5. WHEN o usuário solicita a lista de exercícios, THE System SHALL retornar os dados em até 500ms para o banco completo.

---

### Requirement 6: Montador de Treino de Musculação

**User Story:** Como um usuário autenticado, quero montar, salvar, consultar e editar meu plano de treino semanal de musculação, para que eu possa organizar meus exercícios por dia da semana com séries, repetições e carga.

#### Acceptance Criteria

1. THE Workout_Builder SHALL permitir que o usuário crie um Workout_Plan com Workout_Days para qualquer combinação dos sete dias da semana (segunda-feira a domingo).
2. WHEN o usuário adiciona um exercício a um Workout_Day, THE Workout_Builder SHALL registrar um Exercise_Entry contendo: exercício selecionado do Exercise_Database, número de séries (inteiro positivo), número de repetições (inteiro positivo) e carga em quilogramas (valor numérico positivo, opcional).
3. IF o usuário submete um Exercise_Entry com número de séries ou repetições menor ou igual a zero, THEN THE Workout_Builder SHALL exibir uma mensagem de erro descritiva e não salvar o registro.
4. THE Workout_Builder SHALL permitir que o usuário adicione múltiplos Exercise_Entries a um mesmo Workout_Day.
5. THE Workout_Builder SHALL persistir o Workout_Plan no banco de dados vinculado ao usuário autenticado.
6. WHEN o usuário acessa o Workout_Builder, THE System SHALL carregar e exibir o Workout_Plan salvo mais recente do usuário, se existir.
7. THE Workout_Builder SHALL permitir que o usuário edite qualquer Exercise_Entry de um Workout_Plan existente, incluindo alteração de séries, repetições e carga.
8. THE Workout_Builder SHALL permitir que o usuário remova um Exercise_Entry de um Workout_Day.
9. THE Workout_Builder SHALL permitir que o usuário remova todos os exercícios de um Workout_Day, tornando-o um dia de descanso.
10. WHEN o usuário salva alterações em um Workout_Plan existente, THE Workout_Builder SHALL atualizar o registro persistido sem criar duplicatas.
11. THE Workout_Builder SHALL expor endpoints de API para criação, leitura, atualização e remoção de Workout_Plans, todos protegidos por autenticação JWT.
12. THE History_Service SHALL garantir que cada usuário acesse exclusivamente seus próprios Workout_Plans, sem exposição de dados de outros usuários.

---

### Requirement 7: Funcionalidades Futuras (Indisponíveis)

**User Story:** Como um usuário, quero visualizar as funcionalidades planejadas para o futuro na interface, para que eu saiba o que estará disponível em versões futuras da plataforma.

#### Acceptance Criteria

1. THE Dashboard SHALL exibir o Feature_Card de Nutrição Inteligente com indicação visual de indisponibilidade (ícone de cadeado ou equivalente) e rótulo textual "Em breve".
2. THE Dashboard SHALL exibir o Feature_Card de Cadastro de Exames de Bioimpedância com indicação visual de indisponibilidade (ícone de cadeado ou equivalente) e rótulo textual "Em breve".
3. THE System SHALL garantir que não existam endpoints de API ativos para as funcionalidades de Nutrição Inteligente e Cadastro de Exames de Bioimpedância nesta versão.

---

### Requirement 8: Segurança e Proteção de Dados

**User Story:** Como um usuário, quero que meus dados pessoais e de saúde sejam protegidos adequadamente, para que eu possa utilizar a plataforma com confiança.

#### Acceptance Criteria

1. THE System SHALL proteger todos os endpoints da API, exceto o endpoint de autenticação, exigindo um JWT válido em cada requisição.
2. THE Auth_Service SHALL definir um tempo de expiração máximo de 24 horas para tokens JWT emitidos.
3. THE System SHALL validar e sanitizar todos os dados de entrada recebidos via API antes de processá-los ou persistí-los.
4. THE System SHALL retornar mensagens de erro genéricas para falhas de autenticação, sem revelar se o nome de usuário ou a senha estão incorretos separadamente.
5. THE System SHALL registrar em log todas as tentativas de autenticação malsucedidas, incluindo data, hora e identificador do usuário tentado, sem registrar a senha fornecida.

---

### Requirement 9: Banco de Dados e Infraestrutura

**User Story:** Como desenvolvedor, quero que a aplicação utilize Supabase como banco de dados gerenciado, para que eu possa provisionar e gerenciar o schema de forma simples e confiável.

#### Acceptance Criteria

1. THE System SHALL utilizar Supabase (PostgreSQL) como banco de dados de persistência para todos os dados da aplicação.
2. THE System SHALL disponibilizar um arquivo `schema.sql` na raiz do projeto contendo a definição completa de todas as tabelas, índices, constraints e dados iniciais necessários para o funcionamento da aplicação.
3. THE System SHALL conectar ao Supabase a partir do backend Java/Spring Boot utilizando as credenciais de conexão configuradas via variáveis de ambiente, nunca hardcoded no código-fonte.
4. THE schema.sql SHALL incluir os dados iniciais do banco de exercícios (grupos musculares, exercícios e variações) para que a aplicação funcione imediatamente após a execução do script.
5. THE System SHALL habilitar Row Level Security (RLS) no Supabase nas tabelas que contêm dados sensíveis de usuários (histórico de TMB, planos de treino, dias de treino, entradas de exercício).


---

### Requirement 10: Correção do Logout

**User Story:** Como usuário autenticado, quero que o botão de sair me redirecione para a tela de login, para que eu possa encerrar minha sessão com segurança.

#### Acceptance Criteria

1. WHEN o usuário clica no botão de logout, THE Auth_Service SHALL remover o token JWT, o username e o fullName do `localStorage`.
2. WHEN o usuário clica no botão de logout, THE System SHALL redirecionar o usuário para a rota `/login`.
3. WHEN o usuário tenta acessar uma rota protegida após o logout, THE System SHALL redirecionar o usuário para `/login`.

---

### Requirement 11: Sistema de Notificações Toast

**User Story:** Como usuário, quero receber notificações visuais elegantes dentro do aplicativo em vez de alertas bloqueantes do browser, para que minha experiência de uso seja fluida e profissional.

#### Acceptance Criteria

1. THE Toast_Service SHALL expor métodos `showSuccess(message)`, `showError(message)` e `showInfo(message)`.
2. WHEN um método de toast é chamado, THE Toast_Component SHALL exibir a notificação com ícone e cor correspondente ao tipo (verde para sucesso, vermelho para erro, azul para info).
3. WHEN uma notificação é exibida, THE Toast_Component SHALL removê-la automaticamente após 4000 milissegundos.
4. WHEN múltiplas notificações são disparadas em sequência, THE Toast_Component SHALL exibi-las empilhadas verticalmente, respeitando a ordem de chegada.
5. THE System SHALL substituir todas as chamadas a `alert()` por chamadas ao Toast_Service correspondente.

---

### Requirement 12: Design System Global

**User Story:** Como usuário, quero que o aplicativo tenha uma identidade visual consistente e profissional com verde como cor principal.

#### Acceptance Criteria

1. THE Design_System SHALL definir verde como cor principal (`--color-primary: #22c55e`) com paleta completa de variações.
2. THE Design_System SHALL definir gradiente principal: `linear-gradient(135deg, #16a34a 0%, #22c55e 100%)`.
3. THE Design_System SHALL definir variáveis de tipografia, espaçamento, border-radius e box-shadow consistentes.
4. WHERE o dispositivo tem largura de tela inferior a 768px, THE System SHALL adaptar todos os layouts para exibição em coluna única sem overflow horizontal.

---

### Requirement 13: Navbar Global para Telas Autenticadas

**User Story:** Como usuário autenticado, quero um cabeçalho consistente em todas as telas com navegação e logout.

#### Acceptance Criteria

1. THE Navbar_Component SHALL ser exibido em todas as rotas protegidas pelo `authGuard`.
2. THE Navbar_Component SHALL exibir o logo "NUTRIX" com link para `/dashboard`.
3. THE Navbar_Component SHALL exibir o nome completo do usuário e botão de logout.
4. WHERE o dispositivo tem largura inferior a 768px, THE Navbar_Component SHALL colapsar para exibição compacta.

---

### Requirement 14: Redesign da Tela de Login

**User Story:** Como usuário, quero uma tela de login visualmente impactante com layout de 2 painéis em desktop.

#### Acceptance Criteria

1. THE Login_Component SHALL exibir layout dividido em dois painéis em telas > 768px: painel esquerdo com gradiente e painel direito com formulário.
2. WHEN o login está em progresso, THE Login_Component SHALL exibir spinner e desabilitar o botão.
3. WHEN o login falha, THE Login_Component SHALL exibir erro via Toast_Service.
4. WHERE o dispositivo tem largura inferior a 768px, THE Login_Component SHALL exibir apenas o formulário em tela cheia.

---

### Requirement 15: Redesign do Dashboard

**User Story:** Como usuário, quero um dashboard com cards grandes, saudação personalizada e indicação visual de funcionalidades futuras.

#### Acceptance Criteria

1. THE Dashboard_Component SHALL exibir cards em grid responsivo (2 colunas desktop, 1 coluna mobile).
2. THE Dashboard_Component SHALL exibir saudação personalizada com nome do usuário e hora do dia (Bom dia/Boa tarde/Boa noite).
3. WHEN o usuário clica em um card inativo, THE Toast_Service SHALL exibir "Funcionalidade disponível em breve!".

---

### Requirement 16: Redesign da Calculadora TMB

**User Story:** Como usuário, quero uma calculadora TMB com formulário elegante, resultado visual em cards coloridos e botão de voltar ao dashboard.

#### Acceptance Criteria

1. THE TMB_Calculator_Component SHALL exibir botão "Voltar ao Dashboard" no cabeçalho.
2. WHEN o cálculo é concluído, THE TMB_Calculator_Component SHALL exibir TMB e TDEE em cards com gradiente.
3. WHEN o resultado é salvo, THE Toast_Service SHALL exibir "Resultado salvo no histórico!".

---

### Requirement 17: Redesign do Histórico TMB

**User Story:** Como usuário, quero visualizar meu histórico em cards com timeline e indicadores de tendência.

#### Acceptance Criteria

1. THE TMB_History_Component SHALL exibir registros ordenados por data decrescente.
2. WHEN o histórico está carregando, THE TMB_History_Component SHALL exibir skeleton loader.
3. WHEN o histórico está vazio, THE TMB_History_Component SHALL exibir empty state com botão para primeiro cálculo.
4. THE TMB_History_Component SHALL exibir indicador de tendência entre registros consecutivos (↑ ↓ →).

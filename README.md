# Terrário

O Terrário é a página pessoal que concentra projetos em desenvolvimento e ferramentas de apoio ao trabalho. A interface funciona como um ponto de orientação rápido: mostra o que está crescendo, dá acesso direto a cada projeto e reúne somente os sinais úteis para o dia a dia.

**Página publicada:** https://alanferreiras-web.github.io/terrario/

## Princípios de uso

- **Projeto é muda.** Cada projeto em desenvolvimento ocupa um círculo próprio e pode ter sua representação visual alterada conforme amadurece.
- **Ferramenta não é muda.** Pomodoro, Taxímetro e e-mail ajudam o trabalho, mas aparecem como widgets ou links separados.
- **Pouca informação por vez.** A home prioriza leitura imediata e evita reproduzir painéis completos de cada projeto.
- **Detalhes permanecem na origem.** Demandas, regras e documentação interna pertencem ao README de cada projeto.
- **A home continua útil sem integrações.** Widgets desconectados assumem um estado claro e não impedem o acesso às mudas.

## Organização da interface

### Cabeçalho

O cabeçalho reúne:

- botão sanfona para abrir o menu lateral;
- título **Terrário**;
- relógio local;
- data completa em uma pílula separada.

### Painel bento

A área principal usa uma composição bento responsiva com:

- mudas sempre apresentadas em círculos de proporção `1:1`;
- três mudas ativas no estado atual;
- três espaços reservados, permitindo visualizar até seis projetos por ciclo;
- widgets de apoio encaixados entre as mudas;
- reorganização automática para telas menores.

Os círculos podem representar três estados visuais: **germinando**, **crescendo** e **florescendo**. O Terrário exibe esse estado, mas a regra definitiva que determina a evolução de cada muda ainda pertence ao fluxo do respectivo projeto.

### Menu lateral

O menu lateral é a lista completa e textual do Terrário. Ele separa:

- **Mudas:** projetos em desenvolvimento;
- **Ferramentas:** utilitários já funcionais que não participam do ciclo de crescimento.

O menu fecha pelo botão, pelo fundo, pela tecla `Esc` ou ao escolher um destino. O foco retorna ao controle adequado para manter a navegação por teclado previsível.

## Mudas atuais

- **Novela Vertical** — aberta dentro do Terrário em uma visualização dedicada.
- **Voltinha** — aplicação independente carregada dentro do Terrário.
- **Banca** — aplicação externa aberta em uma nova aba.

Esta lista descreve apenas o comportamento de navegação. Escopo, tarefas, dados e regras internas devem ser consultados no README de cada projeto.

## Widgets

### Pomodoro

O Pomodoro oferece ciclos rápidos de **15, 25 ou 50 minutos**.

- iniciar, pausar e reiniciar com poucos cliques;
- contador branco de alto contraste;
- barra de progresso do ciclo;
- aviso visual ao finalizar;
- dois sinais sonoros curtos ao concluir;
- alteração temporária do título da página para indicar a conclusão.

O som é preparado após a primeira interação com o botão, respeitando as restrições de reprodução automática do navegador. Não existe notificação do sistema operacional.

### Taxímetro de IA

O widget consulta o serviço local do projeto **Taxímetro de IAs** e resume o retorno de `/api/widget`.

Ele mostra:

- fonte principal, normalmente Codex;
- janela e percentual de uso;
- barra e medidor circular de consumo;
- fontes disponíveis;
- até três tarefas recentes da fonte principal;
- título da tarefa, tokens e tempo desde a atividade;
- atualização manual e atualização automática a cada cinco minutos.

As tarefas vêm de `data.sources[].conversations`. O Terrário não cria relações entre elas, não consulta outro endpoint e não lê conteúdo de mensagens. Títulos longos são truncados em uma linha. Quando não existem tarefas, a área correspondente é ocultada.

O navegador tenta acessar o serviço local nas portas `3000` e `3001`. Se ele estiver desligado, o widget mostra um estado desconectado e oferece acesso à página local do Taxímetro. O menu lateral também possui um link para a ferramenta, separado das mudas.

Credenciais, conectores, cache e coleta de dados continuam sob responsabilidade do projeto Taxímetro. O Terrário recebe somente o modelo resumido entregue pelo endpoint.

### E-mails importantes

O espaço de e-mails está desenhado, mas ainda não possui integração real. Até a conexão existir, ele informa explicitamente que o Gmail não está conectado e não exibe mensagens fictícias.

## Navegação dos projetos

Novela Vertical e Voltinha usam uma visualização sobreposta com barra própria para retornar ao Terrário. A Banca permanece em nova aba para preservar sua aplicação independente. A visualização sobreposta também pode ser fechada com `Esc`.

O Terrário não deve modificar código ou estado interno de uma aplicação incorporada. Sua responsabilidade termina no acesso, no enquadramento visual e nos sinais resumidos autorizados por cada projeto.

## Dados locais e privacidade

- estágios das mudas podem ser recuperados do `localStorage` do navegador;
- o progresso interno da Novela Vertical continua armazenado pela própria página;
- o Pomodoro funciona apenas durante a sessão aberta;
- credenciais do Taxímetro permanecem no serviço local e não são copiadas para o Terrário;
- o widget de e-mail não acessa dados enquanto estiver desconectado.

## Responsabilidade da documentação

Este README documenta a **usabilidade geral do Terrário**: organização, navegação, widgets, integrações e limites entre projetos.

Cada muda mantém sua própria documentação para explicar:

- objetivo e escopo;
- demandas internas;
- dados e integrações;
- critérios de progresso;
- instalação e manutenção específicas.

Evitar duplicar essas informações aqui reduz divergências e mantém o Terrário leve também como documentação.

## Próximos passos acordados

Os próximos ajustes devem preservar a estrutura atual e priorizar o uso diário no laptop. O Terrário deve funcionar como a página mantida aberta para começar o dia, com leitura rápida, poucas ações e poucos modais.

### Nova organização das mudas

- reduzir o diâmetro das mudas para acomodar **quatro círculos na primeira linha**, dentro do espaço atualmente ocupado pelas três mudas;
- manter cada muda em proporção `1:1`;
- preservar a caixa de entrada exatamente como está;
- tratar inicialmente os novos círculos como espaços vazios, preenchidos pelo usuário;
- manter a adaptação para telas menores, embora a experiência principal seja desenhada para laptop.

### Representação e sinais de cada projeto

Cada muda deverá:

- exibir um PNG original escolhido para representar o projeto;
- usar uma borda circular como indicador da porcentagem de desenvolvimento;
- receber futuramente o progresso por um padrão de dados publicado pelo próprio projeto, sem transferir suas demandas internas para o Terrário;
- permitir pequenos sinais externos e contextuais, como uma carta quando uma nova edição da Voltinha estiver pronta;
- ocultar esses sinais quando não houver novidade, evitando poluição visual.

No laptop, o hover poderá revelar ações leves sobre a própria muda. O clique principal deve abrir o link do projeto. Controles complementares podem aparecer em um pequeno popover, sem exigir um modal de navegação. A integração específica com grupos de abas do Chrome não faz parte desta etapa.

### Cadastro pelo espaço vazio

O botão `+` de uma posição vazia abrirá um único modal para criar ou editar uma muda. O formulário deverá permitir:

- informar o nome do projeto;
- colar o link principal do projeto no GitHub;
- enviar o PNG de representação;
- indicar se o projeto está em desenvolvimento ou concluído;
- escolher se ele permanece visível no painel ou fica guardado na bandeja de projetos.

Ao salvar, o Terrário deverá criar a muda, usar o link como destino principal e adicionar automaticamente o projeto ao menu lateral.

O **estado do projeto** e o **local de exibição** são informações independentes. Assim, um projeto concluído pode continuar no painel, como a Voltinha, enquanto um projeto concluído ou ainda incompleto pode ser guardado para uso futuro.

### Bandeja de projetos

A terceira linha receberá uma bandeja compacta para projetos guardados. Ela deve representar um arquivo acessível, sem competir visualmente com as mudas ativas. Um projeto guardado poderá ser reaberto, editado ou devolvido ao painel posteriormente.

### Persistência local

Nesta etapa, não haverá conta, servidor de dados ou sincronização entre dispositivos:

- metadados e preferências dos projetos serão mantidos no `localStorage`;
- imagens PNG serão armazenadas no `IndexedDB`;
- os dados pertencerão ao navegador usado no laptop;
- limpar os dados do navegador poderá apagar os cadastros locais.

Exportação, importação de backup e sincronização poderão ser adicionadas depois sem alterar o fluxo principal do modal.

### Integrações futuras

Um projeto poderá futuramente receber um link do Notion para alimentar sua visualização ou seus sinais de progresso. Essa integração fica fora da primeira implementação e não deve ampliar o modal ou a arquitetura agora.

## Arquitetura

O Terrário é uma aplicação estática em HTML, CSS e JavaScript puro, compatível com GitHub Pages.

- `index.html` — estrutura da home, menu, widgets e visualização de projetos;
- `garden.css` — sistema visual bento, responsividade, mudas e estados dos widgets;
- `garden.js` — relógio, Pomodoro, navegação, estágios locais e integração resumida do Taxímetro;
- `novela.html` — página interna da Novela Vertical, mantida como superfície independente.

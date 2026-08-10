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

## Arquitetura

O Terrário é uma aplicação estática em HTML, CSS e JavaScript puro, compatível com GitHub Pages.

- `index.html` — estrutura da home, menu, widgets e visualização de projetos;
- `garden.css` — sistema visual bento, responsividade, mudas e estados dos widgets;
- `garden.js` — relógio, Pomodoro, navegação, estágios locais e integração resumida do Taxímetro;
- `novela.html` — página interna da Novela Vertical, mantida como superfície independente.

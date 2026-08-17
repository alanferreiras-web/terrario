# Projetos e ecossistema pessoal

Este documento é um mapa leve dos projetos e das ferramentas usadas para cuidar deles. Ele não substitui o espaço de trabalho diário: registra o propósito de cada parte e evita que decisões importantes fiquem presas a uma conversa.

## Como o ecossistema se organiza

- **Notion** é a fonte de verdade para frentes, projetos, tarefas, rascunhos e contexto de trabalho.
- **Mesa de trabalho** reúne as tarefas de todas as frentes e oferece uma visão única do dia.
- **Codex** interpreta sementes, ajuda a estruturar projetos e executa ações apenas quando recebe um comando explícito.
- **Terrário** é a superfície pessoal de orientação e acesso aos projetos e às ferramentas.
- **GitHub** guarda código e documentação durável em Markdown.
- **E-mail** continua sendo uma entrada de demandas e contexto; sua integração será definida sem transformar a caixa de entrada em outro gerenciador de tarefas.

## Modelo de organização

Uma **frente** é uma relação contínua, como um cliente ou uma iniciativa autoral. Um **projeto** é um desafio temporário dentro dessa frente. Uma **tarefa** é uma ação pequena que ajuda o projeto a avançar.

Exemplos atuais:

- Mesa → Leader Assessment
- Kollab → Estratégia de comunicação/lançamento
- Trendices → Relançamento
- Iorguti → Estratégia de marca

Loop é uma frente que poderá receber novos projetos quando necessário.

## Mesa de trabalho

A Mesa de trabalho usa uma base-mãe de tarefas. Cada página de projeto mostra uma visualização filtrada dessa mesma base, seguindo a ordem:

`Sem status → A fazer → Em andamento → Concluído`

O campo `Foco` destaca o que merece atenção no dia. Tarefas pessoais rápidas permanecem no To-do e não viram projetos.

## Cultivar projeto

O fluxo começa com uma semente escrita livremente no Notion. Enquanto estiver em `Rascunho`, nada acontece. O botão `Analisar` apenas coloca a semente em uma fila; no Codex, o comando `analisar sementes` inicia a interpretação.

O agente pergunta apenas o que estiver ausente ou ambíguo. Nenhuma frente, página, projeto ou tarefa é criada antes da confirmação. A especificação completa está em [agente-cultivar-projeto.md](agente-cultivar-projeto.md).

## Projetos no GitHub

- [Terrário](https://github.com/alanferreiras-web/terrario) — página pessoal que reúne projetos em desenvolvimento e ferramentas de apoio ao trabalho.
- [Voltinha](https://github.com/alanferreiras-web/voltinha) — projeto autoral incorporado ao Terrário; sua descrição detalhada ainda será consolidada no próprio repositório.
- [Banca Feiras](https://github.com/alanferreiras-web/bancafeiras) — aplicação independente acessada pelo Terrário; sua descrição detalhada ainda será consolidada no próprio repositório.
- [Moodjobs](https://github.com/alanferreiras-web/moodjobs) — projeto existente no GitHub cuja intenção será registrada quando voltar ao trabalho ativo.
- [Taxímetro de IAs](https://github.com/alanferreiras-web/taximetro-de-ias) — ferramenta local para acompanhar uso de IA por agente e tarefa.

## Princípios

- produtividade deve reduzir peso, não produzir mais manutenção;
- rascunhos não disparam trabalho;
- uma informação deve ter uma fonte de verdade;
- o Notion cuida do trabalho vivo e o GitHub guarda memória durável;
- credenciais sensíveis permanecem em um gerenciador de senhas;
- integrações devem acrescentar clareza antes de acrescentar automação.

## Próximas integrações possíveis

- transformar as tarefas marcadas com `Foco` em um texto simples no To-do;
- mostrar no Terrário sinais resumidos dos projetos ativos;
- levar demandas relevantes do e-mail para a Mesa de trabalho mediante confirmação;
- manter este mapa atualizado quando um projeto for cultivado ou encerrado.

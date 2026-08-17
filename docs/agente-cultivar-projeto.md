# Agente Cultivar Projeto

## Intenção

Transformar uma anotação deliberadamente escolhida em um projeto organizado, sem reagir a rascunhos espontâneos e sem acrescentar peso ao uso diário da Mesa de trabalho.

O agente só trabalha quando uma semente recebe uma ação explícita. Uma semente em `Rascunho` nunca dispara trabalho.

## Comando de ativação

Comando principal no editor:

> cultivar projeto

Também pode receber uma referência:

> cultivar projeto: [nome ou link da anotação]

Sem esse comando, o agente não interpreta, organiza, programa nem transforma anotações em tarefas.

Na base `Sementes`, o botão `Analisar` muda somente o estado da semente. Depois da confirmação, `Estado = Cultivar` autoriza a criação.

### Acionamento gratuito

O botão `Analisar` da base de sementes é uma campainha, não um agente do Notion. Ao ser clicado, ele muda apenas `Estado` para `Analisar`, sem usar Notion AI, webhook ou automação paga.

Depois, no Codex, o comando curto é:

> analisar sementes

O Codex consulta somente as sementes com `Estado = Analisar`, devolve a interpretação e as perguntas necessárias e muda o estado para `Aguardando confirmação`. Nenhuma página ou tarefa é criada nessa etapa.

Após o usuário escolher `Criar` e autorizar a execução, o Codex recebe:

> cultivar sementes confirmadas

Somente sementes com a confirmação esperada podem então gerar frente, projeto, página e tarefas. Essa separação mantém rascunhos seguros e funciona sem assinatura paga do Notion.

## Entrada

Uma anotação livre pode conter, sem formato obrigatório:

- nome provisório;
- contexto e intenção;
- referências e links;
- entregas imaginadas;
- tarefas soltas;
- dúvidas;
- prazos, quando realmente existirem.

O texto original deve ser preservado na página criada. O agente pode reorganizá-lo, mas não deve apagar a fonte.

## Fluxo

1. Ler somente a anotação indicada pelo comando.
2. Identificar o nome mais provável do projeto.
3. Resumir a intenção em poucas linhas, sem inventar escopo.
4. Separar referências, decisões, dúvidas e possíveis tarefas.
5. Identificar se a frente é um `Cliente` ou `Autoral` e se ela já existe.
6. Se for uma frente nova, criar sua página em `Clientes ativos` ou `Autorais` somente após confirmação.
7. Criar um item técnico na base `Projetos`, inicialmente com `Estado = Ativo`.
8. Criar a página visível do projeto dentro da frente escolhida, usando a estrutura definida abaixo.
9. Criar na base-mãe apenas as tarefas autorizadas pelo modo escolhido.
10. Relacionar cada tarefa ao projeto criado e registrar sua frente.
11. Deixar as tarefas iniciais em `Sem status`, salvo quando o rascunho indicar outro estado de maneira inequívoca.
12. Criar na página uma visualização do quadro filtrada para aquele projeto, na ordem:
    `Sem status → A fazer → Em andamento → Concluído`.
13. Atualizar a semente para `Cultivado`, vinculando o projeto e a página criados.
14. Informar o que foi criado e listar ambiguidades que permaneceram abertas.

Se o nome ou o limite do projeto estiver realmente ambíguo, o agente faz uma pergunta curta antes de criar qualquer coisa.

## Perguntas e confirmação

O agente preenche tudo o que conseguir inferir e pergunta somente o que estiver ausente ou ambíguo. As respostas padronizadas são:

- `Criar`, `Ajustar` ou `Guardar rascunho`;
- `Só explícitas`, `Sugerir` ou `Só projeto` para o tratamento das tarefas;
- `Cliente` ou `Autoral` apenas quando o tipo de frente não estiver claro.

Quando a estrutura estiver clara, o retorno deve ser curto, por exemplo: `Entendi: Broders → Nubank`.

O fluxo da base é:

`Rascunho → Analisar → Aguardando confirmação → Cultivar → Cultivado`

Se algo estiver ambíguo, usar `Precisa de ajuste`. Se houver falha técnica, usar `Erro` sem criar páginas parciais adicionais.

## Estrutura da página de projeto

### Visão geral

Resumo curto do propósito e do resultado desejado.

### Notas da semente

Anotação original preservada, seguida de uma organização leve quando isso ajudar.

### Acessos

Área de referência para serviços usados no projeto. Pode conter:

- nome do serviço;
- link de acesso;
- nome de usuário ou e-mail;
- ambiente ou finalidade;
- link para o item correspondente no gerenciador de senhas;
- observações não sensíveis.

Não guardar no Notion senhas importantes, tokens, chaves de API, códigos de recuperação ou respostas de segurança. O segredo permanece em um gerenciador de senhas; a página do projeto guarda apenas o caminho para encontrá-lo.

### Tarefas

Quadro vinculado à base-mãe e filtrado pelo projeto atual.

### Referências

Links, arquivos e materiais úteis que não são tarefas.

### Decisões e dúvidas

Registro enxuto do que foi decidido e do que ainda precisa ser resolvido.

## Regras de leveza

- Não criar tarefas para cada frase da anotação.
- Não inventar prazos, responsáveis ou entregas.
- Não transformar referências em tarefas.
- Não criar subtarefas preventivas sem necessidade evidente.
- Não modificar outros projetos.
- Não iniciar trabalho técnico descrito no rascunho.
- Não agir novamente depois da criação, salvo por novo comando explícito.

## Credenciais e acessos

`Acessos` é uma referência do projeto, não uma etapa de trabalho. Por isso, deve ficar dentro da página do projeto, perto da visão geral, e não como card permanente do kanban.

Se o número de acessos crescer, a mesma interface pode virar uma visualização filtrada de uma base central `Acessos`, relacionada aos projetos. Isso mantém a experiência dentro da página sem duplicar informações.

## Critérios de sucesso

- Um rascunho não gera nenhuma ação por conta própria.
- Um comando explícito cria exatamente um projeto.
- A página criada preserva as notas originais.
- O projeto aparece na base de Projetos.
- As tarefas criadas vivem na base-mãe e têm relação com o projeto.
- O quadro da página mostra somente as tarefas daquele projeto.
- O layout e os quadros já existentes continuam funcionando.
- Nenhum segredo relevante é copiado para o Notion.

## Fora do escopo por enquanto

- execução automática de programação;
- acompanhamento autônomo do projeto;
- criação a partir de qualquer anotação sem comando;
- sincronização com Terrário, e-mail ou calendário;
- armazenamento de senhas e segredos no Notion.

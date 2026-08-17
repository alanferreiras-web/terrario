# Terrário

O Terrário é a página pessoal que concentra projetos, aplicações prontas e ferramentas de apoio ao trabalho. A interface funciona como um ponto de orientação rápido: mostra o que está em andamento, dá acesso direto a cada projeto e reúne somente os sinais úteis para o dia a dia.

**Página publicada:** https://alanferreiras-web.github.io/terrario/

## Responsabilidade do Terrário

O Terrário é uma camada de controle pessoal. Sua responsabilidade é cadastrar, organizar e abrir registros, mostrar um resumo autorizado de cada integração e apoiar a rotina de trabalho.

Ele não reproduz a interface, as regras, os dados ou a documentação interna dos projetos e aplicações. Cada destino continua responsável por seu próprio funcionamento. Quando o Terrário abre uma URL ou recebe um resumo, sua atuação termina no acesso, no enquadramento visual e nos sinais previstos neste README.

## Princípios

- **Projeto é processo criativo.** Pode estar em desenvolvimento ou concluído.
- **Aplicação é ferramenta de trabalho.** Pode exibir sinais úteis vindos de sua própria integração.
- **Concluído não significa aplicação.** A promoção de projeto para aplicação é uma decisão de cadastro.
- **Pouca informação por vez.** O painel mostra orientação e sinais, não painéis internos completos.
- **A origem continua sendo a fonte de verdade.** O Terrário consome resumos normalizados.
- **Falhas de integração não bloqueiam a home.** Cada módulo possui um estado vazio ou desconectado explícito.

## Organização da interface

### Trabalho e tempo

`Trabalhando agora` e o Pomodoro ficam lado a lado no topo da área principal.

- o botão de play exibido no hover de uma muda define o projeto em foco;
- o projeto selecionado sai temporariamente do grid e ocupa `Trabalhando agora`;
- sem seleção, a área mostra `Nenhum projeto em foco`;
- o Pomodoro funciona com ciclos de 15, 25 ou 50 minutos;
- com um projeto em foco, o tempo decorrido é acumulado nesse projeto;
- sem projeto em foco, o Pomodoro continua funcionando, mas o tempo não é atribuído;
- encerrar ou trocar o foco durante uma sessão ativa exige confirmação.

O tempo é contado enquanto a página permanece aberta. O total acumulado é salvo localmente no navegador.

### Mudas e aplicações

Projetos e aplicações usam a mesma representação circular e ocupam o mesmo grid.

- projetos em desenvolvimento usam uma borda em gráfico de rosca, proporcional às tarefas;
- projetos concluídos continuam no grupo de projetos e aparecem depois dos que estão em desenvolvimento;
- um projeto concluído pode ser promovido a aplicação por edição;
- aplicações podem exibir sinais breves enviados por suas integrações;
- um registro pode aparecer no painel e no menu ou somente no menu lateral.

Não existe bandeja de projetos. `Painel + menu` e `Somente menu` cobrem os dois modos de exibição.

A borda de um projeto em desenvolvimento representa quatro grupos de tarefas:

- `done`: concluídas, em verde;
- `doing`: em andamento, em azul;
- `todo`: a fazer, em laranja;
- `none`: sem status, em cinza.

Os segmentos são proporcionais às contagens recebidas. Uma tarefa sem prazo ainda participa da borda; prazo e status são informações independentes.

### Coluna de apoio

A coluna direita reúne:

- **Taxímetro de IA:** consumo e tarefas recentes do serviço local;
- **Radar de hoje:** entregáveis com prazo para hoje e amanhã vindos do Notion;
- **Quadro de avisos:** um espaço único para Caixa de entrada e Rotinas.

Caixa de entrada e Rotinas continuam em estados vazios explícitos até receberem integrações próprias.

### Bloquinho de notas

Cada projeto ou aplicação possui um campo de texto simples para consulta rápida.

- abre pelo botão de notas exibido no hover;
- aparece em uma gaveta lateral retrátil;
- fecha pelo `×`, pela tecla `Esc` ou pelo mesmo botão de notas;
- salva automaticamente no navegador;
- não possui formatação.

### Menu lateral e cadastro

O menu lateral reúne todos os registros, inclusive os marcados como `Somente menu`, e separa:

- **Projetos:** em desenvolvimento primeiro, concluídos depois;
- **Aplicações:** ferramentas prontas incorporadas à rotina;
- **Ferramentas:** atalhos para Pomodoro, Taxímetro, Caixa de entrada, Rotinas e Radar.

O cadastro e a edição usam o mesmo formulário. Os campos são:

- nome;
- URL principal;
- PNG opcional;
- tipo: projeto ou aplicação;
- fase do projeto: em desenvolvimento ou concluído;
- exibição: painel e menu ou somente menu;
- link opcional do Notion.

Tipo, fase e exibição são independentes. Ter uma aplicação publicada não obriga um registro a ser classificado como aplicação.

### Modelo de registro

Cada registro usa os seguintes campos:

- `id`: identificador estável;
- `name`: nome exibido;
- `url`: destino principal;
- `notionUrl`: referência opcional do Notion;
- `kind`: `project` ou `application`;
- `phase`: `development` ou `completed`;
- `location`: `panel` ou `menu`;
- `image`: PNG opcional;
- `tasks`: contagens normalizadas por status;
- `taskColors`: cores opcionais da borda;
- `signal`: aviso breve opcional;
- `integrationUrl`: endpoint opcional de resumo.

O cadastro local não cria automaticamente uma integração. Informar um link do Notion registra a referência, mas a leitura privada só passa a funcionar quando um endpoint protegido correspondente for configurado.

## Registros iniciais

- Novelinha;
- Voltinha;
- Banca;
- Leader Assessment;
- Iorguti;
- Trendices;
- Kollab.

Todos são registros editáveis.

## Integração com Notion

O navegador não recebe credenciais do Notion. Ele consulta o Cloudflare Worker `terrario-api`, que devolve apenas resumos normalizados.

Rotas usadas atualmente:

- `/projects/leader-assessment`;
- `/projects/iorguti`;
- `/projects/trendices`;
- `/projects/kollab`;
- `/radar`.

As informações são atualizadas:

- ao abrir a página;
- a cada cinco minutos;
- ao retornar para a aba;
- ao usar o botão `Atualizar dados`.

Tarefas sem prazo continuam válidas para a borda do projeto. Quando uma data for preenchida no Notion, o Worker também poderá incluí-la no Radar de hoje.

### Contrato de projeto

Um endpoint de projeto pode devolver:

```json
{
  "tasks": { "todo": 2, "doing": 1, "done": 4, "none": 0 },
  "taskColors": {
    "todo": "#f0a160",
    "doing": "#6fb7ee",
    "done": "#68c487",
    "none": "#9da6a1"
  },
  "signal": { "kind": "attention", "label": "Revisão disponível" }
}
```

`tasks`, `taskColors` e `signal` são opcionais. As contagens precisam ser números finitos e não negativos. O frontend preserva os dados anteriores quando uma atualização falha.

### Contrato do Radar

O Radar recebe duas listas:

```json
{
  "today": [{ "title": "Entregável", "project": "Projeto", "due": "2026-08-17" }],
  "tomorrow": []
}
```

O calendário de reuniões ainda não está conectado. A linha permanece explícita como aguardando integração, sem dados fictícios.

## Taxímetro de IA

O widget tenta consultar `/api/widget` nas portas locais `3001` e `3000`. Ele mostra a fonte principal, percentual de uso e até três tarefas recentes. Se o serviço estiver desligado, assume um estado desconectado e oferece o link para abri-lo.

## Dados locais

Nesta fase, ficam no `localStorage` do navegador:

- projetos cadastrados e alterações nos registros iniciais;
- PNGs enviados pelo formulário;
- bloquinhos de notas;
- projeto em foco;
- tempo acumulado por projeto.

Esses dados ainda não sincronizam entre computadores ou navegadores. A futura sincronização poderá usar Cloudflare D1 para registros e textos e R2 para arquivos, sem expor credenciais no frontend.

Limpar os dados do site no navegador pode remover cadastros, imagens, notas e tempos acumulados. Até existir sincronização, não tratar o armazenamento local como backup definitivo.

## Acessibilidade e responsividade

- controles possuem nomes acessíveis e foco visível;
- menu, modal e bloquinho podem ser fechados com `Esc`;
- ações de hover permanecem visíveis em dispositivos sem hover;
- o painel prioriza laptops e se reorganiza em uma coluna nas telas menores;
- animações são reduzidas quando o sistema solicita menos movimento.

## Arquitetura

O Terrário continua como aplicação estática compatível com GitHub Pages.

- `index.html` — estrutura do painel, menu, gaveta de notas e formulário;
- `garden.css` — layout, estados visuais e responsividade;
- `garden.js` — cadastro, persistência local, foco, Pomodoro e integrações;
- `novela.html` — aplicação Novelinha preservada como superfície independente;
- `tests/terrario.test.mjs` — verificações estruturais da página estática.

Não existem segredos do Notion no repositório. Credenciais e consultas privadas permanecem no Cloudflare Worker.

## Validação e publicação

Antes de publicar uma alteração:

```bash
node --check garden.js
node --test tests/terrario.test.mjs
```

O teste confirma a composição principal, a existência dos elementos usados pelo JavaScript, as rotas das integrações e as chaves de persistência. A publicação continua sendo feita pelo GitHub Pages a partir do repositório canônico; mudanças devem ser revisadas em uma branch antes de chegar à página principal.

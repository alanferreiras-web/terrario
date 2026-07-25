# Terrário

Organizador leve para projetos criativos em desenvolvimento. Cada projeto é uma **muda**; o Terrário centraliza o acesso e o acompanhamento sem transformar tudo em um dashboard pesado.

**Página:** https://alanferreiras-web.github.io/terrario/

## Mudas atuais

- **Novela Vertical** — plano audiovisual de 24 semanas, com checklists, guias, fechamentos quinzenais e progresso salvo no navegador.
- **Voltinha** — aplicação independente incorporada por `iframe` a partir de https://alanferreiras-web.github.io/voltinha/.
- **Banca** — aplicação complexa acessada por link externo em nova aba: https://alanferreiras-web.github.io/bancafeiras/.

## Arquitetura atual

O Terrário é uma aplicação estática concentrada em `index.html` (HTML, CSS e JavaScript puro), publicada pelo GitHub Pages.

A barra lateral alterna as mudas pela função `showProject()`:

- Novela Vertical permanece no próprio documento;
- Voltinha é carregado sob demanda no `#voltinhaFrame`;
- a classe `body.voltinha-mode` oculta o conteúdo da Novela Vertical e mantém o cabeçalho e o menu do Terrário disponíveis.

O código e o estado interno do Voltinha pertencem ao projeto externo e **não devem ser alterados por este repositório**. Novas mudas podem ser incorporadas quando tiverem uma URL compatível com `iframe` ou abertas externamente quando precisarem preservar uma aplicação complexa em sua própria aba.

## Estado

**v1.5**

- página inicial neutra apenas com o título Terrário;
- menu lateral como ponto exclusivo de escolha das mudas;
- menu lateral com múltiplas mudas;
- alternância entre Novela Vertical e Voltinha;
- Voltinha incorporado sem modificar seu código;
- Banca aberta externamente em nova aba;
- progresso da Novela Vertical preservado em `localStorage`.

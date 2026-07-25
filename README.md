# Terrário

Organizador leve para projetos criativos em desenvolvimento. Cada projeto é uma **muda**; o Terrário centraliza o acesso e o acompanhamento sem transformar tudo em um dashboard pesado.

**Página:** https://alanferreiras-web.github.io/terrario/

## Mudas atuais

- **Novela Vertical** — plano audiovisual de 24 semanas, com checklists, guias, fechamentos quinzenais e progresso salvo no navegador.
- **Voltinha** — aplicação independente incorporada por `iframe` a partir de https://alanferreiras-web.github.io/voltinha/.

## Arquitetura atual

O Terrário é uma aplicação estática concentrada em `index.html` (HTML, CSS e JavaScript puro), publicada pelo GitHub Pages.

A barra lateral alterna as mudas pela função `showProject()`:

- Novela Vertical permanece no próprio documento;
- Voltinha é carregado sob demanda no `#voltinhaFrame`;
- a classe `body.voltinha-mode` oculta o conteúdo da Novela Vertical e mantém o cabeçalho e o menu do Terrário disponíveis.

O código e o estado interno do Voltinha pertencem ao projeto externo e **não devem ser alterados por este repositório**. Novas mudas podem seguir o mesmo padrão de incorporação quando já possuírem uma URL pública compatível com `iframe`.

## Estado

**v1.3**

- menu lateral com múltiplas mudas;
- alternância entre Novela Vertical e Voltinha;
- Voltinha incorporado sem modificar seu código;
- progresso da Novela Vertical preservado em `localStorage`.

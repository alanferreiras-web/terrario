import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function source(name) {
  return readFile(new URL(name, root), 'utf8');
}

test('a página contém a composição aprovada', async () => {
  const html = await source('index.html');
  for (const content of [
    'Trabalhando agora',
    'Tempo de trabalho',
    'Mudas e aplicações',
    'Taxímetro de IA',
    'Radar de hoje',
    'Quadro de avisos',
    'Bloquinho de notas'
  ]) assert.match(html, new RegExp(content, 'i'));

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'não deve haver IDs duplicados');
});

test('todas as referências de elementos do JavaScript existem no HTML', async () => {
  const [html, javascript] = await Promise.all([source('index.html'), source('garden.js')]);
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  const referenced = [...javascript.matchAll(/getElementById\('([^']+)'\)/g)].map((match) => match[1]);
  const missing = [...new Set(referenced)].filter((id) => !ids.has(id));
  assert.deepEqual(missing, []);
});

test('mantém integrações e estado local necessários', async () => {
  const javascript = await source('garden.js');
  for (const route of [
    '/projects/leader-assessment',
    '/projects/iorguti',
    '/projects/trendices',
    '/projects/kollab',
    '/radar'
  ]) assert.match(javascript, new RegExp(route.replaceAll('/', '\\/')));

  for (const key of [
    'terrario-active-project',
    'terrario-time-totals',
    'terrario-prototype-notes'
  ]) assert.match(javascript, new RegExp(key));

  assert.match(javascript, /searchParams\.set\('fresh', '1'\)/);
  assert.match(javascript, /5 \* 60 \* 1000/);
  assert.match(javascript, /visibilitychange/);
});

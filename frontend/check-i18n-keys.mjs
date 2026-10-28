// Reports locale keys no code uses. Replaces the vue-i18n ESLint rule, which can't see dynamic keys:
// t(`views.demoForm.fields.${name}`) counts as using every key under views.demoForm.fields.
import fs from 'fs';
import path from 'path';
import process from 'process';

const localeDir = './src/locales';
const srcDir = './src';

// Calls to t, $t, i18n.t and i18n.global.t with any quote style, and keypath attributes
const CALL = /(?:\$t|\bt|\bi18n(?:\.global)?\.t)\(\s*(['"`])([^'"`]+?)\1/g;
const DYNAMIC = /(?:\$t|\bt|\bi18n(?:\.global)?\.t)\(\s*`([^`$]*)\$\{/g;
const KEYPATH = /\bkeypath="([^"]+)"/g;

function flatten(messages, prefix = '') {
  return Object.entries(messages).flatMap(([key, value]) =>
    typeof value === 'object' ? flatten(value, `${prefix}${key}.`) : [`${prefix}${key}`]
  );
}

const sources = fs
  .readdirSync(srcDir, { recursive: true })
  .filter((f) => /\.(ts|vue)$/.test(f))
  .map((f) => fs.readFileSync(path.join(srcDir, f), 'utf8'))
  .join('\n');

const used = new Set([...sources.matchAll(CALL)].map((m) => m[2]));
for (const m of sources.matchAll(KEYPATH)) used.add(m[1]);
const prefixes = new Set([...sources.matchAll(DYNAMIC)].map((m) => m[1]));

const problems = [];
for (const file of fs.readdirSync(localeDir).filter((f) => f.endsWith('.json'))) {
  const keys = flatten(JSON.parse(fs.readFileSync(path.join(localeDir, file), 'utf8')));

  for (const key of keys) {
    if (!used.has(key) && ![...prefixes].some((p) => key.startsWith(p))) problems.push(`${file}: unused key '${key}'`);
  }
  for (const prefix of prefixes) {
    if (!keys.some((key) => key.startsWith(prefix))) problems.push(`${file}: no keys under dynamic prefix '${prefix}'`);
  }
}

if (problems.length) {
  console.error(problems.join('\n')); // eslint-disable-line no-console
  process.exit(1);
}

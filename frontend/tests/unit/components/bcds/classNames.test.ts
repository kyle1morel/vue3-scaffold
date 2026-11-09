import { readdirSync, readFileSync } from 'node:fs';

// Mocks

// Fixtures

const BCDS_DIR = 'src/components/bcds';
const MAIN_CSS = 'src/assets/main.css';

const componentStyles = readdirSync(BCDS_DIR)
  .filter((file) => file.endsWith('.vue'))
  .flatMap((file) =>
    [...readFileSync(`${BCDS_DIR}/${file}`, 'utf8').matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => ({
      file,
      css: m[1]!
    }))
  );

const styles = [...componentStyles.map(({ css }) => css), readFileSync(MAIN_CSS, 'utf8')];

// Selectors only: comments, at-rule preludes and declaration bodies are dropped first
const classNames = [
  ...new Set(
    styles.flatMap((css) =>
      [
        ...css
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/@[^{;]+/g, '')
          .replace(/\{[^{}]*\}/g, '{}')
          .matchAll(/\.([a-zA-Z_][\w-]*)/g)
      ].map((m) => m[1]!)
    )
  )
].sort();

// Mount

// Tests

describe('bcds styles', () => {
  it('sit in the components layer, under Tailwind utilities, so a caller class can restyle a component', () => {
    // Comments may come before the layer
    expect(componentStyles.filter(({ css }) => !/^\s*(\/\*[\s\S]*?\*\/\s*)*@layer components \{/.test(css))).toEqual(
      []
    );
  });

  it('use class names that are all prefixed, so a caller class or scoped style can never match one', () => {
    expect(classNames.length).toBeGreaterThan(0);
    expect(classNames.filter((name) => !/^(bcds|app)-/.test(name))).toEqual([]);
  });
});

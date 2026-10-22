import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import jsdoc from 'eslint-plugin-jsdoc';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['coverage/**', 'dist/**', 'vitest.config.ts', 'node_modules/**', 'src/db/generated/**']
  },
  {
    files: ['**/*.{js,ts}'],
    extends: [
      // Extensions are order dependent - always apply Prettier last
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      jsdoc.configs['flat/recommended-typescript'],
      eslintPluginPrettierRecommended,
      eslintConfigPrettier // Drops conflicting rules
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    // Doc blocks use TSDoc notation; the jsdoc plugin's defaults expect JSDoc.
    settings: {
      jsdoc: { tagNamePreference: { template: 'typeParam' } }
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'error',
      'eol-last': ['error', 'always'],
      'jsdoc/require-jsdoc': 'off', // TODO: Turn this back on later
      'jsdoc/check-param-names': ['warn', { checkDestructured: false }],
      'jsdoc/no-types': 'error',
      'jsdoc/require-param': ['warn', { checkDestructured: false }],
      'jsdoc/require-throws-type': 'off', // TSDoc writes `@throws {@link Error}`, not a JSDoc type
      'linebreak-style': ['error', 'unix'],
      'max-len': ['warn', { code: 120, comments: 120, ignoreUrls: true }],
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always']
    }
  },
  // Entity repositories must go through inherited query/mutation methods,
  // never touch `this.model` directly — that's only for readable.ts/writable.ts
  // to implement the base methods themselves.
  {
    files: ['src/repositories/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          // eslint-disable-next-line quotes
          selector: `MemberExpression[object.type='ThisExpression'][property.name='model']`,
          message:
            'Use inherited query methods (this.findMany, this.create, etc.) instead of this.model directly. ' +
            'Only readable.ts/writable.ts may access this.model.'
        }
      ]
    }
  },
  {
    files: ['src/repositories/readable.ts', 'src/repositories/writable.ts'],
    rules: {
      'no-restricted-syntax': 'off'
    }
  }
]);

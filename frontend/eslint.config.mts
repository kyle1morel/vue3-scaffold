import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import jsdoc from 'eslint-plugin-jsdoc';
import vitest from '@vitest/eslint-plugin';

export default defineConfig([
  {
    ignores: ['coverage', 'dist', 'node_modules', '*.config.js']
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.browser
    }
  },
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{ts,mts,vue}'],
    extends: [jsdoc.configs['flat/recommended-typescript']],
    // Doc blocks use TSDoc notation; the jsdoc plugin's defaults expect JSDoc.
    settings: {
      jsdoc: { tagNamePreference: { template: 'typeParam' } }
    },
    rules: {
      'jsdoc/check-param-names': ['warn', { checkDestructured: false }],
      // The fixer inserts empty stubs, which the pre-commit `eslint --fix` would commit
      'jsdoc/require-jsdoc': [
        'error',
        {
          enableFixer: false,
          publicOnly: true,
          require: { ArrowFunctionExpression: true, FunctionDeclaration: true, FunctionExpression: true }
        }
      ],
      'jsdoc/no-blank-blocks': 'warn',
      'jsdoc/no-types': 'error',
      'jsdoc/require-param': ['warn', { checkDestructured: false }],
      'jsdoc/require-throws-type': 'off' // TSDoc writes `@throws {@link Error}`, not a JSDoc type
    }
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param': 'off'
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    },
    rules: {
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style']
        }
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'any'
          }
        }
      ],
      'vue/html-indent': 'off',
      'vue/multi-word-component-names': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'vue/singleline-html-element-content-newline': 'off'
    }
  },
  {
    files: ['**/*.{test,spec}.{js,ts,vue}'],
    plugins: {
      vitest
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/expect-expect': ['error', { assertFunctionNames: ['expect', 'assert', 'expectTypeOf'] }],
      'vitest/no-focused-tests': ['warn']
    }
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    rules: {
      'eol-last': ['error', 'always'],
      'linebreak-style': ['error', 'unix'],
      'max-len': ['warn', { code: 120, comments: 120, ignorePattern: '^(import\\s.+|\\} from)', ignoreUrls: true }],
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      quotes: ['error', 'single'],
      semi: ['error', 'always']
    }
  }
]);

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import jsdoc from 'eslint-plugin-jsdoc';
import vueI18n from '@intlify/eslint-plugin-vue-i18n';
import vitest from '@vitest/eslint-plugin';

export default defineConfig([
  {
    // Locale files are the only JSON the vue-i18n rules need to lint
    ignores: [
      'coverage',
      'dist',
      'node_modules',
      '*.config.js',
      '**/*.json',
      '!src/locales/*.json',
      'src/types/api/generated.ts'
    ]
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
      'vitest/expect-expect': [
        'error',
        { assertFunctionNames: ['expect', 'assert', 'expectTypeOf', 'expectNoAxeViolations'] }
      ],
      'vitest/no-focused-tests': ['warn']
    }
  },
  // Enforces src/locales/I18N-STANDARDS.md; check-i18n-keys.mjs covers unused keys, including dynamic ones
  vueI18n.configs.recommended,
  {
    // The plugin's config sets ecmaVersion 2018, which hides newer globals like globalThis
    languageOptions: { ecmaVersion: 'latest' },
    settings: {
      'vue-i18n': { localeDir: './src/locales/*.json', messageSyntaxVersion: '^11.0.0' }
    },
    rules: {
      '@intlify/vue-i18n/key-format-style': ['error', 'camelCase', { splitByDots: true }],
      '@intlify/vue-i18n/no-duplicate-keys-in-locale': 'error',
      '@intlify/vue-i18n/no-html-messages': 'error',
      '@intlify/vue-i18n/no-missing-keys': 'error',
      '@intlify/vue-i18n/no-raw-text': [
        'error',
        {
          attributes: {
            '/.+/': [
              'alt',
              'aria-label',
              'header',
              'help-text',
              'label',
              'message',
              'placeholder',
              'status',
              'title',
              'tooltip'
            ]
          },
          // Punctuation-only or empty text, such as separators, the copyright sign and a decorative alt=""
          ignorePattern: '^[\\s#:()&©*/|.,-]*$'
        }
      ],
      '@intlify/vue-i18n/no-v-html': 'error',
      '@intlify/vue-i18n/valid-message-syntax': 'error'
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
  },
  // Translations are full sentences; wrapping them would change the text
  {
    files: ['src/locales/*.json'],
    rules: { 'max-len': 'off' }
  }
]);

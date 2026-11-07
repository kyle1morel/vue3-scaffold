# Vue 3 Scaffold Frontend

The Vue 3 single-page app: PrimeVue styled to the [BC Design System](https://www2.gov.bc.ca/gov/content/digital/design-system),
Tailwind, Pinia, vue-i18n, and vee-validate with zod for forms.

## Getting Started

Use the Node version in the root [.nvmrc](../.nvmrc), then:

```sh
npm ci
npm run dev
```

The Vite dev server proxies `/api` and `/config` to the backend on `http://localhost:8080`, so start the backend first
(see the root [README](../README.md)). Run the two in separate terminals.

## Scripts

| Script                 | Does                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `npm run dev`          | Starts the Vite dev server with hot reload                                         |
| `npm run build`        | Lints, then builds for production into `dist/`                                     |
| `npm run test`         | Type checks and lints, then runs the Vitest suite with coverage                    |
| `npm run lint`         | Type checks, then runs ESLint, `prettier --check` and the unused locale key check  |
| `npm run lint:fix`     | Type checks, then fixes what ESLint can and formats with Prettier                  |
| `npm run typecheck`    | Type checks with `vue-tsc`                                                         |
| `npm run format:tests` | Applies the blank line rules in [TESTING-STANDARDS.md](tests/TESTING-STANDARDS.md) |

ESLint and Prettier cache their results in `node_modules/.cache`, so repeat runs only check changed files. The
pre-commit hook formats and lints staged files on its own.

## Editor

Install the extensions recommended in [.vscode/extensions.json](../.vscode/extensions.json). **Vue - Official**
(`vue.volar`) gives the editor type information for `.vue` files; on the command line, `vue-tsc` does the same.

## Components

| Folder                  | Holds                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `src/components/bcds`   | Components named and shaped after the BC Design System, such as `Button`, `TextField` and `Tag`, most backed by PrimeVue |
| `src/components/form`   | vee-validate fields: each binds one `bcds` component to a form field with `useField(name)`                               |
| `src/components/common` | Shared app components, such as `CopyToClipboard`                                                                         |
| `src/components/layout` | The page shell: header and its menu, breadcrumb, footer, drawer and loading indicators                                   |

PrimeVue stays behind `components/bcds`, so it can be replaced later without touching the rest of the app. ESLint fails
any other file that imports `primevue`, except `main.ts` and `src/lib/primevue`, which also holds the theme preset. Its
barrel lists the PrimeVue components used directly on purpose, such as `DataTable` and `Toast`, and the ones still
waiting for a `bcds` component.

`bcds/FieldWrapper.vue` renders the label, description and error message every field shares, and links them to the
control with `aria-describedby`, `aria-required` and `for`. New `bcds` fields should build on it.

## API Types

Request and response types come from the backend's OpenAPI document. After changing a backend route or schema, run
`npm run docs:types` in `app/` to regenerate `src/types/api/generated.ts`. Type payloads with the helpers in
`src/types/api/openapi.ts`, such as `RequestBody<'createSubmission'>` and `QueryParams<'listSubmissions'>`, instead of
writing request types by hand.

## Error Handling

`main.ts` sends every error nothing else handled to `showError`, which logs it and shows a toast: Vue's
`app.config.errorHandler` covers component code, and an `unhandledrejection` listener covers promises Vue never sees.

- To give the user a specific message, rethrow the failure as a `UserError`:
  `await deleteSubmission(id).catch(rethrowAs(t('views.submissions.errors.delete')))`.
- Anything else shows a generic "Something went wrong" message.
- `await` or `return` promises from hooks and handlers, so Vue sees their failures.
- Only catch an error to recover from it, such as showing a message on the page instead of a toast.

## Standards

- [Localization](src/locales/I18N-STANDARDS.md): how user-facing text is organized in `en-CA.json`
- [Testing](tests/TESTING-STANDARDS.md): how specs are structured and which test utilities to use

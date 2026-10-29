# Vue 3 Scaffold

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Lifecycle:Experimental](https://img.shields.io/badge/Lifecycle-Experimental-339999)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md)

[![Tests](https://github.com/kyle1morel/vue3-scaffold/actions/workflows/unit-tests.yaml/badge.svg)](https://github.com/kyle1morel/vue3-scaffold/actions/workflows/unit-tests.yaml)

A Vue 3 and Express application scaffold with OIDC authentication, a Prisma/Kysely backed `user` and `identity_provider` model, audit logging, and generated OpenAPI types.

## Directory Structure

```txt
.github/                   - PR, Issue templates and workflows
.vscode/                   - VSCode environment configurations
app/                       - Application Root
├── config/                - Identity provider list and feature flag JSON files
├── src/                   - Node.js web application
│   ├── controllers/       - Controller Layer
│   ├── db/                - Database Layer (migrations, Prisma schema, unit of work)
│   ├── docs/              - OpenAPI documentation
│   ├── domains/           - Domain Layer
│   ├── middleware/        - Middleware Layer
│   ├── repositories/      - Repository Layer
│   ├── routes/            - Routes Layer
│   ├── schemas/           - Zod request/response schemas
│   ├── services/          - Services Layer
│   ├── types/             - Typescript type definitions
│   └── utils/             - Utility functions
└── tests/                 - Node.js web application tests
charts/                    - Helm chart
frontend/                  - Frontend Root
├── src/                   - Vue web application
│   ├── assets/            - Static File Assets
│   ├── components/        - Components Layer
│   ├── composables/       - Common composition elements
│   ├── lib/               - Repackaged external libraries
│   ├── locales/           - i18n messages
│   ├── router/            - Router Layer
│   ├── services/          - Services Layer
│   ├── store/             - Store Layer
│   ├── types/             - Typescript type definitions
│   ├── utils/             - Utility components
│   └── views/             - View Layer
└── tests/                 - Vitest web application tests
infra/                     - CrunchyDB Helm chart
CODE-OF-CONDUCT.md         - Code of Conduct
COMPLIANCE.yaml            - BCGov PIA/STRA compliance status
CONTRIBUTING.md            - Contributing Guidelines
Dockerfile                 - Dockerfile Image definition
LICENSE                    - License
SECURITY.md                - Security Policy and Reporting
```

## Documentation

- [Database Readme](app/src/db/README.md)
- [Frontend Readme](frontend/README.md)
- [Security Reporting](SECURITY.md)

## Quick Start Dev Guide

You can quickly run this application in development mode after cloning by opening two terminal windows and running the following commands (assuming you have already set up local configuration as well). Refer to the [Database Readme](app/src/db/README.md) and [Frontend Readme](frontend/README.md) for more details.

- Use Node 26, as pinned in [.nvmrc](.nvmrc) (`nvm use` on macOS/Linux; nvm-windows needs `nvm use 26`). `npm ci` refuses older versions.
- Create `app/.env` (git-ignored) to override the defaults in [app/.env.default](app/.env.default). It is loaded with [dotenv](https://github.com/motdotla/dotenv); real environment variables always take precedence. At minimum set:
  - `SERVER_DB_USERNAME`, `SERVER_DB_PASSWORD`, `SERVER_DB_DATABASE` (used by the app, migrations and the Prisma CLI)
  - `FRONTEND_OIDC_AUTHORITY`, `FRONTEND_OIDC_CLIENTID`, `SERVER_OIDC_AUTHORITY`, `SERVER_OIDC_AUDIENCE`

```sh
cd app
npm i
npm run migrate:latest
npm run dev
```

```sh
cd frontend
npm i
npm run dev
```

## Releasing

Requires [helm-docs](https://github.com/norwoodj/helm-docs#installation). From the repository root:

1. Run `npm run release -- <major.minor.patch>`. It creates a `chore/release-<version>` branch and bumps the app and frontend versions (and lockfiles), the chart `appVersion` and patch `version`, the chart README, and the supported version in [SECURITY.md](SECURITY.md).
2. Commit with `git commit -am "chore(release): v<version>"` and open a pull request to `main`.
3. After it merges, run the **Draft Release** workflow. It drafts a `v<version>` GitHub release with notes generated from the commits since the last release, prefixed by the `## v<version>` section of the wiki's `Product-Roadmap` page when there is one.
4. Review and publish the draft release, which creates the `v<version>` tag.

## Getting Help or Reporting an Issue

To report bugs/issues/features requests, please file an [issue](https://github.com/kyle1morel/vue3-scaffold/issues).

## How to Contribute

If you would like to contribute, please see our [contributing](CONTRIBUTING.md) guidelines.

Please note that this project is released with a [Contributor Code of Conduct](CODE-OF-CONDUCT.md). By participating in this project you agree to abide by its terms.

## License

```txt
Copyright 2023 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

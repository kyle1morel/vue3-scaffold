# Vue3 Scaffold Database

## Directory Structure

```txt
db/                       - Database Root
├── extensions/           - Defines Prisma extensions
├── generators/           - Prisma generators (relations map used by extensions)
├── migrations/           - Kysely database migration files, run by ../../migrate.ts
├── prisma/               - Location of the Prisma schema
└── utils/                - Utility functions
    └── migrations/       - Helper functions for migrations
database.ts               - Defines the Prisma database and database health checks
errors.ts                 - Prisma error helpers
unitOfWork.ts             - Transaction scoped repository provider
```

## Schemas

Nothing lives in the `public` schema.

- `app` - application tables, their functions, and the `kysely_migration` tables. The migrator creates it before running
  the first migration, so `migrate` works against an empty database.
- `audit` - `logged_actions` and the trigger function that records updates/deletes to audited tables.

New tables go in `app`: use `db.schema.withSchema('app')` in migrations and `@@schema("app")` in Prisma models.

## Workflow

1. Create a migration with `npm run migrate:make -- <name>`
2. Apply it with `npm run migrate:latest`

`migrate:latest`, `migrate:up` and `migrate:down` then sync Prisma: `prisma db pull`, `prisma-case-format` and
`prisma generate`. `migrate:up` / `migrate:down` step one migration, `migrate:rollback` reverts all of them (without a
sync, as there is nothing left to pull), and `migrate:list` shows what has run. Each run executes in a single transaction, so a failing migration leaves the database
unchanged.

import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Kysely, PostgresDialect } from 'kysely';
import { FileMigrationProvider, Migrator, NO_MIGRATIONS } from 'kysely/migration';
import pg from 'pg';

import '#src/env';
import { getLogger } from '#src/utils/log';

import type { MigrationResultSet } from 'kysely/migration';

/**
 * Database migration CLI, built on the Kysely Migrator.
 * Usage: `node migrate.ts <latest | up | down | rollback | list | make <name>>`.
 */

const log = getLogger(import.meta.filename);

const MIGRATION_FOLDER = join(import.meta.dirname, 'src/db/migrations');

const MIGRATION_TEMPLATE = `import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {}

export async function down(db: Kysely<unknown>): Promise<void> {}
`;

const db = new Kysely<unknown>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      host: process.env.SERVER_DB_HOST,
      user: process.env.SERVER_DB_USERNAME,
      password: process.env.SERVER_DB_PASSWORD,
      database: process.env.SERVER_DB_DATABASE,
      port: Number(process.env.SERVER_DB_PORT),
      max: 1
    })
  })
});

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path: { join },
    migrationFolder: MIGRATION_FOLDER,
    // Absolute paths must be file URLs to be importable on Windows.
    import: (path: string) => import(pathToFileURL(path).href)
  }),
  // The migrator creates this schema if missing, keeping its tables out of public.
  migrationTableSchema: 'app'
});

/**
 * Logs each migration result, then throws the migration error, if any.
 * @param resultSet - The result of a Migrator run.
 */
function report({ error, results }: MigrationResultSet): void {
  if (results?.length === 0) log.info('No migrations to run');
  results?.forEach(({ direction, migrationName, status }) => {
    log[status === 'Error' ? 'error' : 'info'](`${direction} ${migrationName}: ${status}`);
  });
  if (error) throw error;
}

const [command, name] = process.argv.slice(2);

try {
  switch (command) {
    case 'latest':
      report(await migrator.migrateToLatest());
      break;
    case 'up':
      report(await migrator.migrateUp());
      break;
    case 'down':
      report(await migrator.migrateDown());
      break;
    case 'rollback':
      report(await migrator.migrateTo(NO_MIGRATIONS));
      break;
    case 'list':
      for (const { executedAt, name } of await migrator.getMigrations()) {
        log.info(`${executedAt?.toISOString() ?? 'pending'.padEnd(24)} ${name}`);
      }
      break;
    case 'make': {
      if (!name) throw new Error('Usage: make <name>');
      const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
      const file = join(MIGRATION_FOLDER, `${timestamp}_${name}.ts`);
      await fs.writeFile(file, MIGRATION_TEMPLATE, { flag: 'wx' });
      log.info(`Created ${file}`);
      break;
    }
    default:
      throw new Error(`Unknown command '${command}'. Use latest, up, down, rollback, list or make <name>`);
  }
} catch (error) {
  log.error(error);
  process.exitCode = 1;
} finally {
  await db.destroy();
}

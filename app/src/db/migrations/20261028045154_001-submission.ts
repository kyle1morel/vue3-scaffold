import { sql } from 'kysely';

import {
  createAuditLogTrigger,
  createIndex,
  createUpdatedAtTrigger,
  dropAuditLogTrigger,
  dropUpdatedAtTrigger,
  withTimestamps
} from '#src/db/utils/migrations/helpers';

import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema.withSchema('app').createType('contact_method').asEnum(['email', 'phone']).execute();
  await db.schema.withSchema('app').createType('province').asEnum(['AB', 'BC', 'SK']).execute();

  await db.schema
    .withSchema('app')
    .createTable('submission')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('first_name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull())
    .addColumn('phone', 'text')
    .addColumn('province', sql`app.province`, (col) => col.notNull())
    .addColumn('contact_method', sql`app.contact_method`, (col) => col.notNull())
    .addColumn('start_date', 'date')
    .addColumn('quantity', 'integer')
    .addColumn('city', 'text')
    .addColumn('category', 'text')
    .addColumn('comments', 'text')
    .addColumn('notes', 'text')
    .$call(withTimestamps)
    .execute();

  // The submissions list pages newest first
  await createIndex(db, 'app', 'submission', ['created_at']);

  await createUpdatedAtTrigger(db, 'app', 'submission');
  await createAuditLogTrigger(db, 'app', 'submission');
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await dropAuditLogTrigger(db, 'app', 'submission');
  await dropUpdatedAtTrigger(db, 'app', 'submission');

  await db.schema.withSchema('app').dropTable('submission').ifExists().execute();

  await db.schema.withSchema('app').dropType('province').ifExists().execute();
  await db.schema.withSchema('app').dropType('contact_method').ifExists().execute();
}

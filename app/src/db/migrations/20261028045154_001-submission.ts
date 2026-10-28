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
  await db.schema
    .withSchema('app')
    .createTable('submission')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('first_name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull())
    .addColumn('phone', 'text')
    .addColumn('province', 'text', (col) => col.notNull())
    .addColumn('contact_method', 'text', (col) => col.notNull())
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
}

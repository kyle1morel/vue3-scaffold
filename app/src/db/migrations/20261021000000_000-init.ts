/* eslint-disable max-len */
import { sql } from 'kysely';

import {
  createAuditLogTrigger,
  createIndex,
  createUpdatedAtTrigger,
  dropAuditLogTrigger,
  dropUpdatedAtTrigger,
  withTimestamps
} from '#src/db/utils/migrations/helpers';
import { SYSTEM_ID } from '#src/utils/constants/application';

import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  // Create app schema functions (the schema itself is created by the migrator, for its own tables).
  await sql`create or replace function app.set_updated_at()
    returns trigger
    language plpgsql
    as $$
    begin
      new."updated_at" = now();
      return new;
    end;
    $$`.execute(db);

  // Create app schema tables
  await db.schema
    .withSchema('app')
    .createTable('identity_provider')
    .addColumn('idp', 'text', (col) => col.primaryKey())
    .addColumn('active', 'boolean', (col) => col.notNull().defaultTo(true))
    .$call(withTimestamps)
    .execute();

  await db.schema
    .withSchema('app')
    .createTable('user')
    .addColumn('user_id', 'uuid', (col) => col.primaryKey())
    .addColumn('idp', 'text')
    .addColumn('sub', 'text', (col) => col.notNull())
    .addColumn('email', 'text')
    .addColumn('first_name', 'text')
    .addColumn('full_name', 'text')
    .addColumn('last_name', 'text')
    .addColumn('bceid_business_name', 'text')
    .addColumn('active', 'boolean', (col) => col.notNull().defaultTo(true))
    .addUniqueConstraint('user_sub_unique', ['sub'])
    .addForeignKeyConstraint('user_idp_foreign', ['idp'], 'app.identity_provider', ['idp'], (cb) =>
      cb.onUpdate('cascade').onDelete('restrict')
    )
    .$call(withTimestamps)
    .execute();

  await createIndex(db, 'app', 'user', ['email']);

  // Create app schema table triggers
  await createUpdatedAtTrigger(db, 'app', 'identity_provider');
  await createUpdatedAtTrigger(db, 'app', 'user');

  // Create audit schema and logged_actions table
  await db.schema.createSchema('audit').ifNotExists().execute();

  await db.schema
    .withSchema('audit')
    .createTable('logged_actions')
    .addColumn('id', 'integer', (col) => col.generatedByDefaultAsIdentity().primaryKey())
    .addColumn('schema_name', 'text', (col) => col.notNull())
    .addColumn('table_name', 'text', (col) => col.notNull())
    .addColumn('db_user', 'text', (col) => col.notNull())
    .addColumn('updated_by_username', 'text')
    .addColumn('action_timestamp', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('action', 'text', (col) => col.notNull())
    .addColumn('original_data', 'json')
    .addColumn('new_data', 'json')
    .execute();

  for (const column of ['schema_name', 'table_name', 'action_timestamp', 'action']) {
    await createIndex(db, 'audit', 'logged_actions', [column]);
  }

  await sql`CREATE OR REPLACE FUNCTION audit.if_modified_func() RETURNS trigger AS $body$
    DECLARE
        v_old_data json;
        v_new_data json;

    BEGIN
        if (TG_OP = 'UPDATE') then
            v_old_data := row_to_json(OLD);
            v_new_data := row_to_json(NEW);
            insert into audit.logged_actions ("schema_name", "table_name", "db_user", "updated_by_username", "action_timestamp", "action", "original_data", "new_data")
            values (TG_TABLE_SCHEMA::TEXT, TG_TABLE_NAME::TEXT, SESSION_USER::TEXT, NEW."updated_by", now(), TG_OP::TEXT, v_old_data, v_new_data);
            RETURN NEW;
        elsif (TG_OP = 'DELETE') then
            v_old_data := row_to_json(OLD);
            insert into audit.logged_actions ("schema_name", "table_name", "db_user", "action_timestamp", "action", "original_data")
            values (TG_TABLE_SCHEMA::TEXT, TG_TABLE_NAME::TEXT, SESSION_USER::TEXT, now(), TG_OP::TEXT, v_old_data);
            RETURN OLD;
        else
            RAISE WARNING '[AUDIT.IF_MODIFIED_FUNC] - Other action occurred: %, at %', TG_OP, now();
            RETURN NULL;
        end if;

    EXCEPTION
        WHEN data_exception THEN
            RAISE WARNING '[AUDIT.IF_MODIFIED_FUNC] - UDF ERROR [DATA EXCEPTION] - SQLSTATE: %, SQLERRM: %',SQLSTATE,SQLERRM;
            RETURN NULL;
        WHEN unique_violation THEN
            RAISE WARNING '[AUDIT.IF_MODIFIED_FUNC] - UDF ERROR [UNIQUE] - SQLSTATE: %, SQLERRM: %',SQLSTATE,SQLERRM;
            RETURN NULL;
        WHEN others THEN
            RAISE WARNING '[AUDIT.IF_MODIFIED_FUNC] - UDF ERROR [OTHER] - SQLSTATE: %, SQLERRM: %',SQLSTATE,SQLERRM;
            RETURN NULL;

    END;
    $body$
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = pg_catalog, audit;`.execute(db);

  // Create audit triggers
  await createAuditLogTrigger(db, 'app', 'identity_provider');
  await createAuditLogTrigger(db, 'app', 'user');

  // Populate Baseline Data
  await sql`insert into app.user (user_id, sub, active, created_by)
    values (${SYSTEM_ID}, 'system', true, ${SYSTEM_ID})`.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  // Drop audit triggers
  await dropAuditLogTrigger(db, 'app', 'user');
  await dropAuditLogTrigger(db, 'app', 'identity_provider');

  // Drop audit schema and logged_actions table
  await sql`DROP FUNCTION IF EXISTS audit.if_modified_func`.execute(db);
  await db.schema.withSchema('audit').dropTable('logged_actions').ifExists().execute();
  await db.schema.dropSchema('audit').ifExists().execute();

  // Drop app schema table triggers
  await dropUpdatedAtTrigger(db, 'app', 'user');
  await dropUpdatedAtTrigger(db, 'app', 'identity_provider');

  // Drop app schema tables (the schema itself stays, as it also holds the migration tables).
  await db.schema.withSchema('app').dropTable('user').ifExists().execute();
  await db.schema.withSchema('app').dropTable('identity_provider').ifExists().execute();

  // Drop app schema functions
  await sql`DROP FUNCTION IF EXISTS app.set_updated_at`.execute(db);
}

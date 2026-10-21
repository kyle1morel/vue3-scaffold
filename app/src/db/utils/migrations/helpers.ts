import { sql } from 'kysely';

import { SYSTEM_ID } from '#src/utils/constants/application';

import type { CreateTableBuilder, Kysely, QueryResult } from 'kysely';

/**
 * Create Audit Log Trigger for a given table.
 * @param qb - Query builder.
 * @param schema - Schema name.
 * @param table - Table name.
 * @returns The query result.
 */
export function createAuditLogTrigger(
  qb: Kysely<unknown>,
  schema: string,
  table: string
): Promise<QueryResult<unknown>> {
  return sql`CREATE TRIGGER audit_${sql.raw(table)}_trigger
    AFTER UPDATE OR DELETE ON ${sql.id(schema, table)}
    FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func();`.execute(qb);
}

/**
 * Create an index on a given table and columns.
 * @param qb - Query builder.
 * @param schema - Schema name.
 * @param table - Table name.
 * @param columns - Columns to index.
 * @returns A promise that resolves when the statement completes.
 */
export function createIndex(qb: Kysely<unknown>, schema: string, table: string, columns: string[]): Promise<void> {
  return qb.schema
    .withSchema(schema)
    .createIndex(`${table}_${columns.join('_')}_index`)
    .on(table)
    .columns(columns)
    .execute();
}

/**
 * Create an updated at trigger for a given table.
 * @param qb - Query builder.
 * @param schema - Schema name.
 * @param table - Table name.
 * @returns The query result.
 */
export function createUpdatedAtTrigger(
  qb: Kysely<unknown>,
  schema: string,
  table: string
): Promise<QueryResult<unknown>> {
  return sql`CREATE TRIGGER before_update_${sql.raw(table)}_trigger
    BEFORE UPDATE ON ${sql.id(schema, table)}
    FOR EACH ROW EXECUTE PROCEDURE app.set_updated_at();`.execute(qb);
}

/**
 * Drop Audit Log Trigger for a given table.
 * @param qb - Query builder.
 * @param schema - Schema name.
 * @param table - Table name.
 * @returns The query result.
 */
export function dropAuditLogTrigger(qb: Kysely<unknown>, schema: string, table: string): Promise<QueryResult<unknown>> {
  return sql`DROP TRIGGER IF EXISTS audit_${sql.raw(table)}_trigger ON ${sql.id(schema, table)}`.execute(qb);
}

/**
 * Drop an index on a given table and columns.
 * @param qb - Query builder.
 * @param schema - Schema name.
 * @param table - Table name.
 * @param columns - Columns to index.
 * @returns A promise that resolves when the statement completes.
 */
export function dropIndex(qb: Kysely<unknown>, schema: string, table: string, columns: string[]): Promise<void> {
  return qb.schema
    .withSchema(schema)
    .dropIndex(`${table}_${columns.join('_')}_index`)
    .ifExists()
    .execute();
}

/**
 * Drop an updated at trigger for a given table.
 * @param qb - Query builder.
 * @param schema - Schema name.
 * @param table - Table name.
 * @returns The query result.
 */
export function dropUpdatedAtTrigger(
  qb: Kysely<unknown>,
  schema: string,
  table: string
): Promise<QueryResult<unknown>> {
  return sql`DROP TRIGGER IF EXISTS before_update_${sql.raw(table)}_trigger ON ${sql.id(schema, table)}`.execute(qb);
}

/**
 * Adds audit timestamps, and the soft delete columns used by the filterDeleted extension, to a table builder.
 * @param qb - The table builder to add timestamps to.
 * @returns The table builder with timestamps added. Should be invoked within a $call.
 */
export function withTimestamps<TB extends string>(qb: CreateTableBuilder<TB>): CreateTableBuilder<TB> {
  return qb
    .addColumn('created_by', 'text', (col) => col.defaultTo(SYSTEM_ID))
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_by', 'text')
    .addColumn('updated_at', 'timestamptz')
    .addColumn('deleted_by', 'text')
    .addColumn('deleted_at', 'timestamptz');
}

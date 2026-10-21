import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '#prismaClient';
import filterDeletedTransform from './extensions/filterDeleted.ts';
import { getDatabaseUrl } from './url.ts';
import { getLogger } from '#src/utils/log';

const log = getLogger(import.meta.filename);

const adapter = new PrismaPg({ connectionString: getDatabaseUrl(), max: Number(process.env.SERVER_DB_POOL_MAX) });

// Note: These two types are a workaround for using Prisma's TransactionClient type while also extending the client.
// The interface is necessary for function args to not show an expanded type
// see - https://github.com/prisma/prisma/issues/20738
export type ExtendedClient = typeof prisma;
type _PrismaTransactionClient = Parameters<Parameters<ExtendedClient['$transaction']>[0]>[0];
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PrismaTransactionClient extends _PrismaTransactionClient {}

const prisma = new PrismaClient({
  // TODO: https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/logging#event-based-logging
  log: ['error', 'warn'],
  errorFormat: 'pretty',
  adapter
}).$extends(filterDeletedTransform);

export default prisma;
export type PrismaClientType = typeof prisma;

/**
 * Checks the health of the database by executing a simple query.
 * @returns A promise that resolves to `true` if the database is healthy, or
 * `false` if the health check fails.
 * Will log an error and return `false` if the database is not healthy.
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const result = await prisma.$queryRaw<{ result: number }[]>`SELECT 1 AS result`;
    log.debug('Database is healthy');
    return result[0]?.result === 1;
  } catch (error) {
    log.error(error, 'Database is unhealthy');
    return false;
  }
}

import { Prisma } from '#prismaClient';

import prisma from '#src/db/database';
import { IdentityProviderRepository, UserRepository } from '#src/repositories/index';
import { requestContext } from '#src/types/context';
import { SYSTEM_ID } from '#src/utils/constants/application';

import type { PrismaClientType, PrismaTransactionClient } from '#src/db/database';

/**
 * Collection of repositories available within a unit-of-work scope.
 *
 * All repositories share the same Prisma transaction client, ensuring
 * that database operations participate in the same transaction boundary.
 */
export interface Repositories {
  identityProvider: IdentityProviderRepository;
  user: UserRepository;
}

/**
 * Provides lazily instantiated repository instances for a transaction scope.
 *
 * Repository instances are created on first access and cached for the
 * lifetime of the provider. All repositories share the same transaction
 * client and principal context.
 */
class RepositoryProvider implements Repositories {
  private readonly tx: PrismaTransactionClient;
  private readonly principal: string;

  private readonly repositories = new Map<string, object>();

  constructor(tx: PrismaTransactionClient, principal: string) {
    this.tx = tx;
    this.principal = principal;
  }

  //--------------------------------------------------------------------------
  // Repositories
  //--------------------------------------------------------------------------

  get identityProvider(): IdentityProviderRepository {
    return this.getOrCreate('identityProvider', () => new IdentityProviderRepository(this.tx, this.principal));
  }

  get user(): UserRepository {
    return this.getOrCreate('user', () => new UserRepository(this.tx, this.principal));
  }

  //--------------------------------------------------------------------------
  // Internal Helpers
  //--------------------------------------------------------------------------

  /**
   * Returns a cached repository instance or creates one if it does not exist.
   * @param key - Unique repository cache key.
   * @param factory - Repository factory function.
   * @returns A repository object.
   */
  private getOrCreate<T extends object>(key: string, factory: () => T): T {
    let repo = this.repositories.get(key);

    if (!repo) {
      repo = factory();
      this.repositories.set(key, repo);
    }

    return repo as T;
  }
}

/**
 * Transaction execution options.
 */
interface TxOpts {
  isolationLevel?: Prisma.TransactionIsolationLevel;
  maxWait?: number;
  timeout?: number;
}

/**
 * Implements the Unit of Work pattern for transactional database operations.
 *
 * Creates a transaction boundary, instantiates repositories bound to that
 * transaction, and provides them to the supplied callback. Any repository
 * operations executed through the callback participate in the same atomic
 * transaction.
 */
class UnitOfWork {
  private readonly prisma: PrismaClientType;

  constructor(prisma: PrismaClientType) {
    this.prisma = prisma;
  }

  /**
   * Executes a function within a database transaction.
   *
   * A RepositoryProvider is created for the transaction and supplied to the
   * callback. All repositories resolved from the provider share the same
   * transaction context.
   * @typeParam T - Result type returned by the callback.
   * @param fn - Transactional work to execute.
   * @param opts - Transaction configuration options.
   * @param principal - Optional override of the principal of the unit of work.
   * @returns Result returned by the callback.
   */
  async execute<T>(
    fn: (repos: RepositoryProvider, tx: PrismaTransactionClient) => Promise<T>,
    opts: TxOpts = {},
    principal?: string
  ): Promise<T> {
    const { isolationLevel = Prisma.TransactionIsolationLevel.ReadCommitted, maxWait = 2000, timeout = 10000 } = opts;
    const txPrincipal = principal ?? requestContext.getStore()?.principal ?? SYSTEM_ID;

    return this.prisma.$transaction(
      async (tx) => {
        return fn(new RepositoryProvider(tx, txPrincipal), tx);
      },
      { isolationLevel, maxWait, timeout }
    );
  }

  /**
   * Executes a function within a Prisma transaction and exposes the raw transaction client.
   *
   * This is an escape hatch from the Unit of Work abstraction. Unlike `execute`,
   * this method does NOT provide repositories and instead exposes the underlying
   * Prisma transaction client directly.
   *
   * IMPORTANT:
   * This method should be avoided when possible.
   * Prefer `execute()` with RepositoryProvider to ensure:
   * - consistent data access patterns
   * - reduced coupling to Prisma
   * - better testability and maintainability
   *
   * Use this only when:
   * - repository abstractions are insufficient or overly restrictive
   * - performing bulk operations or raw queries (`$queryRaw`, `$executeRaw`)
   * - leveraging Prisma transaction capabilities not exposed via repositories
   * @typeParam T - Result type returned by the callback.
   * @param fn - Transactional work receiving the raw Prisma transaction client.
   * @param principal - Acting user or system identifier.
   * @param opts - Transaction configuration options.
   * @returns Result returned by the callback.
   */
  async executeRaw<T>(
    fn: (tx: PrismaTransactionClient, principal: string) => Promise<T>,
    principal: string = SYSTEM_ID,
    opts: TxOpts = {}
  ): Promise<T> {
    const { isolationLevel = Prisma.TransactionIsolationLevel.ReadCommitted, maxWait = 2000, timeout = 10000 } = opts;

    return this.prisma.$transaction(
      async (tx) => {
        return fn(tx, principal);
      },
      { isolationLevel, maxWait, timeout }
    );
  }
}

export const unitOfWork = new UnitOfWork(prisma);

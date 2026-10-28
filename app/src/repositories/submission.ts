import { WritableRepository } from './writable.ts';

import type { PrismaTransactionClient } from '#src/db/database';

export class SubmissionRepository extends WritableRepository<PrismaTransactionClient['submission']> {
  constructor(tx: PrismaTransactionClient, principal: string) {
    // Soft deleted, so a deleted submission stays in the table and in the audit history
    super(tx.submission, principal, true);
  }
}

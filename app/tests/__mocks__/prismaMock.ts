import { vi } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

import prisma from '#src/db/database';

import type { DeepMockProxy } from 'vitest-mock-extended';
import type { ExtendedClient, PrismaTransactionClient } from '#src/db/database';

vi.mock('#src/db/database', () => ({
  __esModule: true,
  default: mockDeep<ExtendedClient>(),
  checkDatabaseHealth: vi.fn()
}));

// Prisma here is the mocked default export installed above, it is exposed as the shared DeepMockProxy.
// Note: we intentionally do NOT mockReset this between tests, several existing tests rely on mock implementations
// (e.g. $transaction.mockImplementationOnce) persisting across tests within a file.
// Tests that need a clean prismaMock should clear/reset specific methods themselves.
const prismaMockInstance = prisma as unknown as DeepMockProxy<ExtendedClient>;
const prismaTxMockInstance: DeepMockProxy<PrismaTransactionClient> = mockDeep<PrismaTransactionClient>();

beforeEach(() => {
  mockReset(prismaTxMockInstance);
});

export const prismaMock = prismaMockInstance;
export const prismaTxMock = prismaTxMockInstance;

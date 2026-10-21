import { mockDeep } from 'vitest-mock-extended';

import type * as DatabaseModule from '#src/db/database';

vi.stubEnv('SERVER_DB_PASSWORD', 'p@ss:w/o?r#d%');

const prismaInternalMock = mockDeep<DatabaseModule.ExtendedClient>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(prismaInternalMock as any).$extends = vi.fn().mockReturnValue(prismaInternalMock);

vi.mock('#prismaClient', async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual = await vi.importActual<any>('#prismaClient');
  return {
    ...actual,
    // Must be a regular function (not an arrow) so `new PrismaClient(...)` works.
    PrismaClient: vi.fn(function () {
      return prismaInternalMock;
    })
  };
});

let checkDatabaseHealth: (typeof DatabaseModule)['checkDatabaseHealth'];

beforeEach(async () => {
  const actual = await vi.importActual<typeof DatabaseModule>('#src/db/database');
  checkDatabaseHealth = actual.checkDatabaseHealth;
});

describe('checkDatabaseHealth', () => {
  beforeEach(() => {
    prismaInternalMock.$queryRaw.mockReset();
  });

  it('returns true when the query resolves with { result: 1 }', async () => {
    prismaInternalMock.$queryRaw.mockResolvedValueOnce([{ result: 1 }]);

    const result = await checkDatabaseHealth();

    expect(prismaInternalMock.$queryRaw).toHaveBeenCalledTimes(1);
    expect(prismaInternalMock.$queryRaw).toHaveBeenCalledWith(expect.arrayContaining(['SELECT 1 AS result']));
    expect(result).toBe(true);
  });

  it('returns false when the query rejects', async () => {
    prismaInternalMock.$queryRaw.mockRejectedValueOnce(new Error('Database error'));

    const result = await checkDatabaseHealth();

    expect(prismaInternalMock.$queryRaw).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });

  it('returns false when the query resolves but result is not 1', async () => {
    prismaInternalMock.$queryRaw.mockResolvedValueOnce([{ result: 0 }]);

    const result = await checkDatabaseHealth();

    expect(result).toBe(false);
  });
});

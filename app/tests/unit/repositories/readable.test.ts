import { TEST_IDIR_USER_1 } from '#tests/unit/data/index';
import { prismaTxMock } from '#tests/__mocks__/prismaMock';
import { ReadableRepository } from '#src/repositories/readable';

import type { PrismaTransactionClient } from '#src/db/database';

// Tiny concrete subclass exposing the protected constructor over a real (deep-mocked) delegate.
class TestReadableRepository extends ReadableRepository<PrismaTransactionClient['user']> {
  constructor(softDeleteEnabled = false) {
    super(prismaTxMock.user, softDeleteEnabled);
  }
}

describe('ReadableRepository', () => {
  describe('count', () => {
    it('passes args through to the delegate and returns the result', async () => {
      const repo = new TestReadableRepository();
      prismaTxMock.user.count.mockResolvedValueOnce(3);

      const result = await repo.count({ where: { userId: 'e1' } });

      expect(prismaTxMock.user.count).toHaveBeenCalledTimes(1);
      expect(prismaTxMock.user.count).toHaveBeenCalledWith({ where: { userId: 'e1' } });
      expect(result).toBe(3);
    });
  });

  describe('findMany', () => {
    it('passes args through to the delegate and returns the result', async () => {
      const repo = new TestReadableRepository();
      prismaTxMock.user.findMany.mockResolvedValueOnce([TEST_IDIR_USER_1]);

      const result = await repo.findMany({ where: { userId: 'e1' } });

      expect(prismaTxMock.user.findMany).toHaveBeenCalledTimes(1);
      expect(prismaTxMock.user.findMany).toHaveBeenCalledWith({ where: { userId: 'e1' } });
      expect(result).toStrictEqual([TEST_IDIR_USER_1]);
    });
  });

  describe('findFirst', () => {
    it('passes args through to the delegate and returns the result', async () => {
      const repo = new TestReadableRepository();
      prismaTxMock.user.findFirst.mockResolvedValueOnce(TEST_IDIR_USER_1);

      const result = await repo.findFirst({ where: { userId: 'e1' } });

      expect(prismaTxMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaTxMock.user.findFirst).toHaveBeenCalledWith({ where: { userId: 'e1' } });
      expect(result).toStrictEqual(TEST_IDIR_USER_1);
    });
  });

  describe('findFirstOrThrow', () => {
    it('passes args through to the delegate and returns the result', async () => {
      const repo = new TestReadableRepository();
      prismaTxMock.user.findFirstOrThrow.mockResolvedValueOnce(TEST_IDIR_USER_1);

      const result = await repo.findFirstOrThrow({ where: { userId: 'e1' } });

      expect(prismaTxMock.user.findFirstOrThrow).toHaveBeenCalledTimes(1);
      expect(prismaTxMock.user.findFirstOrThrow).toHaveBeenCalledWith({ where: { userId: 'e1' } });
      expect(result).toStrictEqual(TEST_IDIR_USER_1);
    });
  });

  describe('findUnique', () => {
    it('passes args through to the delegate and returns the result', async () => {
      const repo = new TestReadableRepository();
      prismaTxMock.user.findUnique.mockResolvedValueOnce(TEST_IDIR_USER_1);

      const result = await repo.findUnique({ where: { userId: 'e1' } });

      expect(prismaTxMock.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaTxMock.user.findUnique).toHaveBeenCalledWith({ where: { userId: 'e1' } });
      expect(result).toStrictEqual(TEST_IDIR_USER_1);
    });
  });

  describe('findUniqueOrThrow', () => {
    it('returns the entity when one is found', async () => {
      const repo = new TestReadableRepository();
      prismaTxMock.user.findUnique.mockResolvedValueOnce(TEST_IDIR_USER_1);

      const result = await repo.findUniqueOrThrow({ where: { userId: 'e1' } });

      expect(prismaTxMock.user.findUnique).toHaveBeenCalledWith({ where: { userId: 'e1' } });
      expect(result).toStrictEqual(TEST_IDIR_USER_1);
    });

    it('throws when no entity is found', async () => {
      const repo = new TestReadableRepository();
      prismaTxMock.user.findUnique.mockResolvedValueOnce(null);

      await expect(repo.findUniqueOrThrow({ where: { userId: 'e1' } })).rejects.toThrow(
        '[404] Record Not Found (/problems/not-found)'
      );
    });
  });

  describe('withNotDeleted', () => {
    it('adds deletedAt:null when soft delete is enabled and includeDeleted is not set', async () => {
      const repo = new TestReadableRepository(true);
      prismaTxMock.user.findMany.mockResolvedValueOnce([]);

      await repo.findMany({ where: { userId: 'e1' } });

      expect(prismaTxMock.user.findMany).toHaveBeenCalledWith({
        where: { userId: 'e1', deletedAt: null }
      });
    });

    it('defaults to a where with deletedAt:null when soft delete is enabled and no args are given', async () => {
      const repo = new TestReadableRepository(true);
      prismaTxMock.user.findMany.mockResolvedValueOnce([]);

      await repo.findMany();

      expect(prismaTxMock.user.findMany).toHaveBeenCalledWith({ where: { deletedAt: null } });
    });

    it.each(['count', 'findMany', 'findFirst', 'findFirstOrThrow', 'findUnique'] as const)(
      'passes includeDeleted through to the filterDeleted extension for %s',
      async (method) => {
        const repo = new TestReadableRepository(true);
        const read = repo[method] as (args: unknown, options: { includeDeleted: boolean }) => Promise<unknown>;

        await read.call(repo, { where: { userId: 'e1' } }, { includeDeleted: true });

        expect(prismaTxMock.user[method]).toHaveBeenCalledWith({ where: { userId: 'e1' }, includeDeleted: true });
      }
    );

    it('passes includeDeleted through when no args are given', async () => {
      const repo = new TestReadableRepository(true);

      await repo.findMany(undefined, { includeDeleted: true });

      expect(prismaTxMock.user.findMany).toHaveBeenCalledWith({ includeDeleted: true });
    });

    it('passes includeDeleted through when soft delete is disabled', async () => {
      // The extension filters every model with deletedAt, regardless of this repository setting
      const repo = new TestReadableRepository(false);

      await repo.findMany({ where: { userId: 'e1' } }, { includeDeleted: true });

      expect(prismaTxMock.user.findMany).toHaveBeenCalledWith({ where: { userId: 'e1' }, includeDeleted: true });
    });

    it('does not add deletedAt:null when soft delete is disabled', async () => {
      const repo = new TestReadableRepository(false);
      prismaTxMock.user.findMany.mockResolvedValueOnce([]);

      await repo.findMany({ where: { userId: 'e1' } });

      expect(prismaTxMock.user.findMany).toHaveBeenCalledWith({ where: { userId: 'e1' } });
    });
  });
});

import { TEST_IDIR_USER_1 } from '#tests/unit/data/index';
import { prismaTxMock } from '#tests/__mocks__/prismaMock';
import { WritableRepository } from '#src/repositories/writable';

import type { PrismaTransactionClient } from '#src/db/database';

const PRINCIPAL = 'principal-id';

// Tiny concrete subclass exposing the protected constructor over a real (deep-mocked) delegate.
class TestWritableRepository extends WritableRepository<PrismaTransactionClient['user']> {
  constructor(softDeleteEnabled = false) {
    super(prismaTxMock.user, PRINCIPAL, softDeleteEnabled);
  }
}

const CREATE_DATA = {
  id: 'e1',
  sub: 'testuser'
};

describe('WritableRepository', () => {
  describe('execute error handling', () => {
    it('catches and maps Prisma errors during execution', async () => {
      const repo = new TestWritableRepository();
      prismaTxMock.user.create.mockRejectedValueOnce(new Error('Prisma error'));

      await expect(repo.create(CREATE_DATA)).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('stamps create audit fields and calls the delegate', async () => {
      const repo = new TestWritableRepository();
      prismaTxMock.user.create.mockResolvedValueOnce(TEST_IDIR_USER_1);

      const result = await repo.create(CREATE_DATA);

      expect(prismaTxMock.user.create).toHaveBeenCalledTimes(1);
      expect(prismaTxMock.user.create).toHaveBeenCalledWith({
        data: { ...CREATE_DATA, createdAt: expect.any(Date), createdBy: PRINCIPAL }
      });
      expect(result).toStrictEqual(TEST_IDIR_USER_1);
    });
  });

  describe('createIfNotExists', () => {
    it('stamps create audit fields and calls upsert with empty update', async () => {
      const repo = new TestWritableRepository();
      prismaTxMock.user.upsert.mockResolvedValueOnce(TEST_IDIR_USER_1);

      const result = await repo.createIfNotExists({ id: 'e1' }, CREATE_DATA);

      expect(prismaTxMock.user.upsert).toHaveBeenCalledTimes(1);
      expect(prismaTxMock.user.upsert).toHaveBeenCalledWith({
        where: { id: 'e1' },
        create: { ...CREATE_DATA, createdAt: expect.any(Date), createdBy: PRINCIPAL },
        update: {}
      });
      expect(result).toStrictEqual(TEST_IDIR_USER_1);
    });
  });

  describe('update', () => {
    it('stamps update audit fields and calls the delegate', async () => {
      const repo = new TestWritableRepository();
      prismaTxMock.user.update.mockResolvedValueOnce(TEST_IDIR_USER_1);

      const result = await repo.update({ id: 'e1' }, { active: false });

      expect(prismaTxMock.user.update).toHaveBeenCalledTimes(1);
      expect(prismaTxMock.user.update).toHaveBeenCalledWith({
        where: { id: 'e1' },
        data: { active: false, updatedAt: expect.any(Date), updatedBy: PRINCIPAL }
      });
      expect(result).toStrictEqual(TEST_IDIR_USER_1);
    });
  });

  describe('upsert', () => {
    it('stamps create audit on create and update audit on update', async () => {
      const repo = new TestWritableRepository();
      prismaTxMock.user.upsert.mockResolvedValueOnce(TEST_IDIR_USER_1);

      const result = await repo.upsert({ id: 'e1' }, CREATE_DATA, { active: false });

      expect(prismaTxMock.user.upsert).toHaveBeenCalledTimes(1);
      expect(prismaTxMock.user.upsert).toHaveBeenCalledWith({
        where: { id: 'e1' },
        create: { ...CREATE_DATA, createdAt: expect.any(Date), createdBy: PRINCIPAL },
        update: { active: false, updatedAt: expect.any(Date), updatedBy: PRINCIPAL }
      });
      expect(result).toStrictEqual(TEST_IDIR_USER_1);
    });
  });

  describe('delete', () => {
    it('soft deletes (update with audit + soft-delete stamps) when soft delete is enabled', async () => {
      const repo = new TestWritableRepository(true);
      prismaTxMock.user.update.mockResolvedValueOnce(TEST_IDIR_USER_1);

      const result = await repo.delete({ id: 'e1' });

      expect(prismaTxMock.user.update).toHaveBeenCalledTimes(1);
      expect(prismaTxMock.user.update).toHaveBeenCalledWith({
        where: { id: 'e1' },
        data: {
          updatedAt: expect.any(Date),
          updatedBy: PRINCIPAL,
          deletedAt: expect.any(Date),
          deletedBy: PRINCIPAL
        }
      });
      expect(prismaTxMock.user.delete).not.toHaveBeenCalled();
      expect(result).toStrictEqual(TEST_IDIR_USER_1);
    });

    it('hard deletes when the hard option is set even with soft delete enabled', async () => {
      const repo = new TestWritableRepository(true);
      prismaTxMock.user.delete.mockResolvedValueOnce(TEST_IDIR_USER_1);

      const result = await repo.delete({ id: 'e1' }, { hard: true });

      expect(prismaTxMock.user.delete).toHaveBeenCalledTimes(1);
      expect(prismaTxMock.user.delete).toHaveBeenCalledWith({ where: { id: 'e1' } });
      expect(prismaTxMock.user.update).not.toHaveBeenCalled();
      expect(result).toStrictEqual(TEST_IDIR_USER_1);
    });

    it('hard deletes when soft delete is disabled', async () => {
      const repo = new TestWritableRepository(false);
      prismaTxMock.user.delete.mockResolvedValueOnce(TEST_IDIR_USER_1);

      const result = await repo.delete({ id: 'e1' });

      expect(prismaTxMock.user.delete).toHaveBeenCalledTimes(1);
      expect(prismaTxMock.user.delete).toHaveBeenCalledWith({ where: { id: 'e1' } });
      expect(prismaTxMock.user.update).not.toHaveBeenCalled();
      expect(result).toStrictEqual(TEST_IDIR_USER_1);
    });
  });

  describe('deleteMany', () => {
    it('soft deletes (update with audit + soft-delete stamps) when soft delete is enabled', async () => {
      const repo = new TestWritableRepository(true);
      prismaTxMock.user.updateMany.mockResolvedValueOnce({ count: 1 });

      const result = await repo.deleteMany({ active: false });

      expect(prismaTxMock.user.updateMany).toHaveBeenCalledTimes(1);
      expect(prismaTxMock.user.updateMany).toHaveBeenCalledWith({
        where: { active: false },
        data: {
          updatedAt: expect.any(Date),
          updatedBy: PRINCIPAL,
          deletedAt: expect.any(Date),
          deletedBy: PRINCIPAL
        }
      });
      expect(prismaTxMock.user.deleteMany).not.toHaveBeenCalled();
      expect(result).toStrictEqual({ count: 1 });
    });

    it('hard deletes when the hard option is set even with soft delete enabled', async () => {
      const repo = new TestWritableRepository(true);
      prismaTxMock.user.deleteMany.mockResolvedValueOnce({ count: 1 });

      await repo.deleteMany({ active: false }, { hard: true });

      expect(prismaTxMock.user.deleteMany).toHaveBeenCalledTimes(1);
      expect(prismaTxMock.user.deleteMany).toHaveBeenCalledWith({ where: { active: false } });
      expect(prismaTxMock.user.updateMany).not.toHaveBeenCalled();
    });

    it('hard deletes when soft delete is disabled', async () => {
      const repo = new TestWritableRepository(false);
      prismaTxMock.user.deleteMany.mockResolvedValueOnce({ count: 1 });

      await repo.deleteMany({ active: false });

      expect(prismaTxMock.user.deleteMany).toHaveBeenCalledTimes(1);
      expect(prismaTxMock.user.deleteMany).toHaveBeenCalledWith({ where: { active: false } });
      expect(prismaTxMock.user.updateMany).not.toHaveBeenCalled();
    });
  });
});

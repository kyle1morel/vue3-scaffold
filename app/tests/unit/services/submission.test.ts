import { mockReset } from 'vitest-mock-extended';

import { TEST_SUBMISSION_1 } from '#tests/unit/data/index';
import { mockRepos } from '#tests/__mocks__/unitOfWorkMock';
import {
  createSubmissionService,
  deleteSubmissionService,
  getSubmissionService,
  listSubmissionsService
} from '#src/services/submission';

import type { CreateSubmissionRequest } from '#types';

describe('submission service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReset(mockRepos);
  });

  describe('createSubmissionService', () => {
    const request: CreateSubmissionRequest = {
      firstName: 'Jane',
      email: 'jane.doe@example.com',
      province: 'BC',
      contactMethod: 'email',
      startDate: '2026-01-15'
    };

    it('creates the submission with a new id and returns it', async () => {
      mockRepos.submission.create.mockResolvedValue(TEST_SUBMISSION_1 as never);

      const result = await createSubmissionService(request);

      expect(mockRepos.submission.create).toHaveBeenCalledWith({
        ...request,
        id: expect.stringMatching(/^[0-9a-f-]{36}$/),
        startDate: new Date('2026-01-15')
      });
      expect(result).toEqual(TEST_SUBMISSION_1);
    });

    it('saves a missing start date as null', async () => {
      mockRepos.submission.create.mockResolvedValue(TEST_SUBMISSION_1 as never);

      await createSubmissionService({ ...request, startDate: undefined });

      expect(mockRepos.submission.create).toHaveBeenCalledWith(expect.objectContaining({ startDate: null }));
    });
  });

  describe('deleteSubmissionService', () => {
    it('deletes the submission with the id', async () => {
      mockRepos.submission.delete.mockResolvedValue(TEST_SUBMISSION_1 as never);

      await deleteSubmissionService(TEST_SUBMISSION_1.id);

      expect(mockRepos.submission.delete).toHaveBeenCalledWith({ id: TEST_SUBMISSION_1.id });
    });

    it('propagates the not found error', async () => {
      const error = new Error('not found');
      mockRepos.submission.delete.mockRejectedValue(error);

      await expect(deleteSubmissionService('missing-id')).rejects.toThrow(error);
    });
  });

  describe('getSubmissionService', () => {
    it('returns the submission with the id', async () => {
      mockRepos.submission.findUniqueOrThrow.mockResolvedValue(TEST_SUBMISSION_1 as never);

      const result = await getSubmissionService(TEST_SUBMISSION_1.id);

      expect(mockRepos.submission.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: TEST_SUBMISSION_1.id } });
      expect(result).toEqual(TEST_SUBMISSION_1);
    });

    it('propagates the not found error', async () => {
      const error = new Error('not found');
      mockRepos.submission.findUniqueOrThrow.mockRejectedValue(error);

      await expect(getSubmissionService('missing-id')).rejects.toThrow(error);
    });
  });

  describe('listSubmissionsService', () => {
    it('returns the requested page newest first with the total', async () => {
      mockRepos.submission.findMany.mockResolvedValue([TEST_SUBMISSION_1] as never);
      mockRepos.submission.count.mockResolvedValue(21 as never);

      const result = await listSubmissionsService({ page: 3, pageSize: 10 });

      expect(mockRepos.submission.findMany).toHaveBeenCalledWith({
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
        skip: 20,
        take: 10
      });
      expect(result).toEqual({ items: [TEST_SUBMISSION_1], total: 21 });
    });
  });
});

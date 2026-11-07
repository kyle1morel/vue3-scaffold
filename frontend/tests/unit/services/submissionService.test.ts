import { appAxios } from '@/services/interceptors';
import { createSubmission, deleteSubmission, getSubmission, listSubmissions } from '@/services/submissionService';

// Mocks

vi.mock('@/services/interceptors', () => ({
  appAxios: vi.fn()
}));

// Fixtures

// Mount

// Tests

describe('submission service', () => {
  const mockDelete = vi.fn();
  const mockGet = vi.fn();
  const mockPost = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(appAxios).mockReturnValue({
      delete: mockDelete,
      get: mockGet,
      post: mockPost
    } as never);
  });

  describe('createSubmission', () => {
    it('posts the submission and returns the saved one', async () => {
      const body = {
        firstName: 'Jane',
        email: 'jane.doe@example.com',
        province: 'BC',
        contactMethod: 'email'
      } as const;
      const saved = { id: 'submission-1', ...body };

      mockPost.mockResolvedValue({
        data: saved
      });

      const result = await createSubmission(body);

      expect(mockPost).toHaveBeenCalledWith('submission', body, undefined);
      expect(result).toEqual(saved);
    });

    it('propagates errors', async () => {
      const error = new Error('save failed');

      mockPost.mockRejectedValue(error);

      await expect(createSubmission({} as never)).rejects.toThrow(error);
    });
  });

  describe('deleteSubmission', () => {
    it('deletes the submission by id', async () => {
      mockDelete.mockResolvedValue({
        status: 204,
        data: ''
      });

      const result = await deleteSubmission('submission-1');

      expect(mockDelete).toHaveBeenCalledWith('submission/submission-1', undefined);
      expect(result).toBeUndefined();
    });

    it('propagates errors', async () => {
      const error = new Error('delete failed');

      mockDelete.mockRejectedValue(error);

      await expect(deleteSubmission('submission-1')).rejects.toThrow(error);
    });
  });

  describe('getSubmission', () => {
    it('gets the submission by id and returns it', async () => {
      const submission = { id: 'submission-1', firstName: 'Jane' };

      mockGet.mockResolvedValue({
        data: submission
      });

      const result = await getSubmission('submission-1');

      expect(mockGet).toHaveBeenCalledWith('submission/submission-1', undefined);
      expect(result).toEqual(submission);
    });

    it('propagates errors', async () => {
      const error = new Error('load failed');

      mockGet.mockRejectedValue(error);

      await expect(getSubmission('submission-1')).rejects.toThrow(error);
    });
  });

  describe('listSubmissions', () => {
    it('gets the page as query params and returns it', async () => {
      const page = {
        items: [{ id: 'submission-1' }],
        total: 1
      };

      mockGet.mockResolvedValue({
        data: page
      });

      const result = await listSubmissions({ page: 2, pageSize: 25 });

      expect(mockGet).toHaveBeenCalledWith('submission', { params: { page: 2, pageSize: 25 } });
      expect(result).toEqual(page);
    });

    it('propagates errors', async () => {
      const error = new Error('load failed');

      mockGet.mockRejectedValue(error);

      await expect(listSubmissions({ page: 1, pageSize: 10 })).rejects.toThrow(error);
    });
  });
});

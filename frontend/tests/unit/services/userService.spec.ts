import { appAxios } from '@/services/interceptors';
import { getCurrentUser, searchUsers } from '@/services/userService';

// Mocks

vi.mock('@/services/interceptors', () => ({
  appAxios: vi.fn()
}));

// Fixtures

// Mount

// Tests

describe('user service', () => {
  const mockGet = vi.fn();
  const mockPost = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(appAxios).mockReturnValue({
      get: mockGet,
      post: mockPost
    } as never);
  });

  describe('getCurrentUser', () => {
    it('gets and returns the current user', async () => {
      const user = {
        id: 'user-1',
        firstName: 'John'
      };

      mockGet.mockResolvedValue({
        data: user
      });

      const result = await getCurrentUser();

      expect(mockGet).toHaveBeenCalledWith('user/me', undefined);
      expect(result).toEqual(user);
    });

    it('propagates errors', async () => {
      const error = new Error('request failed');

      mockGet.mockRejectedValue(error);

      await expect(getCurrentUser()).rejects.toThrow(error);
    });
  });

  describe('searchUsers', () => {
    it('posts search criteria and returns users', async () => {
      const filters = {
        id: ['user-1']
      };

      const users = [
        {
          id: 'user-1',
          firstName: 'John'
        },
        {
          id: 'user-2',
          firstName: 'Jane'
        }
      ];

      mockPost.mockResolvedValue({
        data: users
      });

      const result = await searchUsers(filters as never);

      expect(mockPost).toHaveBeenCalledWith('user/search', filters, undefined);
      expect(result).toEqual(users);
    });

    it('supports an empty request', async () => {
      mockPost.mockResolvedValue({
        data: []
      });

      const result = await searchUsers({} as never);

      expect(mockPost).toHaveBeenCalledWith('user/search', {}, undefined);
      expect(result).toEqual([]);
    });

    it('propagates errors', async () => {
      const error = new Error('search failed');

      mockPost.mockRejectedValue(error);

      await expect(searchUsers({} as never)).rejects.toThrow(error);
    });
  });
});

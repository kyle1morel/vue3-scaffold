import { appAxios } from '@/services/interceptors';
import { searchUsers, userService } from '@/services/userService';

// Mocks

vi.mock('@/services/interceptors', () => ({
  appAxios: vi.fn()
}));

// Fixtures

// Mount

// Tests

describe('user service', () => {
  const mockPost = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(appAxios).mockReturnValue({
      post: mockPost
    } as never);
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

  it('exports all service functions', () => {
    expect(userService).toEqual({
      searchUsers
    });
  });
});

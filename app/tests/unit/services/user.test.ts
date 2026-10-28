import { mockReset } from 'vitest-mock-extended';

import { TEST_IDIR_USER_1 } from '#tests/unit/data/index';
import { mockRepos } from '#tests/__mocks__/unitOfWorkMock';
import { getUserService, searchUsersService } from '#src/services/user';

import type { UserSearchParameters } from '#types';

describe('user service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReset(mockRepos);
  });

  describe('getUserService', () => {
    it('returns the user with the id', async () => {
      mockRepos.user.findUniqueOrThrow.mockResolvedValue(TEST_IDIR_USER_1 as never);

      const result = await getUserService(TEST_IDIR_USER_1.id);

      expect(mockRepos.user.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: TEST_IDIR_USER_1.id } });
      expect(result).toEqual(TEST_IDIR_USER_1);
    });

    it('propagates the not found error', async () => {
      const error = new Error('not found');
      mockRepos.user.findUniqueOrThrow.mockRejectedValue(error);

      await expect(getUserService('missing-id')).rejects.toThrow(error);
    });
  });

  describe('searchUsersService', () => {
    it('returns users from search', async () => {
      const users = [{ ...TEST_IDIR_USER_1 }];

      mockRepos.user.search.mockResolvedValue(users as never);

      const params: UserSearchParameters = {
        email: 'john@example.com'
      };

      const result = await searchUsersService(params);

      expect(mockRepos.user.search).toHaveBeenCalledWith(params);
      expect(result).toEqual(users);
    });

    it('returns empty array when no users match search', async () => {
      mockRepos.user.search.mockResolvedValue([] as never);

      const params: UserSearchParameters = {
        email: 'nonexistent@example.com'
      };

      const result = await searchUsersService(params);

      expect(mockRepos.user.search).toHaveBeenCalledWith(params);
      expect(result).toEqual([]);
    });
  });
});

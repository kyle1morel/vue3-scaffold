import { mockReset } from 'vitest-mock-extended';

import { mockRepos } from '#tests/__mocks__/unitOfWorkMock';
import * as userDomain from '#src/domains/user';
import * as loginService from '#src/services/login';
import { IdentityProviderKind } from '#src/utils/enums/application';

import type { JwtPayload } from 'jsonwebtoken';

const createUserSpy = vi.spyOn(userDomain, 'createUser');
const updateUserSpy = vi.spyOn(userDomain, 'updateUser');

describe('login service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReset(mockRepos);
  });

  describe('loginService', () => {
    it('updates an existing user', async () => {
      const token: JwtPayload = {
        sub: 'existing-sub',
        given_name: 'John',
        family_name: 'Doe',
        email: 'john@example.com',
        identity_provider: IdentityProviderKind.AZUREIDIR
      };

      const mockUser = { id: 'user-1', sub: 'existing-sub' };

      mockRepos.user.findBySub.mockResolvedValueOnce(mockUser as never);
      updateUserSpy.mockResolvedValueOnce(mockUser as never);

      const result = await loginService.loginService(token);

      expect(mockRepos.user.findBySub).toHaveBeenCalledWith('existing-sub');
      expect(updateUserSpy).toHaveBeenCalledWith(
        expect.anything(),
        'user-1',
        expect.objectContaining({ sub: 'existing-sub', firstName: 'John' })
      );
      expect(createUserSpy).not.toHaveBeenCalled();
      expect(result).toStrictEqual(mockUser);
    });

    it('creates a new user if none exists', async () => {
      const token: JwtPayload = {
        sub: 'new-sub',
        given_name: 'Jane',
        family_name: 'Smith',
        email: 'jane@example.com',
        identity_provider: IdentityProviderKind.AZUREIDIR
      };

      const mockNewUser = { id: 'user-2', sub: 'new-sub' };

      mockRepos.user.findBySub.mockResolvedValueOnce(null as never);
      createUserSpy.mockResolvedValueOnce(mockNewUser as never);

      const result = await loginService.loginService(token);

      expect(createUserSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ sub: 'new-sub', firstName: 'Jane' })
      );
      expect(updateUserSpy).not.toHaveBeenCalled();
      expect(result).toStrictEqual(mockNewUser);
    });
  });
});

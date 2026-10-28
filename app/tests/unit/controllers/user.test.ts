import { TEST_CURRENT_CONTEXT, TEST_IDIR_USER_1 } from '#tests/unit/data/index';
import { getCurrentUserController, searchUsersController } from '#src/controllers/user';
import * as userService from '#src/services/user';

import type { Request, Response } from 'express';
import type { Mock } from 'vitest';
import type { LocalContext, User, UserSearchParameters } from '#types';

const mockResponse = () => {
  const res: { locals: Record<string, unknown>; status?: Mock; json?: Mock; end?: Mock } = {
    locals: {}
  };
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.end = vi.fn().mockReturnValue(res);
  return res;
};

let res = mockResponse();
beforeEach(() => {
  res = mockResponse();
  res.locals.currentContext = TEST_CURRENT_CONTEXT;
  vi.clearAllMocks();
});

describe('getCurrentUserController', () => {
  it('should get the user from the current context and respond with 200', async () => {
    vi.spyOn(userService, 'getUserService').mockResolvedValueOnce(TEST_IDIR_USER_1);

    const req = {} as unknown as Request<never, never, never, never>;

    await getCurrentUserController(req, res as unknown as Response<User, LocalContext>);

    expect(userService.getUserService).toHaveBeenCalledTimes(1);
    expect(userService.getUserService).toHaveBeenCalledWith(TEST_CURRENT_CONTEXT.userId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(TEST_IDIR_USER_1);
  });
});

describe('searchUsersController', () => {
  it('should call service with extracted params and respond with 200', async () => {
    const mockUsers: User[] = [TEST_IDIR_USER_1];
    vi.spyOn(userService, 'searchUsersService').mockResolvedValueOnce(mockUsers);

    const searchParams: UserSearchParameters = {
      id: ['user-1'],
      idp: ['azureidir'],
      sub: 'sub-123',
      email: 'test@example.com',
      firstName: 'John',
      fullName: 'John Doe',
      lastName: 'Doe',
      active: true
    };

    const req = { body: searchParams } as unknown as Request<never, never, UserSearchParameters, never>;

    await searchUsersController(req, res as unknown as Response);

    expect(userService.searchUsersService).toHaveBeenCalledTimes(1);
    expect(userService.searchUsersService).toHaveBeenCalledWith(searchParams);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  it('should call service with partial params (isTruthy coercion)', async () => {
    const mockUsers: User[] = [];
    vi.spyOn(userService, 'searchUsersService').mockResolvedValueOnce(mockUsers);

    const req = { body: { active: undefined, firstName: 'Jane' } } as unknown as Request<
      never,
      never,
      UserSearchParameters,
      never
    >;

    await searchUsersController(req, res as unknown as Response);

    expect(userService.searchUsersService).toHaveBeenCalledTimes(1);
    expect(userService.searchUsersService).toHaveBeenCalledWith({
      id: undefined,
      idp: undefined,
      sub: undefined,
      email: undefined,
      firstName: 'Jane',
      fullName: undefined,
      lastName: undefined,
      active: undefined
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });
});

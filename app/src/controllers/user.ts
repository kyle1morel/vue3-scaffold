import { getUserService, searchUsersService } from '#src/services/user';

import type { Request, Response } from 'express';
import type { LocalContext, SearchUsersRequest, User } from '#types';

/**
 * Gets the user making the request.
 * @param _req - The request.
 * @param res - The response, sent the current user.
 */
export const getCurrentUserController = async (
  _req: Request<never, never, never, never>,
  res: Response<User, LocalContext>
) => {
  // requireSomeAuth guarantees a logged in user
  const response = await getUserService(res.locals.currentContext.userId!);

  res.status(200).json(response);
};

/**
 * Searches users by the filters in the request body.
 * @param req - The request, whose body holds the search filters.
 * @param res - The response, sent the matching users.
 */
export const searchUsersController = async (
  req: Request<never, never, SearchUsersRequest, never>,
  res: Response<User[]>
) => {
  const response = await searchUsersService({
    id: req.body.id,
    idp: req.body.idp,
    sub: req.body.sub,
    email: req.body.email,
    firstName: req.body.firstName,
    fullName: req.body.fullName,
    lastName: req.body.lastName,
    active: req.body.active
  });

  res.status(200).json(response);
};

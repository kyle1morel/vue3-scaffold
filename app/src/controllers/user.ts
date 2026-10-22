import { searchUsersService } from '#src/services/user';

import type { Request, Response } from 'express';
import type { SearchUsersRequest, User } from '#types';

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

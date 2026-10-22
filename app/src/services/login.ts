import { unitOfWork } from '#src/db/unitOfWork';
import { createUser, updateUser } from '#src/domains/user';

import type jwt from 'jsonwebtoken';
import type { User } from '#types';

/**
 * An equivalent User model object without timestamp information.
 */
export interface JwtUser {
  bceidBusinessName?: string | null;
  email: string | null;
  firstName: string | null;
  fullName: string | null;
  idp: string | null;
  lastName: string | null;
  sub: string;
}

/**
 * Transforms JWT payload contents into a User Model object
 * Checks IDIR/BCeID keys first, fallbacks are for BCSC.
 * @param token - The decoded JWT payload.
 * @returns An equivalent User model object.
 */
const _tokenToUser = (token: jwt.JwtPayload): JwtUser => {
  return {
    bceidBusinessName: token.bceid_business_name ?? null,
    sub: token.sub ? token.sub : token.preferred_username,
    firstName: token.given_name ?? token.given_names,
    fullName: token.name ?? token.display_name,
    lastName: token.family_name,
    email: token.email,
    idp: token.identity_provider
  };
};

/**
 * Parse the user token and update the user table if necessary.
 * @param token - The decoded JWT token payload.
 * @returns A Promise that resolves to the logged in user.
 */
export const loginService = async (token: jwt.JwtPayload): Promise<User> => {
  return await unitOfWork.execute(async ({ identityProvider, user }) => {
    const newUser = _tokenToUser(token);

    const oldUser = await user.findBySub(newUser.sub);

    return oldUser
      ? await updateUser({ identityProvider, user }, oldUser.id, newUser)
      : await createUser({ identityProvider, user }, newUser);
  });
};

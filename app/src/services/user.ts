import { unitOfWork } from '#src/db/unitOfWork';

import type { User, UserSearchParameters } from '#types';

/**
 * Gets a user by id.
 * @param id - The user id.
 * @returns A Promise that resolves to the user.
 * @throws {@link NotFoundProblem} When no user has the id.
 */
export const getUserService = async (id: string): Promise<User> => {
  return await unitOfWork.execute(async ({ user }) => await user.findUniqueOrThrow({ where: { id } }));
};

/**
 * Search and filter for specific users.
 * @param params - Optional filtering parameters.
 * @param params.id - Optional array of user ids.
 * @param params.idp - Optional array of identity providers.
 * @param params.sub - Optional sub string to match on.
 * @param params.email - Optional email string to match on.
 * @param params.firstName - Optional firstName string to match on.
 * @param params.fullName - Optional fullName string to match on.
 * @param params.lastName - Optional lastName string to match on.
 * @param params.active - Optional boolean on user active status.
 * @returns A Promise that resolves into a list of users from search params.
 */
export const searchUsersService = async (params: UserSearchParameters): Promise<User[]> => {
  return await unitOfWork.execute(async ({ user }) => await user.search(params));
};

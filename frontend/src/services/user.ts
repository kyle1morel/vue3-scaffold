import { api } from './apiClient';
import { createRouteBuilder } from './routeBuilder';

import type { RequestBody, User } from '@/types';

/**
 * Base route builder and endpoint definitions for this resource.
 * Routes should be referenced through this object rather than
 * constructing endpoint paths directly within service methods.
 */
const userRoute = createRouteBuilder('user');

const userRoutes = {
  me: () => userRoute('me'),
  search: () => userRoute('search')
} as const;

/**
 * Gets the logged in user, which also records their login in the API.
 * @returns A promise resolving to the current user.
 */
export function getCurrentUser(): Promise<User> {
  return api.get<User>(userRoutes.me());
}

/**
 * Searches users using the supplied filters.
 * @param req - Optional search criteria.
 * @returns A promise resolving to matching users.
 */
export function searchUsers(req: RequestBody<'searchUsers'>): Promise<User[]> {
  return api.post<User[]>(userRoutes.search(), req);
}

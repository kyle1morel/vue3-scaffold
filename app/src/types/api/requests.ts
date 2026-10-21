import type { z } from 'zod';
import type { schema as userSchema } from '#src/schemas/request/user';

/**
 * User
 */

export type SearchUsersRequest = z.infer<typeof userSchema.searchUsers.body>;

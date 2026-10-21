import type { z } from 'zod';
import type { userSchema } from '#src/schemas/response/user';

// no endpoint ever includes identityProvider (see src/services/user.ts), so it's dropped here.
export type User = z.infer<typeof userSchema>;

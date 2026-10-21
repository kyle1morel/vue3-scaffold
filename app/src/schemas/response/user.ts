import '#src/schemas/openapi';
import { userModelSchema } from '#prismaZod';

// search() doesn't include identityProvider - see src/repositories/user.ts.
export const userSchema = userModelSchema.omit({ identityProvider: true }).openapi('User');

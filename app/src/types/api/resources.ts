import type { z } from 'zod';
import type { submissionPageSchema, submissionSchema } from '#src/schemas/response/submission';
import type { userSchema } from '#src/schemas/response/user';

export type Submission = z.infer<typeof submissionSchema>;
export type SubmissionPage = z.infer<typeof submissionPageSchema>;

// no endpoint ever includes identityProvider (see src/services/user.ts), so it's dropped here.
export type User = z.infer<typeof userSchema>;

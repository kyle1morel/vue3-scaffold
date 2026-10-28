import type { z } from 'zod';
import type { schema as submissionSchema } from '#src/schemas/request/submission';
import type { schema as userSchema } from '#src/schemas/request/user';

/**
 * Submission.
 */

export type CreateSubmissionRequest = z.infer<typeof submissionSchema.createSubmission.body>;
export type SubmissionIdParams = z.infer<typeof submissionSchema.getSubmission.params>;
export type ListSubmissionsQuery = z.infer<typeof submissionSchema.listSubmissions.query>;

/**
 * User.
 */

export type SearchUsersRequest = z.infer<typeof userSchema.searchUsers.body>;

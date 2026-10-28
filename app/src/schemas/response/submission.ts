import { z } from 'zod';

import '#src/schemas/openapi';
import { submissionModelSchema } from '#prismaZod';

export const submissionSchema = submissionModelSchema.openapi('Submission');

export const submissionPageSchema = z
  .object({
    items: z.array(submissionSchema),
    total: z.number().int()
  })
  .openapi('SubmissionPage');

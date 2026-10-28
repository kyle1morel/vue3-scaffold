import { z } from 'zod';

import { dateOnlyString, email, phoneNumber, uuidv4 } from './common.ts';

const submissionIdParams = z.object({ submissionId: uuidv4 });

export const schema = {
  createSubmission: {
    body: z
      .object({
        firstName: z.string().min(1).max(255),
        email: email.max(255),
        phone: phoneNumber.nullish(),
        province: z.enum(['AB', 'BC', 'SK']),
        contactMethod: z.enum(['email', 'phone']),
        startDate: dateOnlyString.nullish(),
        quantity: z.number().int().min(1).max(100).nullish(),
        city: z.string().max(255).nullish(),
        category: z.string().max(100).nullish(),
        comments: z.string().max(1000).nullish(),
        notes: z.string().max(10000).nullish()
      })
      .strict()
  },
  deleteSubmission: {
    params: submissionIdParams
  },
  getSubmission: {
    params: submissionIdParams
  },
  listSubmissions: {
    query: z.object({
      page: z.coerce.number().int().min(1).default(1),
      pageSize: z.coerce.number().int().min(1).max(100).default(10)
    })
  }
};

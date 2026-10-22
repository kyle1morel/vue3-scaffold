import { z } from 'zod';

import { uuidv4 } from './common.ts';

export const schema = {
  searchUsers: {
    body: z
      .object({
        id: z.array(uuidv4).optional(),
        idp: z.array(z.string().max(255)).optional(),
        sub: z.string().max(255).optional(),
        email: z.string().max(255).optional(),
        firstName: z.string().max(255).optional(),
        fullName: z.string().max(255).optional(),
        lastName: z.string().max(255).optional(),
        active: z.boolean().optional()
      })
      .strict()
      .default({})
  }
};

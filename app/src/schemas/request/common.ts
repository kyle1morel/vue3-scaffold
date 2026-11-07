import { z } from 'zod';

import { Regex } from '#src/utils/enums/application';

/** Date-only string (YYYY-MM-DD), canonical and not in the future. */
export const dateOnlyString = z.iso
  .date('"Must be a valid date in the format YYYY-MM-DD"')
  .refine((value) => new Date(value).getTime() <= Date.now(), '"Must be a valid date in the format YYYY-MM-DD"');

/** Email address. */
export const email = z.email({ pattern: Regex.EMAIL });

/** Phone number. */
export const phoneNumber = z.string().regex(Regex.PHONE_NUMBER);

/** UUID v4. */
export const uuidv4 = z.uuidv4('Must be a valid uuidv4');

import { z } from 'zod';

import { Regex } from '#src/utils/enums/application';

/** Date-only string (YYYY-MM-DD), canonical and not in the future. */
export const dateOnlyString = z.iso
  .date('"Must be a valid date in the format YYYY-MM-DD"')
  .refine((value) => new Date(value).getTime() <= Date.now(), '"Must be a valid date in the format YYYY-MM-DD"');

/** Email address. */
export const email = z.email({ pattern: Regex.EMAIL });

/**
 * Date/timestamp not in the future, checked against the real current time on every parse
 * (not a fixed value baked in at schema-definition time).
 * @param message - Validation error message.
 * @returns A zod schema.
 */
export const notInFutureDate = (message: string) =>
  z
    .union([z.string(), z.number(), z.date()])
    .pipe(z.coerce.date())
    .refine((d) => d.getTime() <= Date.now(), { message });

/** Phone number. */
export const phoneNumber = z.string().regex(Regex.PHONE_NUMBER);

/** UTC time string (HH:MM:SS(.ffffff)Z). */
export const timeTzString = z.string().regex(Regex.TIMETZ, 'Must be a valid UTC time string (HH:MM:SS(.ffffff)Z)');

/** UUID v4. */
export const uuidv4 = z.uuidv4('Must be a valid uuidv4');

/** Boolean sent as a query string ("true"/"false"). */
export const queryBoolean = z.preprocess((value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}, z.boolean());

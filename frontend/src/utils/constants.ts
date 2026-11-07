// Custom patterns only; prefer zod's built-in formats (z.uuidv4(), z.iso.date(), ...) where one exists
export const Regex = {
  /**
   * Generic email regex requiring a domain of at least 2 chars.
   * @see {@link https://emailregex.com/}
   */
  EMAIL: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})+$/
} as const;

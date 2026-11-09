/** Default CORS settings used across the entire application. */
export const DEFAULTCORS = Object.freeze({
  /** Tells browsers to cache preflight requests for Access-Control-Max-Age seconds. */
  maxAge: 600,
  /** Set true to dynamically set Access-Control-Allow-Origin based on Origin. */
  origin: true
});

/**
 * Minimally valid UUIDv4 for the system ID.
 * @see https://www.rfc-editor.org/rfc/rfc9562#variant_field
 */
export const SYSTEM_ID = '00000000-0000-4000-8000-000000000000';

// Custom patterns only; prefer zod's built-in formats (z.uuidv4(), z.iso.date(), ...) where one exists.
export const Regex = {
  /**
   * Generic email regex requiring a domain of at least 2 chars.
   * @see {@link https://emailregex.com/}
   */
  EMAIL: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})+$/,
  PHONE_NUMBER: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
} as const;

/** Default CORS settings used across the entire application */
export const DEFAULTCORS = Object.freeze({
  /** Tells browsers to cache preflight requests for Access-Control-Max-Age seconds */
  maxAge: 600,
  /** Set true to dynamically set Access-Control-Allow-Origin based on Origin */
  origin: true
});

/**
 * Minimally valid UUIDv4 for the system ID
 * @see https://www.rfc-editor.org/rfc/rfc9562#variant_field
 */
export const SYSTEM_ID = '00000000-0000-4000-8000-000000000000';

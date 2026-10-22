export const AuthType = {
  /** OIDC JWT Authentication header provided. */
  BEARER: 'BEARER',
  /** No Authentication header provided. */
  NONE: 'NONE'
} as const;
export type AuthType = (typeof AuthType)[keyof typeof AuthType];

export const IdentityProviderKind = {
  AZUREIDIR: 'azureidir',
  BCEID: 'bceidbasic',
  BCEIDBUSINESS: 'bceidbusiness',
  BCSC: 'bcsc'
} as const;
export type IdentityProviderKind = (typeof IdentityProviderKind)[keyof typeof IdentityProviderKind];

// Custom patterns only; prefer zod's built-in formats (z.uuidv4(), z.iso.date(), ...) where one exists
export const Regex = {
  /**
   * Generic email regex requiring a domain of at least 2 chars.
   * @see {@link https://emailregex.com/}
   */
  EMAIL: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})+$/,
  PHONE_NUMBER: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
  TIMETZ: /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.\d{1,7})?Z$/
} as const;

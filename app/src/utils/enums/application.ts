export const AuthType = {
  /** OIDC JWT Authentication header provided */
  BEARER: 'BEARER',
  /** No Authentication header provided */
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

export const Regex = {
  DATE_ONLY: String.raw`^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$`,
  /**
   * Generic email regex requiring a domain of at least 2 chars, plain string as `String.raw` can't hold its backtick
   * @see {@link https://emailregex.com/}
   */
  EMAIL: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]{2,})+$',
  PHONE_NUMBER: String.raw`^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$`,
  TIMETZ: String.raw`^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.\d{1,7})?Z$`,
  UUIDV4: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$'
} as const;
export type Regex = (typeof Regex)[keyof typeof Regex];

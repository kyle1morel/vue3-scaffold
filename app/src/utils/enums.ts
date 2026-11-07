import type { ValueOf } from '#types';

export const AuthType = {
  /** OIDC JWT Authentication header provided. */
  BEARER: 'BEARER',
  /** No Authentication header provided. */
  NONE: 'NONE'
} as const;
export type AuthType = ValueOf<typeof AuthType>;

export const IdentityProviderKind = {
  AZUREIDIR: 'azureidir',
  BCEID: 'bceidbasic',
  BCEIDBUSINESS: 'bceidbusiness',
  BCSC: 'bcsc'
} as const;
export type IdentityProviderKind = ValueOf<typeof IdentityProviderKind>;

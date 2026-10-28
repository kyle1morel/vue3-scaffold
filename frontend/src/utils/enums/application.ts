export const ButtonMode = {
  BUTTON: 0,
  ICON: 1
} as const;

export type ButtonMode = (typeof ButtonMode)[keyof typeof ButtonMode];

// Custom patterns only; prefer zod's built-in formats (z.uuidv4(), z.iso.date(), ...) where one exists
export const Regex = {
  /**
   * Generic email regex requiring a domain of at least 2 chars.
   * @see {@link https://emailregex.com/}
   */
  EMAIL: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})+$/
} as const;

export const RouteName = {
  DEMO_FORM: 'demo_form',
  DEVELOPER: 'developer',
  FORBIDDEN: 'forbidden',
  HOME: 'home',
  LOGIN: 'login',
  NOT_FOUND: 'not_found',
  OIDC_CALLBACK: 'oidc_callback',
  OIDC_LOGIN: 'oidc_login',
  OIDC_LOGOUT: 'oidc_logout'
} as const;

export type RouteName = (typeof RouteName)[keyof typeof RouteName];

export const IdentityProviderKind = {
  AZUREIDIR: 'azureidir',
  BCEID: 'bceidbasic',
  BCEIDBUSINESS: 'bceidbusiness',
  BCSC: 'bcsc'
} as const;

export type IdentityProviderKind = (typeof IdentityProviderKind)[keyof typeof IdentityProviderKind];

export const StorageKey = {
  AUTH: 'entrypoint',
  CHUNK_RELOAD: 'chunkReload',
  CONFIG: 'config'
} as const;

export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey];

export const ToastTimeout = {
  ERROR: 5000,
  INFO: 3000,
  STICKY: 0,
  SUCCESS: 3000,
  WARNING: 5000
} as const;

export type ToastTimeout = (typeof ToastTimeout)[keyof typeof ToastTimeout];

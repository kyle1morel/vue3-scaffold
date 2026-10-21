export const BasicResponse = {
  YES: 'Yes',
  NO: 'No',
  UNSURE: 'Unsure'
} as const;

export type BasicResponse = (typeof BasicResponse)[keyof typeof BasicResponse];

export const ButtonMode = {
  BUTTON: 0,
  ICON: 1
} as const;

export type ButtonMode = (typeof ButtonMode)[keyof typeof ButtonMode];

export const Regex = {
  // https://emailregex.com/
  // HTML5 - Modified to require domain of at least 2 characters
  EMAIL: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]{2,})+$'
} as const;

export type Regex = (typeof Regex)[keyof typeof Regex];

export const RouteName = {
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

export const UserSearchParams = {
  FIRST_NAME: 'First name',
  LAST_NAME: 'Last name',
  EMAIL: 'Email'
} as const;

export type UserSearchParams = (typeof UserSearchParams)[keyof typeof UserSearchParams];

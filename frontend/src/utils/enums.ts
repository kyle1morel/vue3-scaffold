import type { ValueOf } from '@/types';

export const RouteName = {
  COMPONENTS: 'components',
  DEMO_FORM: 'demo_form',
  DEVELOPER: 'developer',
  FORBIDDEN: 'forbidden',
  HOME: 'home',
  LOGIN: 'login',
  NOT_FOUND: 'not_found',
  OIDC_CALLBACK: 'oidc_callback',
  OIDC_LOGIN: 'oidc_login',
  OIDC_LOGOUT: 'oidc_logout',
  SUBMISSION: 'submission',
  SUBMISSIONS: 'submissions'
} as const;

export type RouteName = ValueOf<typeof RouteName>;

export const IdentityProviderKind = {
  AZUREIDIR: 'azureidir',
  BCEID: 'bceidbasic',
  BCEIDBUSINESS: 'bceidbusiness',
  BCSC: 'bcsc'
} as const;

export type IdentityProviderKind = ValueOf<typeof IdentityProviderKind>;

export const StorageKey = {
  AUTH: 'entrypoint',
  CHUNK_RELOAD: 'chunkReload',
  CONFIG: 'config'
} as const;

export type StorageKey = ValueOf<typeof StorageKey>;

export const ToastTimeout = {
  ERROR: 5000,
  INFO: 3000,
  STICKY: 0,
  SUCCESS: 3000,
  WARNING: 5000
} as const;

export type ToastTimeout = ValueOf<typeof ToastTimeout>;

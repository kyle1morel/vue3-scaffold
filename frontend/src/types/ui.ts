import type { Nullable } from '@/types';
import type { IdentityProviderKind } from '@/utils/enums/application';

export interface Config {
  // Additional data passed from backend
  features: Record<string, boolean>;
  gitRev: string;
  idpList: IdentityProvider[];

  // Frontend config object
  apiPath?: string;
  notificationBanner?: string;
  oidc: {
    authority?: string;
    clientId?: string;
  };
}

// Entries of the IdP config list served by /config, not rows of the identity_provider table
export interface IdentityProvider {
  idp: string;
  kind: IdentityProviderKind;
  username: string;
}

export interface InputEvent extends Event {
  target: HTMLInputElement;
}

export interface DateTimeStrings {
  date: Nullable<string>;
  time: Nullable<string>;
}

export interface Pagination {
  rows?: number;
  order?: number;
  field?: string;
  page?: number;
}

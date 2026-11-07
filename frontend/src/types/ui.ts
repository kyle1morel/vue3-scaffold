import type { IdentityProviderKind } from '@/utils/enums';

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

import { Log, UserManager, WebStorageStateStore } from 'oidc-client-ts';

import { getCachedConfig } from './configService';

import type { User, UserManagerSettings } from 'oidc-client-ts';

const isDebugMode: boolean = import.meta.env.MODE.toUpperCase() === 'DEBUG';

/**
 * Wraps the oidc-client-ts UserManager so every caller shares one OIDC session.
 */
export default class AuthService {
  private static _instance: AuthService;
  private static _userManager: UserManager;

  /**
   * Returns the shared instance, creating the UserManager on first use.
   */
  constructor() {
    if (!AuthService._instance) {
      AuthService._instance = this;
      AuthService._userManager = new UserManager(this.getOidcSettings());

      Log.setLogger(console);
      Log.setLevel(isDebugMode ? Log.DEBUG : Log.INFO);
    }

    return AuthService._instance;
  }

  /**
   * @returns Yields OIDC settings.
   * @throws If OIDC configuration is missing or incomplete
   */
  public getOidcSettings(): UserManagerSettings {
    const config = getCachedConfig();

    if (!config?.oidc?.authority || !config?.oidc?.clientId) {
      throw new Error('OIDC is misconfigured');
    }

    return {
      automaticSilentRenew: true,
      authority: config.oidc.authority,
      client_id: config.oidc.clientId,
      redirect_uri: `${window.location.protocol}//${window.location.host}/oidc/callback`,
      loadUserInfo: true,
      post_logout_redirect_uri: `${window.location.protocol}//${window.location.host}/oidc/logout`,
      userStore: new WebStorageStateStore({ store: window.localStorage })
    };
  }

  /**
   * @returns An instance of AuthService.
   */
  public static init(): AuthService {
    return new AuthService();
  }

  /**
   * @returns Returns a user object if logged in, null otherwise.
   */
  public async getUser(): Promise<User | null> {
    return AuthService._userManager.getUser();
  }

  /**
   * @returns The underlying oidc-client-ts UserManager.
   */
  public getUserManager(): UserManager {
    return AuthService._userManager;
  }

  /**
   * Redirects to the OIDC login, hinting which identity provider to use.
   * @param idp - The identity provider.
   * @returns Resolves once the redirect starts.
   */
  public async login(idp: string): Promise<void> {
    return AuthService._userManager.signinRedirect({
      redirectMethod: 'assign',
      extraQueryParams: { kc_idp_hint: idp }
    });
  }

  /**
   * @returns Resolves upon completion.
   */
  public async loginCallback(): Promise<void> {
    // Register and store user to local storage
    await AuthService._userManager.signinRedirectCallback();
    // signinRedirectCallback appears to do this already?
    // await AuthService._userManager.storeUser(user);
  }

  /**
   * Clears the stored user without redirecting to the OIDC logout.
   * @returns Resolves once the user is removed.
   */
  public async removeUser(): Promise<void> {
    return AuthService._userManager.removeUser();
  }

  /**
   * Redirects to the OIDC logout.
   * @returns Resolves once the redirect starts.
   */
  public async logout(): Promise<void> {
    return AuthService._userManager.signoutRedirect({ redirectMethod: 'replace' });
  }
}

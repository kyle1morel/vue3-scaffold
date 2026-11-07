import { appAxios } from '@/services/interceptors';
import { getCachedConfig } from '@/services/configService';

import type { Config } from '@/types';
import type { InternalAxiosRequestConfig } from 'axios';

// Mocks

const getUserMock = vi.fn();

vi.mock('@/services/authService', () => ({
  default: class {
    getUser = getUserMock;
  }
}));

vi.mock('@/services/configService', () => ({
  getCachedConfig: vi.fn()
}));

// Fixtures

const baseConfig: Config = {
  features: {},
  gitRev: 'abc123',
  idpList: [],
  apiPath: 'api/v1',
  oidc: {}
} as Config;

function requestConfig(): InternalAxiosRequestConfig {
  return { headers: {} } as InternalAxiosRequestConfig;
}

// Mount

beforeEach(() => {
  vi.clearAllMocks();
});

// Tests

describe('interceptors', () => {
  describe('config guard', () => {
    it('appAxios throws when no cached config is available', () => {
      vi.mocked(getCachedConfig).mockReturnValue(null);

      expect(() => appAxios()).toThrow('Unable to obtain config');
    });
  });

  describe('appAxios', () => {
    beforeEach(() => {
      vi.mocked(getCachedConfig).mockReturnValue(baseConfig);
    });

    it('builds an instance from the app api path and a 10s timeout', () => {
      const instance = appAxios();

      expect(instance.defaults.baseURL).toBe(`${window.location.origin}/api/v1`);
      expect(instance.defaults.timeout).toBe(10000);
    });

    it('lets caller options override the defaults', () => {
      const instance = appAxios({ timeout: 5000 });

      expect(instance.defaults.timeout).toBe(5000);
    });

    it('attaches a bearer token when a non-expired user is present', async () => {
      getUserMock.mockResolvedValue({ access_token: 'tok-123', expired: false });

      const instance = appAxios();
      const handler = instance.interceptors.request as unknown as {
        handlers: { fulfilled: (cfg: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig> }[];
      };

      const result = await handler.handlers[0]!.fulfilled(requestConfig());

      expect(result.headers.Authorization).toBe('Bearer tok-123');
    });

    it('does not attach a token when the user is expired', async () => {
      getUserMock.mockResolvedValue({ access_token: 'tok-123', expired: true });

      const instance = appAxios();
      const handler = instance.interceptors.request as unknown as {
        handlers: { fulfilled: (cfg: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig> }[];
      };

      const result = await handler.handlers[0]!.fulfilled(requestConfig());

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('does not attach a token when there is no user', async () => {
      getUserMock.mockResolvedValue(null);

      const instance = appAxios();
      const handler = instance.interceptors.request as unknown as {
        handlers: { fulfilled: (cfg: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig> }[];
      };

      const result = await handler.handlers[0]!.fulfilled(requestConfig());

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('rejects with the original error on request failure', async () => {
      const instance = appAxios();
      const handler = instance.interceptors.request as unknown as {
        handlers: { rejected: (error: Error) => Promise<never> }[];
      };
      const error = new Error('boom');

      await expect(handler.handlers[0]!.rejected(error)).rejects.toBe(error);
    });
  });
});

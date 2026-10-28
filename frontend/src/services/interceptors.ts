import axios from 'axios';

import AuthService from './authService';
import { getCachedConfig } from './configService';

import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

/**
 * @param options - Axios request config options.
 * @returns An axios instance.
 */
export function appAxios(options: AxiosRequestConfig = {}): AxiosInstance {
  const cfg = getCachedConfig();
  if (!cfg) throw new Error('Unable to obtain config');

  const instance = axios.create({
    baseURL: window.location.origin + `/${cfg.apiPath}`,
    timeout: 10000,
    ...options
  });

  instance.interceptors.request.use(
    async (cfg: InternalAxiosRequestConfig) => {
      const authService = new AuthService();
      const user = await authService.getUser();
      if (!!user && !user.expired) {
        cfg.headers.Authorization = `Bearer ${user.access_token}`;
      }
      return Promise.resolve(cfg);
    },
    (error: Error) => {
      return Promise.reject(error);
    }
  );

  return instance;
}

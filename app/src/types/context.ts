import { AsyncLocalStorage } from 'node:async_hooks';

import type jwt from 'jsonwebtoken';
import type { AuthType } from '#src/utils/enums/application';

export const requestContext = new AsyncLocalStorage<{ principal: string }>();

export interface LocalContext {
  currentContext: CurrentContext;
}

export interface CurrentContext {
  authType: AuthType;
  bearerToken?: string;
  tokenPayload?: jwt.JwtPayload;
  userId?: string;
}

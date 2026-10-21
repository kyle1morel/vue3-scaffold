import { parse } from 'node:path';
import pino from 'pino';
import { pinoHttp } from 'pino-http';

import type { Request, RequestHandler, Response } from 'express';
import type { Logger, TransportSingleOptions } from 'pino';
import type { LocalContext } from '#types';

/** Define Pino logging meta-structure */
declare module 'pino' {
  interface LogFnFields {
    module?: never; // Disallow overwriting the module field
  }
}

const DEFAULT_LOG_LEVEL = 'info';
const USER_AGENTS = ['kube-probe'];

const prettyTransport: TransportSingleOptions = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    ignore: 'pid,hostname',
    singleLine: process.env.SERVER_LOGSINGLELINE === 'true'
  }
};

export const baseLogger: Logger = pino({
  formatters: { level: (label) => ({ level: label }) },
  level: process.env.NODE_ENV === 'test' ? 'silent' : (process.env.SERVER_LOGLEVEL ?? DEFAULT_LOG_LEVEL),
  redact: ['*.authorization', 'req.headers.authorization', 'password', 'token'],
  transport: process.env.NODE_ENV === 'production' ? undefined : prettyTransport
});

/**
 * Main Pino Logger
 * @param moduleName - The module name to register log statements under
 * @returns A child Pino Logger
 */
export function getLogger(moduleName: string) {
  return baseLogger.child({ module: parse(moduleName).name });
}

const log = getLogger(import.meta.filename);

/**
 * HTTP Middleware
 */
export const httpLogger: RequestHandler = pinoHttp({
  logger: getLogger('http'),
  customLogLevel: (req, res, err) => {
    if (USER_AGENTS.some((el) => req.get('user-agent')?.includes(el))) return 'debug';
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  serializers: {
    req: (req: Request) => ({
      method: req.method,
      params: Object.keys(req.params).length ? req.params : undefined,
      query: Object.keys(req.query).length ? req.query : undefined,
      url: req.url,
      userAgent: req.headers['user-agent']
    }),
    res: (res: Response) => ({ statusCode: res.statusCode }),
    err: (err: Error) => ({
      type: err.constructor.name,
      message: err.message,
      stack: process.env.SERVER_LOGLEVEL === 'trace' ? err.stack : undefined
    })
  },
  // originalUrl, as routers have trimmed req.url to their mount point by the time the response finishes.
  customErrorMessage: (req, res, err) => `${req.method} ${req.originalUrl} ${res.statusCode} - ${err.message}`,
  customProps: (req, res: Response<unknown, Partial<LocalContext>>) => {
    const claims = res.locals?.currentContext?.tokenPayload;
    return {
      claims: claims?.azp || claims?.sub ? { azp: claims.azp, sub: claims.sub } : undefined,
      httpVersion: req.httpVersion,
      ip: req.ip
    };
  },
  customSuccessMessage: (req, res, responseTime) =>
    `${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms`
});

log.info(`Logger initialized at '${baseLogger.level}' level`);

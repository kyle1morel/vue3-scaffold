import type { Router, RequestHandler } from 'express';
import type { z, ZodObject, ZodType } from 'zod';

import { validate } from '#src/middleware/validation';
import { registry } from '#src/schemas/openapi';

type Method = 'get' | 'post' | 'patch' | 'put' | 'delete';

interface OpenApiResponseEntry {
  description: string;
  contentType?: string; // default 'application/json'
  schema?: ZodType;
}
export type OpenApiResponses = Record<number, OpenApiResponseEntry>;

// Shape-compatible with a schemas/request/*.ts file's `schema.<operation>` object.
export interface RouteSchema {
  params?: ZodObject;
  query?: ZodObject;
  body?: ZodType;
  bodyContentType?: string;
}

// Binds the handler's Express generics to the schema actually passed in, so a mismatched Request<> fails to compile.
type ParamsOf<S extends RouteSchema | undefined> = S extends { params: ZodObject } ? z.infer<S['params']> : never;
type QueryOf<S extends RouteSchema | undefined> = S extends { query: ZodObject } ? z.infer<S['query']> : never;
type BodyOf<S extends RouteSchema | undefined> = S extends { body: ZodType } ? z.infer<S['body']> : never;

const toOpenApiPath = (path: string) => path.replace(/:([^/]+)/g, '{$1}');

const buildResponses = (responses: OpenApiResponses) =>
  Object.fromEntries(
    Object.entries(responses).map(([status, { description, schema, contentType = 'application/json' }]) => [
      status,
      { description, ...(schema && { content: { [contentType]: { schema } } }) }
    ])
  );

/**
 * Registers a route on the router and documents it in the OpenAPI registry from the same config.
 * When a schema is given, request validation runs after the middleware and before the handler.
 * @typeParam S - The request schema; types the handler's params, query and body.
 * @typeParam ResBody - The handler's response body type.
 * @typeParam Locals - The handler's `res.locals` type.
 * @param basePath - The router's mount path, prefixed to the documented path.
 * @param router - The Express router to register the route on.
 * @param config - The route's method, path, OpenAPI metadata, schema, middleware and handler.
 */
export function openapiRoute<
  S extends RouteSchema | undefined,
  ResBody,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- matches express's own Response Locals bound
  Locals extends Record<string, any> = Record<string, never>
>(
  basePath: string,
  router: Router,
  config: {
    method: Method;
    path: string;
    // Unique across the API; names the operation in generated client types
    operationId: string;
    summary: string;
    tags: string[];
    schema?: S;
    responses: OpenApiResponses;
    // Untyped RequestHandler[]: unifying with the narrowly-typed handler below collapses inference for both.
    middleware?: RequestHandler[];
    handler: RequestHandler<ParamsOf<S>, ResBody, BodyOf<S>, QueryOf<S>, Locals>;
  }
): void {
  const { method, path, operationId, summary, tags, schema, responses, middleware = [], handler } = config;

  registry.registerPath({
    method,
    path: `${basePath}${path === '/' ? '' : toOpenApiPath(path)}`,
    operationId,
    summary,
    tags,
    request: {
      ...(schema?.params && { params: schema.params }),
      ...(schema?.query && { query: schema.query }),
      ...(schema?.body && {
        body: { content: { [schema.bodyContentType ?? 'application/json']: { schema: schema.body } } }
      })
    },
    responses: buildResponses(responses)
  });

  const chain = schema
    ? [
        ...middleware,
        validate({
          ...(schema.params && { params: schema.params }),
          ...(schema.query && { query: schema.query }),
          ...(schema.body && { body: schema.body })
        }),
        handler
      ]
    : [...middleware, handler];
  router[method](path, ...(chain as RequestHandler[]));
}

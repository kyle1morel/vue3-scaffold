import type { components, operations } from './generated';

/**
 * JSON request body of an API operation, by its operationId in the types generated from the backend OpenAPI spec.
 * A union of ids gives the union of their bodies.
 * @example RequestBody<'searchUsers'>
 */
export type RequestBody<Id extends keyof operations> = Id extends unknown
  ? operations[Id] extends { requestBody?: { content: { 'application/json': infer B } } }
    ? B
    : never
  : never;

/**
 * Query string parameters of an API operation, by its operationId in the generated OpenAPI types.
 * A union of ids gives the union of their parameters.
 * @example QueryParams<'searchUsers'>
 */
export type QueryParams<Id extends keyof operations> = Id extends unknown
  ? operations[Id] extends { parameters: { query?: infer Q } }
    ? NonNullable<Q>
    : never
  : never;

/**
 * Named schema from the generated OpenAPI types, such as a response resource.
 * @example Schema<'User'>
 */
export type Schema<Name extends keyof components['schemas']> = components['schemas'][Name];

/**
 * JSON body of an API operation's success (200 or 201) response, by its operationId in the generated OpenAPI types.
 * A union of ids gives the union of their bodies; a declared 204 adds undefined, so an operation that only returns 204
 * gives undefined.
 * @example ResponseBody<'searchUsers'>
 */
export type ResponseBody<Id extends keyof operations> = Id extends unknown
  ? operations[Id]['responses'] extends infer R
    ? | {
          [S in keyof R & (200 | 201)]: R[S] extends { content: { 'application/json': infer B } } ? B : never;
        }[keyof R & (200 | 201)]
      | (204 extends keyof R ? undefined : never)
    : never
  : never;

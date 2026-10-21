/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * @see app/src/docs/generateTypes.ts
 *
 * To update this file after changing a route or its zod schemas, run:
 * `npm run docs:types`
 */

// openapi-typescript emits `{ [name: string]: unknown }` for response headers
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

export interface paths {
  '/user/search': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Search users */
    post: operations['searchUsers'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    User: {
      userId: string;
      idp: string | null;
      sub: string;
      email: string | null;
      firstName: string | null;
      fullName: string | null;
      lastName: string | null;
      bceidBusinessName: string | null;
      active: boolean;
      createdBy: string | null;
      /** Format: date-time */
      createdAt: string | null;
      updatedBy: string | null;
      /** Format: date-time */
      updatedAt: string | null;
      deletedBy: string | null;
      /** Format: date-time */
      deletedAt: string | null;
    };
    Problem: {
      type: string;
      title: string;
      status: number;
      detail?: string;
      instance?: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  searchUsers: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: {
      content: {
        'application/json': {
          userId?: string[];
          idp?: string[];
          sub?: string;
          email?: string;
          firstName?: string;
          fullName?: string;
          lastName?: string;
          active?: boolean;
        };
      };
    };
    responses: {
      /** @description A list of users matching the search criteria */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['User'][];
        };
      };
      /** @description Unauthorized */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/problem+json': components['schemas']['Problem'];
        };
      };
      /** @description Forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/problem+json': components['schemas']['Problem'];
        };
      };
      /** @description Validation error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/problem+json': components['schemas']['Problem'];
        };
      };
    };
  };
}

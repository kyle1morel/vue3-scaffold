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
  '/submission': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** List submissions, newest first */
    get: operations['listSubmissions'];
    put?: never;
    /** Save a demo form submission */
    post: operations['createSubmission'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/submission/{submissionId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Get a submission */
    get: operations['getSubmission'];
    put?: never;
    post?: never;
    /** Soft delete a submission */
    delete: operations['deleteSubmission'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/user/me': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Get the current user */
    get: operations['getCurrentUser'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
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
    SubmissionPage: {
      items: components['schemas']['Submission'][];
      total: number;
    };
    Submission: {
      id: string;
      firstName: string;
      email: string;
      phone: string | null;
      /** @enum {string} */
      province: 'AB' | 'BC' | 'SK';
      /** @enum {string} */
      contactMethod: 'email' | 'phone';
      /** Format: date-time */
      startDate: string | null;
      quantity: number | null;
      city: string | null;
      category: string | null;
      comments: string | null;
      notes: string | null;
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
    User: {
      id: string;
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
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  listSubmissions: {
    parameters: {
      query?: {
        page?: number;
        pageSize?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description A page of submissions and the total number of submissions */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['SubmissionPage'];
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
  createSubmission: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: {
      content: {
        'application/json': {
          firstName: string;
          /** Format: email */
          email: string;
          phone?: string | null;
          /** @enum {string} */
          province: 'AB' | 'BC' | 'SK';
          /** @enum {string} */
          contactMethod: 'email' | 'phone';
          /** Format: date */
          startDate?: string | null;
          quantity?: number | null;
          city?: string | null;
          category?: string | null;
          comments?: string | null;
          notes?: string | null;
        };
      };
    };
    responses: {
      /** @description The saved submission */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Submission'];
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
  getSubmission: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        submissionId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The submission */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Submission'];
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
      /** @description Not found */
      404: {
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
  deleteSubmission: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        submissionId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The submission was deleted */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
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
      /** @description Not found */
      404: {
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
  getCurrentUser: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The user making the request */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['User'];
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
    };
  };
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
          id?: string[];
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

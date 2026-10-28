import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

import { registry } from '#src/schemas/openapi';

import type { OpenAPIObject } from 'openapi3-ts/oas30';

const TAGS = [
  { name: 'Submission', description: 'Operations for demo form submissions' },
  { name: 'User', description: 'Operations for managing users' }
];

/**
 * Generates a ReDocs HTML string for the documentation page of the Vue3 Scaffold API.
 * @param version - The version of the API documentation to display. Defaults to 'v1'.
 * @returns The HTML string for the documentation page.
 */
export function getDocHTML(version = 'v1'): string {
  return `<!DOCTYPE html>
  <html>
    <head>
      <title>Vue3 Scaffold API - Documentation ${version}</title>
      <!-- Needed for adaptive design -->
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">

      <!-- ReDoc doesn't change outer page styles -->
      <style>
        body { margin: 0; padding: 0; }
      </style>
    </head>
    <body>
      <redoc spec-url='/api/${version}/docs/api-spec.yaml' />
      <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
    </body>
  </html>`;
}

let cachedSpec: OpenAPIObject | undefined;

/**
 * Gets the OpenAPI specification, generated from the zod schemas registered via openapiRoute().
 * Memoized - registry.definitions is fixed once every route file has been imported at startup,
 * so regenerating the document on every request would be wasted work.
 * @returns The OpenAPI spec.
 */
export function getSpec(): OpenAPIObject {
  if (!cachedSpec) {
    cachedSpec = new OpenApiGeneratorV3(registry.definitions).generateDocument({
      openapi: '3.0.4',
      info: {
        version: '1.0.0',
        title: 'Vue3 Scaffold',
        description: 'A Vue 3 and Express application scaffold.',
        license: { name: 'Apache 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0.html' }
      },
      servers: [{ url: '/api/v1', description: 'This server' }],
      security: [{ BearerAuth: [], OpenID: [] }],
      tags: TAGS
    });
  }
  return cachedSpec;
}

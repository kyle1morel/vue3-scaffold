import '#src/routes/index';
import { getSpec } from '#src/docs/docs';
import { schema as userSchema } from '#src/schemas/request/user';

import type { OperationObject } from 'openapi3-ts/oas30';

vi.mock('jwks-rsa', () => ({
  default: vi.fn().mockReturnValue({
    getSigningKey: vi.fn()
  })
}));

// Importing '#src/routes/index' above pulls in every v1 route file, so every openapiRoute() call
// has run and registered its schemas before getSpec() builds the document below - this is what
// actually exercises OpenApiGeneratorV3 against the full registry, unlike routes/v1/docs.test.ts
// which mocks getSpec() entirely.
describe('getSpec', () => {
  it('builds the OpenAPI document from the full route registry without throwing', () => {
    expect(() => getSpec()).not.toThrow();
  });

  it('registers paths and component schemas from every route file', () => {
    const spec = getSpec();

    expect(Object.keys(spec.paths ?? {}).length).toBeGreaterThan(0);
    expect(Object.keys(spec.components?.schemas ?? {})).toEqual(expect.arrayContaining(['User', 'Problem']));
  });

  // Generated frontend types key operations by id, so a collision would silently merge two endpoints
  it('gives every operation a unique operationId', () => {
    const operationIds = Object.values(getSpec().paths ?? {}).flatMap((pathItem) =>
      Object.values(pathItem as Record<string, OperationObject>).map((operation) => operation.operationId)
    );

    expect(operationIds.every(Boolean)).toBe(true);
    expect(new Set(operationIds).size).toBe(operationIds.length);
  });
});

describe('.strict() schemas reject unknown keys', () => {
  it('rejects an extra field on a strict request schema', () => {
    const valid = { sub: 'user' };

    expect(userSchema.searchUsers.body.safeParse(valid).success).toBe(true);
    expect(userSchema.searchUsers.body.safeParse({ ...valid, extraField: 'nope' }).success).toBe(false);
  });
});

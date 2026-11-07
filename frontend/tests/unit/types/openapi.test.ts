import type { ResponseBody, Schema } from '@/types';

// Mocks

// Fixtures

// Mount

// Tests

// Type-level assertions, enforced by the typecheck that runs before tests
describe('ResponseBody', () => {
  it('gives the 200 response body', () => {
    expectTypeOf<ResponseBody<'searchUsers'>>().toEqualTypeOf<Schema<'User'>[]>();
  });
});

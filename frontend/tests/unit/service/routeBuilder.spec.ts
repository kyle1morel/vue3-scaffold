import { createRouteBuilder } from '@/services/routeBuilder';

describe('createRouteBuilder', () => {
  it('joins segments correctly', () => {
    const route = createRouteBuilder('base');

    const result = route('a', 'b', 'c');

    expect(result).toBe('base/a/b/c');
  });

  it('encodes segments', () => {
    const route = createRouteBuilder('base');

    const result = route('a b', 'c/d');

    expect(result).toBe('base/a%20b/c%2Fd');
  });

  it('filters empty string segments', () => {
    const route = createRouteBuilder('base');

    const result = route('a', '', 'b');

    expect(result).toBe('base/a/b');
  });

  it('filters undefined resource and segments safely', () => {
    const route = createRouteBuilder(undefined);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = route('a', undefined as any, 'b');

    expect(result).toBe('a/b');
  });

  it('preserves numeric segments', () => {
    const route = createRouteBuilder('base');

    const result = route(0, 123);

    expect(result).toBe('base/0/123');
  });
});

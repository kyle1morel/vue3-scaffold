/**
 * Creates a route builder for constructing URL paths for a given resource.
 *
 * This utility helps standardize route generation by:
 * - Prefixing all routes with a base resource path (if provided)
 * - Safely encoding all dynamic path segments
 *
 * @param resource - The base route segment (e.g. "user", "projects").
 * @returns A function that builds URL paths from additional segments.
 * @example
 * ```ts
 * const userRoute = createRouteBuilder('user');
 * userRoute('123', 'profile'); // "user/123/profile"
 * ```
 */
export function createRouteBuilder(resource?: string) {
  return (...segments: (string | number | null | undefined)[]) =>
    [resource]
      .filter((v): v is string => v !== undefined && v !== null && v !== '')
      .concat(
        segments
          .filter((v): v is string | number => v !== undefined && v !== null && v !== '')
          .map((s) => encodeURIComponent(String(s)))
      )
      .join('/');
}

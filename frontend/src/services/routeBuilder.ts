/**
 * Creates a route builder for constructing URL paths for a given resource.
 *
 * This utility helps standardize route generation by:
 * - Prefixing all routes with a base resource path (if provided)
 * - Safely encoding all dynamic path segments
 *
 * Pass each path segment as its own argument; a single 'a/b' string would
 * have its slash encoded. Path params are taken as route arguments and
 * passed through as segments.
 * @param resource - The base route segment (e.g. "user", "projects").
 * @returns A function that builds URL paths from additional segments.
 * @example
 * ```ts
 * const userRoute = createRouteBuilder('user');
 *
 * const userRoutes = {
 *   search: () => userRoute('search'), // "user/search"
 *   byId: (id: string) => userRoute(id), // "user/{id}"
 *   roles: (id: string) => userRoute(id, 'roles'), // "user/{id}/roles"
 *   role: (id: string, roleId: string) => userRoute(id, 'roles', roleId) // "user/{id}/roles/{roleId}"
 * } as const;
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

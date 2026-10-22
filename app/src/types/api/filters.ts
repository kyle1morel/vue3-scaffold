// Internal search/filter parameter shapes used by service and repository layers. These are not
// request types - a validated request is normalized into one of these at the controller boundary
// (see e.g. searchUsersController), since a resource's several search-style endpoints
// (search vs. match vs. list) often validate different field sets but share one filter shape.

export interface UserSearchParameters {
  id?: string[];
  idp?: string[];
  sub?: string;
  email?: string;
  firstName?: string;
  fullName?: string;
  lastName?: string;
  active?: boolean;
}

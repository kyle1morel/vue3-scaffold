/**
 * Use these directly or destructure them and make any necessary data changes locally in a test.
 * DO NOT change the existing objects in this file unless a schema change is required.
 * If you need something wildly different than the existing ones then add new ones.
 */
import { AuthType, IdentityProviderKind } from '#src/utils/enums/application';

import type { CurrentContext, User } from '#types';

export const TEST_IDIR_USER_1: User = {
  bceidBusinessName: null,
  userId: '5e3f0c19-8664-4a43-ac9e-210da336e923',
  idp: IdentityProviderKind.AZUREIDIR,
  sub: 'cd90c6bf44074872a7116f4dd4f3a45b@azureidir',
  email: 'John.Doe@example.com',
  firstName: 'John',
  fullName: 'Doe, John',
  lastName: 'Doe',
  active: true,
  createdAt: null,
  createdBy: null,
  updatedAt: null,
  updatedBy: null,
  deletedBy: null,
  deletedAt: null
};

export const TEST_CURRENT_CONTEXT: CurrentContext = {
  authType: AuthType.BEARER,
  userId: '811896a0-e1fe-4c38-8cd3-86245c79e8f8'
};

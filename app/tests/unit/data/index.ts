/**
 * Use these directly or destructure them and make any necessary data changes locally in a test.
 * DO NOT change the existing objects in this file unless a schema change is required.
 * If you need something wildly different than the existing ones then add new ones.
 */
import { AuthType, IdentityProviderKind } from '#src/utils/enums/application';

import type { CurrentContext, Submission, User } from '#types';

export const TEST_IDIR_USER_1: User = {
  bceidBusinessName: null,
  id: '5e3f0c19-8664-4a43-ac9e-210da336e923',
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

export const TEST_SUBMISSION_1: Submission = {
  id: '0b6a1f3e-6d2c-4f0e-9a51-3c8e2d7b4a10',
  firstName: 'Jane',
  email: 'jane.doe@example.com',
  phone: '(250) 555-1234',
  province: 'BC',
  contactMethod: 'email',
  startDate: new Date('2026-01-15'),
  quantity: 3,
  city: 'Victoria',
  category: 'question',
  comments: null,
  notes: '<p>Some notes</p>',
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

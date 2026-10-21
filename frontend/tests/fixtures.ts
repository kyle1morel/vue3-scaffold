// Shared fixtures; kept free of imports so specs that mock modules can still use them

// Audit columns every API resource carries
export const testAuditFields = {
  createdBy: 'testCreatedBy',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedBy: 'testUpdatedBy',
  updatedAt: '2024-01-01T00:00:00.000Z',
  deletedBy: null,
  deletedAt: null
};

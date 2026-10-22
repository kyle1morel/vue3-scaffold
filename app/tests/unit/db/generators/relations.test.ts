import { buildRelationsMap } from '#src/db/generators/relations';

describe('buildRelationsMap', () => {
  it('collects relation fields per model, keyed by field name', () => {
    const models = [
      {
        name: 'identity_provider',
        fields: [
          { name: 'idp', kind: 'scalar', type: 'String', isList: false },
          { name: 'user', kind: 'object', type: 'user', isList: true, relationName: 'identity_providerTouser' }
        ]
      }
    ];

    expect(buildRelationsMap(models)).toEqual({
      identity_provider: {
        user: { targetModel: 'user', isList: true }
      }
    });
  });

  it('excludes scalar fields', () => {
    const models = [
      {
        name: 'user',
        fields: [
          { name: 'id', kind: 'scalar', type: 'String', isList: false },
          { name: 'sub', kind: 'scalar', type: 'String', isList: false }
        ]
      }
    ];

    expect(buildRelationsMap(models)).toEqual({});
  });

  it('excludes object-kind fields with no relationName', () => {
    const models = [
      {
        name: 'user',
        fields: [{ name: 'metadata', kind: 'object', type: 'Json', isList: false }]
      }
    ];

    expect(buildRelationsMap(models)).toEqual({});
  });

  it('omits models with zero relations from the output entirely', () => {
    const models = [{ name: 'lookup', fields: [{ name: 'id', kind: 'scalar', type: 'Int', isList: false }] }];

    const result = buildRelationsMap(models);

    expect(result).toEqual({});
    expect(Object.prototype.hasOwnProperty.call(result, 'lookup')).toBe(false);
  });

  it('handles multiple models independently', () => {
    const models = [
      {
        name: 'user',
        fields: [
          {
            name: 'identityProvider',
            kind: 'object',
            type: 'identity_provider',
            isList: false,
            relationName: 'identity_providerTouser'
          }
        ]
      },
      {
        name: 'identity_provider',
        fields: [{ name: 'user', kind: 'object', type: 'user', isList: true, relationName: 'identity_providerTouser' }]
      }
    ];

    expect(buildRelationsMap(models)).toEqual({
      user: { identityProvider: { targetModel: 'identity_provider', isList: false } },
      identity_provider: { user: { targetModel: 'user', isList: true } }
    });
  });
});

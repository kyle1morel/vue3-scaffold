import { baseLogger, getLogger, httpLogger } from '#src/utils/log';

describe('baseLogger', () => {
  it('is silenced under test', () => {
    expect(baseLogger.level).toBe('silent');
  });
});

describe('getLogger', () => {
  it('returns a child logger bound to the module name', () => {
    const result = getLogger('/some/path/test.ts');

    expect(result.bindings()).toEqual({ module: 'test' });
    expect(result.level).toBe(baseLogger.level);
  });
});

describe('httpLogger', () => {
  it('is an express middleware function', () => {
    expect(typeof httpLogger).toBe('function');
    expect(httpLogger.length).toBe(3);
  });
});

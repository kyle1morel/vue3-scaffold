import { getDatabaseUrl } from '#src/db/url';

describe('getDatabaseUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('builds the connection string from SERVER_DB_* and URI encodes the credentials', () => {
    vi.stubEnv('SERVER_DB_HOST', 'db.local');
    vi.stubEnv('SERVER_DB_PORT', '5433');
    vi.stubEnv('SERVER_DB_DATABASE', 'scaffold');
    vi.stubEnv('SERVER_DB_USERNAME', 'app@user');
    vi.stubEnv('SERVER_DB_PASSWORD', 'p@ss:w/o?r#d%');

    expect(getDatabaseUrl()).toBe('postgresql://app%40user:p%40ss%3Aw%2Fo%3Fr%23d%25@db.local:5433/scaffold');
  });
});

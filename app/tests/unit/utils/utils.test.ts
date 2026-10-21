import { existsSync, readFileSync, statSync } from 'node:fs';

import { AuthType, IdentityProviderKind } from '#src/utils/enums/application';
import * as utils from '#src/utils/utils';

import type { JwtPayload } from 'jsonwebtoken';
import type { Mock } from 'vitest';

vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  statSync: vi.fn()
}));

vi.mock('#src/utils/log', () => ({
  getLogger: () => ({ warn: vi.fn(), info: vi.fn(), error: vi.fn() })
}));

const TOKEN_PAYLOAD: JwtPayload = {
  sub: '12345678-90ab-cdef-1234-567890abcdef',
  identity_provider: 'azureidir',
  idir_username: 'alice.smith',
  email: 'alice.smith@example.com',
  given_name: 'Alice',
  family_name: 'Smith',
  exp: Math.floor(Date.now() / 1000) + 3600,
  iat: Math.floor(Date.now() / 1000)
};

const CURRENT_CONTEXT = {
  authType: AuthType.BEARER,
  bearerToken: 'some-bearer-token',
  tokenPayload: TOKEN_PAYLOAD,
  userId: '12345678-90ab-cdef-1234-567890abcdef'
};

const IDP_LIST = [
  {
    idp: IdentityProviderKind.AZUREIDIR,
    kind: 'azureidir',
    username: 'idir_username'
  },
  {
    idp: IdentityProviderKind.BCEID,
    kind: 'bceidbasic',
    username: 'bceid_username'
  },
  {
    idp: IdentityProviderKind.BCEIDBUSINESS,
    kind: 'bceidbusiness',
    username: 'bceid_username'
  }
];

describe('utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (existsSync as Mock).mockReset();
    (readFileSync as Mock).mockReset();
    (statSync as Mock).mockReset();
  });

  describe('getGitRevision', () => {
    const mockStat = (isFile: boolean) => ({
      isFile: () => isFile
    });

    it('returns the GIT_COMMIT environment variable if set', () => {
      process.env.GIT_COMMIT = 'envhash123';
      expect(utils.getGitRevision()).toBe('envhash123');
      delete process.env.GIT_COMMIT;
    });

    it('returns the HEAD hash if HEAD is detached', () => {
      (existsSync as Mock).mockImplementation((path: string) => {
        // .git and HEAD exist
        return path.endsWith('.git') || path.endsWith('HEAD');
      });
      (statSync as Mock).mockReturnValue(mockStat(false)); // .git is a directory
      (readFileSync as Mock).mockImplementation((path: string) => {
        if (path.endsWith('HEAD')) return 'abcdef1234567890\n';
        return '';
      });

      expect(utils.getGitRevision()).toBe('abcdef1234567890');
    });

    it('returns the commit hash from ref file if HEAD points to a ref', () => {
      (existsSync as Mock).mockImplementation((path: string) => {
        // .git, HEAD, and ref exist
        return (
          path.endsWith('.git') ||
          path.endsWith('HEAD') ||
          path.endsWith('refs/heads/main') ||
          path.endsWith(String.raw`refs\heads\main`)
        );
      });
      (statSync as Mock).mockReturnValue(mockStat(false)); // .git is a directory
      (readFileSync as Mock).mockImplementation((path: string) => {
        if (path.endsWith('HEAD')) return 'ref: refs/heads/main\n';
        if (path.endsWith('refs/heads/main') || path.endsWith(String.raw`refs\heads\main`)) return '1234567890abcdef\n';
        return '';
      });

      expect(utils.getGitRevision()).toBe('1234567890abcdef');
    });

    it('returns the commit hash from packed-refs if ref file does not exist', () => {
      (existsSync as Mock).mockImplementation((path: string) => {
        // .git, HEAD, packed-refs exist, but not the ref file
        return path.endsWith('.git') || path.endsWith('HEAD') || path.endsWith('packed-refs');
      });
      (statSync as Mock).mockReturnValue(mockStat(false)); // .git is a directory
      (readFileSync as Mock).mockImplementation((path: string) => {
        if (path.endsWith('HEAD')) return 'ref: refs/heads/main\n';
        if (path.endsWith('packed-refs')) return 'fedcba9876543210 refs/heads/main\n';
        return '';
      });

      expect(utils.getGitRevision()).toBe('fedcba9876543210');
    });

    it('returns undefined if ref file does not exist', () => {
      (existsSync as Mock).mockImplementation((path: string) => {
        // .git, HEAD, packed-refs exist, but not the ref file
        return path.endsWith('.git') || path.endsWith('HEAD') || path.endsWith('packed-refs');
      });
      (statSync as Mock).mockReturnValue(mockStat(false)); // .git is a directory
      (readFileSync as Mock).mockImplementation((path: string) => {
        if (path.endsWith('HEAD')) return 'ref: refs/heads/main\n';
        return '';
      });

      expect(utils.getGitRevision()).toBeUndefined();
    });

    it('returns undefined if .git does not exist', () => {
      (existsSync as Mock).mockReturnValue(false);

      expect(utils.getGitRevision()).toBeUndefined();
    });

    it('returns undefined and logs warning if an error is thrown', () => {
      (existsSync as Mock).mockImplementation(() => {
        throw new Error('fs error');
      });

      expect(utils.getGitRevision()).toBeUndefined();
    });

    it('resolves .git as a file (worktree/submodule) and reads gitdir', () => {
      (existsSync as Mock).mockImplementation((path: string) => {
        // .git file, HEAD, and ref exist
        return (
          path.endsWith('.git') ||
          path.endsWith('HEAD') ||
          path.endsWith('refs/heads/feature') ||
          path.endsWith(String.raw`refs\heads\feature`)
        );
      });
      (statSync as Mock).mockImplementation((path: string) => {
        // .git is a file
        return mockStat(path.endsWith('.git'));
      });
      (readFileSync as Mock).mockImplementation((path: string) => {
        if (path.endsWith('.git')) return 'gitdir: .git/worktrees/feature\n';
        if (path.endsWith('HEAD')) return 'ref: refs/heads/feature\n';
        if (path.endsWith('refs/heads/feature') || path.endsWith(String.raw`refs\heads\feature`))
          return 'cafebabe12345678\n';
        return '';
      });

      expect(utils.getGitRevision()).toBe('cafebabe12345678');
    });
  });

  describe('getCurrentSubject', () => {
    it('returns sub from token', () => {
      expect(utils.getCurrentSubject(CURRENT_CONTEXT)).toBe('12345678-90ab-cdef-1234-567890abcdef');
    });
    it('returns default when missing', () => {
      expect(utils.getCurrentSubject(undefined, 'default')).toBe('default');
    });
  });

  describe('getCurrentUsername', () => {
    beforeEach(() => {
      (existsSync as Mock).mockReset();
      (readFileSync as Mock).mockReset();
    });

    it('extracts username based on idp mapping', () => {
      (existsSync as Mock).mockImplementation((p: string) => String(p).endsWith('idplist-local.json'));
      (readFileSync as Mock).mockImplementation((p: string, enc: string) => {
        expect(enc).toBe('utf8');
        return JSON.stringify(IDP_LIST);
      });

      expect(utils.getCurrentUsername(CURRENT_CONTEXT)).toBe('alice.smith');
    });

    it('returns undefined when idp mapping not found', () => {
      (existsSync as Mock).mockImplementation((p: string) => String(p).endsWith('idplist-local.json'));
      (readFileSync as Mock).mockImplementation((p: string, enc: string) => {
        expect(enc).toBe('utf8');
        return JSON.stringify([
          {
            idp: IdentityProviderKind.BCEID,
            kind: 'bceidbasic',
            username: 'bceid_username'
          }
        ]);
      });
      expect(utils.getCurrentUsername(CURRENT_CONTEXT)).toBeUndefined();
    });

    it('returns undefined when no current context', () => {
      expect(utils.getCurrentUsername(undefined)).toBeUndefined();
    });
  });

  describe('getIdpAttributesByKind', () => {
    beforeEach(() => {
      (existsSync as Mock).mockReset();
      (readFileSync as Mock).mockReset();
    });

    it('returns the correct IDP config for a given kind', () => {
      (existsSync as Mock).mockReturnValue(true);
      (readFileSync as Mock).mockReturnValue(JSON.stringify(IDP_LIST));

      const result = utils.getIdpAttributesByKind(IdentityProviderKind.AZUREIDIR);

      expect(result).toEqual({
        idp: IdentityProviderKind.AZUREIDIR,
        kind: 'azureidir',
        username: 'idir_username'
      });
    });

    it('returns undefined if the kind is not found', () => {
      (existsSync as Mock).mockReturnValue(true);
      (readFileSync as Mock).mockReturnValue(JSON.stringify(IDP_LIST));

      const result = utils.getIdpAttributesByKind('non-existent-kind' as unknown as IdentityProviderKind);

      expect(result).toBeUndefined();
    });
  });

  describe('hasIdentity', () => {
    beforeEach(() => {
      (existsSync as Mock).mockReset();
      (readFileSync as Mock).mockReset();
      (existsSync as Mock).mockReturnValue(true);
      (readFileSync as Mock).mockReturnValue(JSON.stringify(IDP_LIST));
    });

    it('returns true when the identity kind matches the current context user identity', () => {
      expect(utils.hasIdentity(IdentityProviderKind.AZUREIDIR, CURRENT_CONTEXT)).toBe(true);
    });

    it('returns false when the identity kind does not match the current context user identity', () => {
      expect(utils.hasIdentity(IdentityProviderKind.BCEID, CURRENT_CONTEXT)).toBe(false);
    });

    it('returns false when the current context token payload is missing', () => {
      const contextWithoutPayload = { ...CURRENT_CONTEXT, tokenPayload: undefined };

      expect(utils.hasIdentity(IdentityProviderKind.AZUREIDIR, contextWithoutPayload)).toBe(false);
    });

    it('returns false when the identity kind is not found in the IDP list', () => {
      expect(utils.hasIdentity('non-existent-kind' as unknown as IdentityProviderKind, CURRENT_CONTEXT)).toBe(false);
    });
  });

  describe('isTruthy', () => {
    it('passes through undefined', () => {
      expect(utils.isTruthy(undefined as unknown)).toBeUndefined();
    });
    it('recognizes true and 1', () => {
      expect(utils.isTruthy(true)).toBe(true);
      expect(utils.isTruthy(1)).toBe(true);
    });
    it('recognizes common true strings (case-insensitive)', () => {
      expect(utils.isTruthy('true')).toBe(true);
      expect(utils.isTruthy('T')).toBe(true);
      expect(utils.isTruthy('Yes')).toBe(true);
      expect(utils.isTruthy('y')).toBe(true);
      expect(utils.isTruthy('1')).toBe(true);
    });
    it('returns false otherwise', () => {
      expect(utils.isTruthy(false)).toBe(false);
      expect(utils.isTruthy(0)).toBe(false);
      expect(utils.isTruthy('no')).toBe(false);
      expect(utils.isTruthy('0')).toBe(false);
      expect(utils.isTruthy(null)).toBe(false);
    });
  });

  describe('mixedQueryToArray', () => {
    it('returns undefined for falsy', () => {
      expect(utils.mixedQueryToArray(undefined)).toBeUndefined();
      expect(utils.mixedQueryToArray('')).toBeUndefined();
    });
    it('parses comma strings and dedupes', () => {
      expect(utils.mixedQueryToArray('a, b, a ,c')).toEqual(['a', 'b', 'c']);
    });
    it('handles string[] and empties -> undefined when all empty', () => {
      expect(utils.mixedQueryToArray(['a,b', 'b , c'])).toEqual(['a', 'b', 'c']);
    });
    it('handles a comma-separated string with duplicates and extra spaces', () => {
      expect(utils.mixedQueryToArray('apple, banana,apple ,  cherry')).toEqual(['apple', 'banana', 'cherry']);
    });
  });

  describe('parseCSV', () => {
    it('splits and trims', () => {
      expect(utils.parseCSV('a, b ,  c  ')).toEqual(['a', 'b', 'c']);
    });
    it('handles single token', () => {
      expect(utils.parseCSV('abc')).toEqual(['abc']);
    });
    it('keeps empties if present (mixedQueryToArray filters later)', () => {
      expect(utils.parseCSV('a,,b')).toEqual(['a', '', 'b']);
    });
  });

  describe('readIdpList', () => {
    beforeEach(() => {
      (existsSync as Mock).mockReset();
      (readFileSync as Mock).mockReset();
    });

    it('prefers override idplist-local.json', () => {
      (existsSync as Mock).mockImplementation((p: string) => ('' + p).endsWith('idplist-local.json'));
      (readFileSync as Mock).mockReturnValueOnce(JSON.stringify([{ idp: 'azureidir' }]));
      expect(utils.readIdpList()).toEqual([{ idp: 'azureidir' }]);
    });

    it('falls back to idplist-default.json', () => {
      (existsSync as Mock).mockImplementation((p: string) => ('' + p).endsWith('idplist-default.json'));
      (readFileSync as Mock).mockReturnValueOnce(JSON.stringify([{ idp: 'github' }]));
      expect(utils.readIdpList()).toEqual([{ idp: 'github' }]);
    });

    it('returns [] when neither exists', () => {
      (existsSync as Mock).mockReturnValueOnce(false);
      expect(utils.readIdpList()).toEqual([]);
    });
  });
});

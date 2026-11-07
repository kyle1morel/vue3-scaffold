import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

import { getLogger } from '#src/utils/log';

import type { IdentityProviderKind } from './enums.ts';
import type { CurrentContext, IdpAttributes, ValueOf } from '#types';

const log = getLogger(import.meta.filename);

/**
 * Create a key/value differential from source against comparer.
 * @param source - Source object.
 * @param comparer - The object to be compared against.
 * @returns Object containing the non-matching key/value pairs in the source object.
 */
export function differential<T extends object>(source: T, comparer: Partial<T>): Partial<T> {
  return Object.fromEntries(
    (Object.entries(source) as [keyof T, ValueOf<T>][]).filter(([key, value]) => comparer[key] !== value)
  ) as Partial<T>;
}

/**
 * Get the identity provider configuration for the given kind.
 * @param kind - The kind of identity provider.
 * @returns IDP config for the given kind or undefined if not found.
 */
export function getIdpAttributesByKind(kind: IdentityProviderKind): IdpAttributes | undefined {
  const idpList: IdpAttributes[] = readIdpList();

  return idpList.find((i) => i.kind === kind);
}

/**
 * Gets the current Git commit hash, or undefined if not found.
 * @see https://stackoverflow.com/a/34518749
 * @returns The git revision hash, or undefined.
 */
export function getGitRevision(): string | undefined {
  const findGitDir = (base: string): string | undefined => {
    let gitPath = join(base, '.git');
    if (existsSync(gitPath)) return gitPath;

    for (let i = 1; i <= 5; i++) {
      gitPath = join(base, '../'.repeat(i), '.git');
      if (existsSync(gitPath)) return gitPath;
    }

    return undefined;
  };

  const resolveGitDir = (gitPath: string): string => {
    if (!statSync(gitPath).isFile()) return gitPath;

    const content = readFileSync(gitPath, 'utf8').trim();
    const match = /^gitdir: (.+)$/.exec(content);
    return match ? join(cwd(), match[1]) : gitPath;
  };

  const readRef = (gitDir: string, ref: string): string | undefined => {
    const refPath = join(gitDir, ref);
    return existsSync(refPath) ? readFileSync(refPath, 'utf8').trim() : undefined;
  };

  const readPackedRef = (gitDir: string, ref: string): string | undefined => {
    const packedPath = join(gitDir, 'packed-refs');
    if (!existsSync(packedPath)) return undefined;

    const refName = ref.trim();
    const line = readFileSync(packedPath, 'utf8')
      .split('\n')
      .find((l) => l.endsWith(refName));

    return line ? line.split(' ')[0] : undefined;
  };

  try {
    if (process.env.GIT_COMMIT) return process.env.GIT_COMMIT;

    const gitPath = findGitDir(cwd());
    if (!gitPath) return undefined;

    const gitDir = resolveGitDir(gitPath);
    const head = readFileSync(join(gitDir, 'HEAD'), 'utf8').trim();

    if (!head.startsWith('ref:')) return head;

    const ref = head.slice(5).trim();

    return readRef(gitDir, ref) ?? readPackedRef(gitDir, ref) ?? undefined;
  } catch (error) {
    if (error instanceof Error) log.warn({ function: 'getGitRevision' }, error.message);
    return undefined;
  }
}

/**
 * Determines if given identity kind is equal to current user identity.
 * @param identityKind - The kind of identity provider.
 * @param currentContext - The context of the current authorized user.
 * @returns True if identities match.
 */
export const hasIdentity = (identityKind: IdentityProviderKind, currentContext: CurrentContext): boolean => {
  const idp = getIdpAttributesByKind(identityKind);
  const userIdp = currentContext.tokenPayload?.identity_provider;
  return idp?.idp === userIdp;
};

/**
 * Omits the given set of keys from the given object.
 * @param data - The object to copy and manipulate.
 * @param keys - Array of keys to remove.
 * @returns A new object with the given keys removed.
 */
export function omit<Data extends object, Keys extends keyof Data>(data: Data, keys: Keys[]): Omit<Data, Keys> {
  const result = { ...data };

  for (const key of keys) {
    delete result[key];
  }

  return result as Omit<Data, Keys>;
}

/**
 * Acquires the list of feature flags to be used.
 * @returns A promise resolving to an object of key values.
 */
export function readFeatureList(): Record<string, boolean> {
  const configDir = '../../config';
  const env = process.env.SERVER_ENV;
  const defaultFile = `features-${env}.json`;
  const overrideFile = 'features-local.json';

  let features: Record<string, boolean> = {};

  if (existsSync(join(import.meta.dirname, configDir, overrideFile))) {
    features = JSON.parse(readFileSync(join(import.meta.dirname, configDir, overrideFile), 'utf8')) as Record<
      string,
      boolean
    >;
  } else if (existsSync(join(import.meta.dirname, configDir, defaultFile))) {
    features = JSON.parse(readFileSync(join(import.meta.dirname, configDir, defaultFile), 'utf8')) as Record<
      string,
      boolean
    >;
  }

  return features;
}

/**
 * Acquires the list of identity providers to be used.
 * @returns A promise resolving to an array of idp provider objects.
 */
export function readIdpList(): IdpAttributes[] {
  const configDir = '../../config';
  const defaultFile = 'idplist-default.json';
  const overrideFile = 'idplist-local.json';

  let idpList: IdpAttributes[] = [];

  if (existsSync(join(import.meta.dirname, configDir, overrideFile))) {
    idpList = JSON.parse(readFileSync(join(import.meta.dirname, configDir, overrideFile), 'utf8')) as IdpAttributes[];
  } else if (existsSync(join(import.meta.dirname, configDir, defaultFile))) {
    idpList = JSON.parse(readFileSync(join(import.meta.dirname, configDir, defaultFile), 'utf8')) as IdpAttributes[];
  }

  return idpList;
}

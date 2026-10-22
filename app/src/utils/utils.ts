import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

import { getLogger } from '#src/utils/log';

import type { IdentityProviderKind } from './enums/application.ts';
import type { CurrentContext, IdpAttributes } from '#types';

const log = getLogger(import.meta.filename);

/**
 * Create a key/value differential from source against comparer.
 * @param source - Source object.
 * @param comparer - The object to be compared against.
 * @returns Object containing the non-matching key/value pairs in the source object.
 */
export function differential<T extends object>(source: T, comparer: Partial<T>): Partial<T> {
  return Object.fromEntries(
    (Object.entries(source) as [keyof T, T[keyof T]][]).filter(([key, value]) => comparer[key] !== value)
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
 * Attempts to acquire a specific current token sub. Yields `defaultValue` otherwise.
 * @param currentContext - The express request currentContext object.
 * @param defaultValue - An optional default return value.
 * @returns The requested current token sub if applicable, or `defaultValue`.
 */
export function getCurrentSubject(currentContext: CurrentContext | undefined, defaultValue = ''): string {
  return currentContext?.tokenPayload?.sub ?? defaultValue;
}

/**
 * Parses currentContext object's identity provider to return their username.
 * @param currentContext - The express request CurrentContext object.
 * @returns The username in currentUser or undefined.
 */
export function getCurrentUsername(currentContext: CurrentContext | undefined): string | undefined {
  if (currentContext?.tokenPayload) {
    const idpList = readIdpList();
    const payload = currentContext.tokenPayload;

    const usernameKey = idpList.find((x) => x.idp === payload.identity_provider)?.username;

    if (usernameKey && usernameKey in payload) return payload[usernameKey] as string;
  }

  return undefined;
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
 * Checks whether the given object is empty, no properties.
 * @param obj - The object to check.
 * @returns True if the object is empty, false otherwise.
 */
export function isEmptyObject(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Returns true if the element name in the object contains a truthy value.
 * @param value - The object to evaluate.
 * @returns True if truthy, false if not, and undefined if undefined.
 */
export function isTruthy(value: unknown): boolean | undefined {
  if (value === undefined) return value;

  const isStr = typeof value === 'string' || value instanceof String;
  const trueStrings = ['true', 't', 'yes', 'y', '1'];
  return value === true || value === 1 || (isStr && trueStrings.includes(value.toLowerCase()));
}

/**
 * Standardizes query params to yield an array of unique string values.
 * @param param - The query param to process.
 * @returns A unique, non-empty array of string values, or undefined if empty.
 */
export function mixedQueryToArray(param: string | string[] | undefined): string[] | undefined {
  // Short circuit undefined if param is falsy
  if (!param) return undefined;

  const parsed = Array.isArray(param) ? param.flatMap((p) => parseCSV(p)) : parseCSV(param);
  const unique = Array.from(new Set(parsed));

  return unique.length ? unique : undefined;
}

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
 * Converts a comma separated value string into an array of string values.
 * @param value - The CSV string to parse.
 * @returns An array of string values, or `value` if it is not a string.
 */
export function parseCSV(value: string): string[] {
  return value.split(',').map((s) => s.trim());
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

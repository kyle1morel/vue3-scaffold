import { nextTick } from 'vue';

import { i18n } from '@/i18n';
import { useToast } from '@/lib/primevue';
import { useConfigStore } from '@/store';
import { IdentityProviderKind, ToastTimeout } from '@/utils/enums/application';

import type { IdentityProvider, ValueOf } from '@/types';

/**
 * An error whose message is written for the user, so the global error handler shows it as is.
 */
export class UserError extends Error {
  override name = 'UserError';
}

/**
 * Turns date text into a Date, with date-only strings parsed as local midnight and blank text as null, leaving
 * anything else unchanged.
 * @param value - The raw input.
 * @returns The date, null, or the raw input.
 */
export function coerceDate(value: unknown) {
  if (typeof value !== 'string') return value;
  if (!value.trim()) return null;

  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00` : value);
}

/**
 * Turns numeric text into a number, leaving anything else unchanged.
 * @param value - The raw input.
 * @returns The number, or the raw input.
 */
export function coerceNumber(value: unknown) {
  return typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
}

/**
 * Splits a space, semicolon or comma separated string into its values.
 * @param value - The string to split.
 * @returns The non-empty values.
 */
export function delimitEmails(value: string): string[] {
  return value.split(/[\s;,]+/).filter(Boolean);
}

/**
 * Builds a key/value differential of a source object against a comparer, comparing arrays, objects and dates by
 * content.
 * @param source - The source object.
 * @param comparer - The object to compare against.
 * @returns The key/value pairs of the source that differ from the comparer.
 */
export function differential<T extends Record<PropertyKey, unknown>>(source: T, comparer: Partial<T>): Partial<T> {
  return Object.fromEntries(
    (Object.entries(source) as [keyof T, ValueOf<T>][]).filter(([key, value]) => !isEqual(comparer[key], value))
  ) as Partial<T>;
}

// Deep equality for plain data: primitives, dates, arrays and plain objects
function isEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b || Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  const keys = Object.keys(a);
  return (
    keys.length === Object.keys(b).length &&
    keys.every((key) => isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]))
  );
}

/**
 * Gets the identity provider configuration for a kind.
 * @param kind - The kind of identity provider.
 * @returns The configuration, or undefined when there is none.
 */
export function findIdpConfig(kind: IdentityProviderKind): IdentityProvider | undefined {
  return useConfigStore().getConfig?.idpList?.find((x: IdentityProvider) => x.kind === kind);
}

/**
 * Scrolls to and focuses the first invalid field in a form, so a screen reader announces its error.
 * @param errors - The error messages, keyed by field name.
 */
export async function focusFirstError(errors: Record<string, string>) {
  const names = Object.keys(errors);
  if (!names.length) return;

  // The error messages must render first, or they're missing from the field's description when it's focused
  await nextTick();

  // Document order, which is also the focus order
  const first = document.querySelector<HTMLElement>(names.map((name) => `[name="${CSS.escape(name)}"]`).join(','));

  first?.scrollIntoView({ behavior: 'smooth' });
  // Without preventScroll, focusing jumps straight there and cuts the smooth scroll short
  first?.focus({ preventScroll: true });
}

/**
 * Makes a rejection a UserError with a message for the user, keeping the original error as its cause.
 * @param message - The message to show the user.
 * @returns A rejection handler for `.catch()`.
 */
export function rethrowAs(message: string) {
  return (cause: unknown): never => {
    throw new UserError(message, { cause });
  };
}

/**
 * Logs an error and shows it as a toast: a UserError's own message, or a generic one for anything unexpected.
 * @param error - The error.
 */
export function showError(error: unknown) {
  // eslint-disable-next-line no-console
  console.error(error);

  if (error instanceof UserError) useToast().error(error.message);
  else useToast().error(i18n.t('ui.errors.unexpected'), '', { life: ToastTimeout.STICKY });
}

/**
 * Splits an array into consecutive batches of at most `size` items.
 * @param arr - The array to split.
 * @param size - The maximum number of items per batch, a positive integer.
 * @returns The batches in order, the last of which may be shorter.
 */
export function getBatches<T>(arr: T[], size: number): T[][] {
  if (!Number.isInteger(size) || size < 1) throw new RangeError(`Batch size must be a positive integer, not ${size}`);

  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, (i + 1) * size));
}

/**
 * Whether a raw input counts as not filled in: never set, cleared to null, or left empty.
 * @param value - The raw input.
 * @returns Whether the input is blank.
 */
export function isBlank(value: unknown) {
  return value === undefined || value === null || value === '';
}

/**
 * Whether the app is running in debug mode.
 * @returns Whether the app is in debug mode.
 */
export function isDebugMode(): boolean {
  return import.meta.env.MODE.toUpperCase() === 'DEBUG';
}

/**
 * Narrows a value to one that is neither null nor undefined.
 * @param value - The value to check.
 * @returns Whether the value is defined.
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Narrows an unknown value to one of a list of allowed values.
 * @param values - The allowed values.
 * @param value - The value to check.
 * @returns Whether the value is one of the allowed values.
 */
export function isOneOf<T>(values: readonly T[], value: unknown): value is T {
  return values.includes(value as T);
}

/**
 * Splits an array into the items that pass a predicate and the items that fail it.
 * @param arr - The array to split.
 * @param predicate - The predicate to test each item with.
 * @returns The passing items, then the failing items.
 */
export function partition<T>(arr: T[], predicate: (v: T, i: number, ar: T[]) => boolean): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  arr.forEach((item, index) => (predicate(item, index, arr) ? pass : fail).push(item));

  return [pass, fail];
}

/**
 * Converts a date range to ISO strings, but only once both ends are picked.
 * @param range - The range, whose end is null while a range picker is half picked.
 * @returns The ISO strings, or undefined when the range is missing or incomplete.
 */
export function toIsoRange(range: (Date | null)[] | null | undefined) {
  return range?.length === 2 && range.every((date) => date instanceof Date)
    ? range.map((date) => date.toISOString())
    : undefined;
}

/**
 * Keeps a value only when it is one of a list of allowed values, so a form asks again for anything else.
 * @param values - The allowed values.
 * @param value - The value to check.
 * @returns The value, or undefined when it is not allowed.
 */
export function toOneOf<T>(values: readonly T[], value: unknown): T | undefined {
  return isOneOf(values, value) ? value : undefined;
}

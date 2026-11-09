import { format, isValid, parseISO } from 'date-fns';

// A date-only value parses as local midnight, so it shows the same day in every time zone.
function formatIso(value: string | null | undefined, pattern: string) {
  if (!value) return '';

  const date = parseISO(value);
  return isValid(date) ? format(date, pattern) : '';
}

/**
 * Formats a date or timestamp as a date, such as "November 1, 2023".
 * @param value - An ISO date or timestamp.
 * @returns The formatted date, or an empty string when `value` is missing or invalid.
 */
export function formatDate(value: string | null | undefined) {
  return formatIso(value, 'MMMM d, yyyy');
}

/**
 * Formats a timestamp for use in a file name, such as "2023-11-01_1430".
 * @param value - An ISO timestamp.
 * @returns The formatted timestamp, or an empty string when `value` is missing or invalid.
 */
export function formatDateFilename(value: string | null | undefined) {
  return formatIso(value, 'yyyy-MM-dd_HHmm');
}

/**
 * Formats a timestamp with seconds, such as "November 1 2023, 2:30:00 PM".
 * @param value - An ISO timestamp.
 * @returns The formatted timestamp, or an empty string when `value` is missing or invalid.
 */
export function formatDateLong(value: string | null | undefined) {
  return formatIso(value, 'MMMM d yyyy, h:mm:ss a');
}

/**
 * Formats a date with no time, such as "November 28, 2025"; anything but an exact YYYY-MM-DD is rejected.
 * @param value - A YYYY-MM-DD date.
 * @returns The formatted date, or an empty string when `value` is missing or invalid.
 */
export function formatDateOnly(value: string | null | undefined) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? formatDate(value) : '';
}

/**
 * Formats a timestamp compactly, such as "2023 Nov 01, 14:30".
 * @param value - An ISO timestamp.
 * @returns The formatted timestamp, or an empty string when `value` is missing or invalid.
 */
export function formatDateShort(value: string | null | undefined) {
  return formatIso(value, 'yyyy MMM dd, HH:mm');
}

/**
 * Formats a timestamp to the minute, such as "November 1, 2023, 2:30 PM".
 * @param value - An ISO timestamp.
 * @returns The formatted timestamp, or an empty string when `value` is missing or invalid.
 */
export function formatDateTime(value: string | null | undefined) {
  return formatIso(value, 'MMMM d, yyyy, h:mm a');
}

/**
 * Formats the time of a timestamp, such as "02:30 PM".
 * @param value - An ISO timestamp.
 * @returns The formatted time, or an empty string when `value` is missing or invalid.
 */
export function formatTime(value: string | null | undefined) {
  return formatIso(value, 'hh:mm a');
}

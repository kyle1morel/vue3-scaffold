import { format, parseJSON } from 'date-fns';

import { useConfigStore } from '@/store';

function _dateFnsFormat(value: string | undefined | null, formatter: string) {
  const formatted = '';
  try {
    if (value) {
      return format(parseJSON(value), formatter);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`_dateFnsFormat: Error parsing ${value} to ${error}`);
  }
  return formatted;
}

/**
 * @param value - A string representation of a date.
 * @returns A string representation of `value`.
 */
export function formatDate(value: string | undefined | null) {
  return value ? _dateFnsFormat(value, 'MMMM d, yyyy') : '';
}

/**
 * @param value - A string representation of a date.
 * @returns A string representation of `value`.
 */
export function formatDateFilename(value: string | undefined | null) {
  return _dateFnsFormat(value, 'yyyy-MM-dd_HHmm');
}

/**
 * @param value - A string representation of a date.
 * @returns A string representation of `value`.
 */
export function formatDateLong(value: string | undefined | null) {
  return _dateFnsFormat(value, 'MMMM d yyyy, h:mm:ss a');
}

/**
 * Formats a YYYY-MM-DD date-only string into "MMMM D, YYYY".
 * @param value - A date only string.
 * @returns A string representation of `value`.
 */
export function formatDateOnly(value: string | null | undefined): string {
  if (!value) return '';

  // Must be exactly YYYY-MM-DD
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return '';

  const [, year, month, day] = match;
  const yearNum = Number(year);
  const monthNum = Number(month) - 1;
  const dayNum = Number(day);

  const dateCheck = new Date(yearNum, monthNum, dayNum);
  dateCheck.setFullYear(yearNum);

  if (dateCheck.getFullYear() !== yearNum || dateCheck.getMonth() !== monthNum || dateCheck.getDate() !== dayNum) {
    return '';
  }

  const safeMonthDate = new Date(2000, monthNum, 1);
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(safeMonthDate);

  return `${monthName} ${String(dayNum)}, ${year}`;
}

/**
 * @param value - A string representation of a date.
 * @returns A string representation of `value`.
 */
export function formatDateShort(value: string | undefined | null) {
  return _dateFnsFormat(value, 'yyyy MMM dd, HH:mm');
}

/**
 * @param value - A string representation of a date.
 * @returns A string representation of `value`.
 */
export function formatDateTime(value: string | undefined | null) {
  return _dateFnsFormat(value, 'MMMM d, yyyy, h:mm a');
}

/**
 * @deprecated Function not used anywhere.
 * @param value - A string representation of a JWT username.
 * @returns A formatted representation of `value`.
 */
export function formatJwtUsername(value: string | undefined | null) {
  if (!value) return undefined;

  const idps = useConfigStore().getConfig?.idpList;
  if (!idps) return undefined;

  value = value.toUpperCase();

  let substr = value.length;
  for (const idp of idps) {
    const i = value.indexOf(`@${idp.idp.toUpperCase()}`);
    if (i !== -1) {
      substr = i;
      break;
    }
  }
  return value.substring(0, substr);
}

/**
 * @param value - A string representation of a date.
 * @returns A string representation of `value`.
 */
export function formatTime(value: string | undefined | null) {
  return _dateFnsFormat(value, 'hh:mm a');
}

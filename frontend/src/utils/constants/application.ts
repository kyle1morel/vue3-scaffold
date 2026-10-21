/*
 * Shared application wide constants
 */

import { BasicResponse, UserSearchParams } from '../enums/application';

export const DELIMITER = '/';

export const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export const SUPPORT_CONTACT = {
  email: 'support@example.com',
  subject: 'Reporting an Issue with Vue3 Scaffold'
};

// Matches the API paginationOptions take max
export const MAX_SEARCH_TAKE = 100;

export const MIN_SEARCH_INPUT_LENGTH = 2;

/**
 * Minimally valid UUIDv4 for the system ID
 * @see https://www.rfc-editor.org/rfc/rfc9562#variant_field
 */
export const SYSTEM_ID = '00000000-0000-4000-8000-000000000000';

export const USER_SEARCH_PARAMS = [UserSearchParams.FIRST_NAME, UserSearchParams.LAST_NAME, UserSearchParams.EMAIL];

export const UUID_V4_PATTERN = /[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}/i;

export const YES_NO_LIST = [BasicResponse.YES, BasicResponse.NO] as const;
export const YES_NO_UNSURE_LIST = [BasicResponse.YES, BasicResponse.NO, BasicResponse.UNSURE] as const;

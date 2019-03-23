import {DATE_FORMAT, DATE_FORMAT_LONG, DEFAULT_LOCALE} from "../config";


/**
 * Format given date or timestamp with default configuration
 * @param {number|string|Date} timestampOrDate
 * @returns {string}
 */
export function format(timestampOrDate) {
  let date = new Date(timestampOrDate);
  return date.toLocaleString(DEFAULT_LOCALE, DATE_FORMAT);
}

export function formatLong(timestampOrDate) {
  let date = new Date(timestampOrDate);
  return date.toLocaleString(DEFAULT_LOCALE, DATE_FORMAT_LONG);
}

/**
 * Get date representing the beginning of the day given by date or UTC timestamp
 * @param {number|string|Date} timestampOrDate
 * @returns {Date}
 */
export function beginningOfDay(timestampOrDate) {
  let date = new Date(timestampOrDate);

  date.setHours(0, 0, 0, 0);
  return date;
}

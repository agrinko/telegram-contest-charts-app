import {DATE_FORMAT, DEFAULT_LOCALE} from "../config";


/**
 * Format given date or timestamp with default configuration
 * @param {number|string|Date} timestampOrDate
 * @returns {string}
 */
export function format(timestampOrDate) {
  let date = (timestampOrDate instanceof Date) ? timestampOrDate : new Date(timestampOrDate);
  return date.toLocaleString(DEFAULT_LOCALE, DATE_FORMAT);
}

/**
 * Get date representing the beginning of the day given by date or UTC timestamp
 * @param {number|string|Date} timestampOrDate
 * @returns {Date}
 */
export function beginningOfDay(timestampOrDate) {
  let date = (timestampOrDate instanceof Date) ? timestampOrDate : new Date(timestampOrDate);

  date.setHours(0, 0, 0, 0);
  return date;
}

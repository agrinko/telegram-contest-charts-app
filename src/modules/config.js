export const seriesTypes = {
  LINE: 'line',
  AXIS: 'x'
};

export const CHART_PREVIEW_PADDING = .05;

export const ZERO_BASED_Y_AXIS = false;

export const ONE_DAY = 1000 * 60 * 60 * 24; // in milliseconds

export const DEFAULT_LOCALE = 'en-us';
export const DATE_FORMAT = {
  month: 'short',
  day: 'numeric'
};

/**
 * Default date range to scale to initially (in milliseconds)
 * @type {number}
 */
export const DEFAULT_DATE_RANGE = 35 * ONE_DAY;

/**
 * Timestamps that differ by less than this constant are considered equal
 * @type {number}
 */
export const TIME_COMPARISON_PRECISION = 1000;
/**
 * Minimal step for X axis (in milliseconds)
 * @type {number}
 */
export const MINIMAL_TIME_STEP = ONE_DAY;

/* EVENTS */

export const lineEvents = {
  TOGGLE: 'toggle'
};

export const linesGroupEvents = {
  UPDATE_RANGE: 'update-y-range'
};

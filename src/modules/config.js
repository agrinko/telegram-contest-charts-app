export const seriesTypes = {
  LINE: 'line',
  AXIS: 'x'
};

export const REFERENCE_VIEW_BOX = [100, 100];

/**
 * Number of latest data points to be displayed initially, before user changes scale
 * @type {number}
 */
export const DEFAULT_POINTS_TO_DISPLAY = 28; // consider switching to "default date range to display", e.g. to show last month data

export const DEFAULT_LOCALE = 'en-us';
export const DATE_FORMAT = {
  month: 'short',
  day: 'numeric'
};

export const ONE_DAY = 1000 * 60 * 60 * 24; // in milliseconds

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
  UPDATE_SCALE: 'update-scale'
};

export const previewEvents = {
  UPDATE_BOUNDS: 'update-bounds',
  FINISH_INTERACTION: 'finish-interaction'
};

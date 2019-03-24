export const seriesTypes = {
  LINE: 'line',
  AXIS: 'x'
};

export const TOUCH_SUPPORT = 'ontouchstart' in window ;

export const THEMES = ['day', 'night'];

export const CHART_PREVIEW_PADDING = .00; // TODO: fix padding

export const ONE_DAY = 1000 * 60 * 60 * 24; // in milliseconds

/**
 * Default part of the chart displayed initially
 * @type {number}
 */
export const DEFAULT_SCALE = .25;

export const MIN_DATE_RANGE = 3 * ONE_DAY;

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
  UPDATE_Y_RANGE: 'update-y-range',
  UPDATE_X_RANGE: 'update-x-range'
};

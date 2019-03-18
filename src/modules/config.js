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

export const lineEvents = {
  TOGGLE: 'toggle'
};

export const linesGroupEvents = {
  UPDATE_SCALE: 'update-scale'
};

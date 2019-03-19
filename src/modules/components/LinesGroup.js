import {findClosestIndex, getRange} from "../utils/array.utils";
import {Events} from "../utils/Events";
import {lineEvents, linesGroupEvents} from "../config";


export class LinesGroup {
  constructor(lines, options) {
    this.events = new Events();
    this.lines = lines;
    this.viewBox = options.viewBox;
    this._latestAxisIndices = [];
    this.xRange = options.horizontalBounds || [this.lines[0].minX, this.lines[0].maxX];
    this.yRange = this._getFullRange();

    this.forEach(line => line.events.subscribe(lineEvents.TOGGLE, this._updateScale, this));
  }

  get minX() {
    return this.xRange[0];
  }

  get maxX() {
    return this.xRange[1];
  }

  get maxY() {
    return this.yRange[1];
  }

  get minY() {
    return this.yRange[0];
  }

  forEach(f) {
    this.lines.forEach(f);
  }

  /**
   * Get transformation matrix for the given line into the lines group basis
   * @param {Line|string} line or key
   * @returns {TransformationMatrix}
   */
  getTransformationMatrix(line) {
    if (typeof line === 'string')
      line = this.lines.find(l => l.key === line);

    const scaleBasis = [ // transformation from line's view box to the group's view box
      this.viewBox[0] / line.viewBox[0],
      this.viewBox[1] / line.viewBox[1]
    ];

    let scaleX = scaleBasis[0] * (line.maxX - line.minX) / (this.maxX - this.minX);
    let scaleY = scaleBasis[1] * (line.maxY - line.minY) / (this.maxY - this.minY);
    // translation formulas are different for X and Y because transform origin defaults to `top, left`,
    // which corresponds to maximum Y and minimum X (thus using `minX` but `maxY`);
    // translateX is multiplied by `-1` to ensure lines are translated to the left
    let translateX = this.viewBox[0] * (this.minX - line.minX) / (this.maxX - this.minX) * -1;
    let translateY = this.viewBox[1] * (this.maxY - line.maxY) / (this.maxY - this.minY);

    return [scaleX, 0, 0, scaleY, translateX, translateY];
  }

  /**
   * Limit displayed parts of the lines from left and right
   * @param {Bounds} bounds
   */
  setHorizontalBounds(bounds) {
    this.xRange = bounds;
    this._latestAxisIndices = []; // invalidate cache
    this._updateScale();
  }

  /**
   * Update the view box of the group
   * @param {ViewBox} viewBox
   */
  setViewBox(viewBox) {
    this.viewBox = viewBox;
  }

  _getFullRange() {
    let values = [];
    const [i1, i2] = this._getAxisIndicesRange();

    this.lines.forEach(line => {
      if (line.enabled) {
        let range = line.getMinMaxWithinIndices(i1, i2);
        values.push(range[0], range[1]);
      }
    });

    return getRange(values) || [];
  }

  _getAxisIndicesRange() {
    const axis = this.lines[0].axis.values;

    // used cached indices to avoid recalculations when horizontal scale was not changed
    if (this._latestAxisIndices.length !== 2) {
      this._latestAxisIndices[0] = findClosestIndex(axis, this.minX) - 1;
      this._latestAxisIndices[1] = findClosestIndex(axis, this.maxX);
    }

    return this._latestAxisIndices;
  }

  _updateScale() {
    this.yRange = this._getFullRange();
    this.events.next(linesGroupEvents.UPDATE_SCALE);
  }
}

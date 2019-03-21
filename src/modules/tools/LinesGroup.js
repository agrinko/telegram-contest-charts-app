import {findClosestIndex, getRange} from "../utils/array.utils";
import {Events} from "./Events";
import {lineEvents, linesGroupEvents} from "../config";


export class LinesGroup {
  constructor(lines, options = {}) {
    this.events = new Events();
    this.lines = lines;

    this.xBounds = options.bounds || [this.lines[0].minX, this.lines[0].maxX];
    this.yBounds = this._getYBounds();

    this.forEach(line => line.events.subscribe(lineEvents.TOGGLE, this._updateYBounds, this));
  }

  get minX() {
    return this.xBounds[0];
  }

  get maxX() {
    return this.xBounds[1];
  }

  get maxY() {
    return this.yBounds[1];
  }

  get minY() {
    return this.yBounds[0];
  }

  forEach(f) {
    this.lines.forEach(f);
  }

  /**
   * Limit displayed parts of the lines from left and right
   * @param {Bounds} bounds
   */
  setHorizontalBounds(bounds) {
    this.xBounds = bounds;
    this._latestAxisIndices = null; // invalidate cache
    this._updateYBounds();
  }

  /**
   * Get transformation matrix for the given line into the lines group basis
   * @param {Line|string} line or key
   * @param {ViewBox} viewBox
   * @returns {TransformationMatrix}
   */
  getTransformationMatrix(line, viewBox) {
    const scaleBasis = [ // transformation from line's view box to the group's view box
      viewBox[0] / line.viewBox[0],
      viewBox[1] / line.viewBox[1]
    ];

    let scaleX = scaleBasis[0] * (line.maxX - line.minX) / (this.maxX - this.minX);
    let scaleY = scaleBasis[1] * (line.maxY - line.minY) / (this.maxY - this.minY);
    // translation formulas are different for X and Y because transform origin defaults to `top, left`,
    // which corresponds to maximum Y and minimum X (thus using `minX` but `maxY`);
    // translateX is multiplied by `-1` to ensure lines are translated to the left
    let translateX = viewBox[0] * (this.minX - line.minX) / (this.maxX - this.minX) * -1;
    let translateY = viewBox[1] * (this.maxY - line.maxY) / (this.maxY - this.minY);

    return [scaleX, 0, 0, scaleY, translateX, translateY];
  }

  _getYBounds() {
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
    if (!this._latestAxisIndices)
      this._latestAxisIndices = [
        findClosestIndex(axis, this.minX) - 1,
        findClosestIndex(axis, this.maxX)
      ];

    return this._latestAxisIndices;
  }

  _updateYBounds() {
    this.yBounds = this._getYBounds();
    this.events.next(linesGroupEvents.UPDATE_RANGE);
  }
}

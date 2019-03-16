import {getRange} from "../utils/chart.utils";
import {Events} from "../utils/Events";
import {lineEvents, linesGroupEvents} from "../config";


export class LinesGroup {
  constructor(lines, options) {
    this.events = new Events();
    this.lines = lines;
    this.viewBox = options.viewBox;
    this.range = this._getFullRange();
    this.horizontalScale = options.horizontalScale || [this.lines[0].minX, this.lines[0].maxX];

    this.forEach(line => line.events.subscribe(lineEvents.TOGGLE, this._onToggle, this));
  }

  get minX() {
    return this.horizontalScale[0];
  }

  get maxX() {
    return this.horizontalScale[1];
  }

  get maxY() {
    return this.range[1];
  }

  get minY() {
    return this.range[0];
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
   * @param {Bounds} bounds - bounds given in percentage values
   */
  setHorizontalScale(bounds) {
    this.horizontalScale = bounds;

    this.events.next(linesGroupEvents.UPDATE_SCALE);
  }

  _getFullRange() {
    let values = [];

    this.lines.forEach(line => {
      if (line.enabled)
        values.push(line.minY, line.maxY);
    });

    return getRange(values) || [];
  }

  _onToggle() {
    this.range = this._getFullRange();
    this.events.next(linesGroupEvents.UPDATE_SCALE);
  }
}

import {getRange} from "../utils/chart.utils";
import {Events} from "../utils/Events";
import {lineEvents, linesGroupEvents} from "../config";


export class LinesGroup {
  constructor(lines, options) {
    this.events = new Events();
    this.lines = lines;
    this.viewBox = options.viewBox;
    this.range = this._getFullRange();

    this.forEach(line => line.events.subscribe(lineEvents.TOGGLE, this._onToggle, this));
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

    let scaleBasis = this.viewBox[1] / line.viewBox[1];
    let scaleX = this.viewBox[0] / line.viewBox[0];
    let scaleY = (line.maxY - line.minY) / (this.maxY - this.minY) * scaleBasis;
    let translateY = (this.maxY - line.maxY) / (this.maxY - this.minY) * this.viewBox[1];

    return [scaleX, 0, 0, scaleY, 0, translateY];
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

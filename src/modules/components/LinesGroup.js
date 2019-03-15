import {getRange} from "../utils/chart.utils";

export class LinesGroup {
  constructor(lines, options) {
    this.lines = lines;
    this.viewBox = options.viewBox;
    this.range = this._getFullRange();
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
   * @param {Line} line
   * @returns {TransformationMatrix}
   */
  getTransformationMatrix(line) {
    let scaleY = (line.maxY - line.minY) / (this.maxY - this.minY);
    let translateY = (this.maxY - line.maxY)/ (this.maxY - this.minY) * this.viewBox[1];

    return [1, 0, 0, scaleY, 0, translateY];
  }

  _getFullRange() {
    let values = [];

    this.lines.forEach(line => {
      values.push(line.minY, line.maxY);
    });

    return getRange(values);
  }
}

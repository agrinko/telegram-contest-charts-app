import {getRange} from "../utils/chart.utils";
import * as SVG from '../utils/svg.utils';


export class Line {
  /**
   * @param {Array<number>} values
   * @param {{
   *  name: string,
   *  key: string,
   *  color: string,
   *  axis: Axis,
   *  viewBox: ViewBox
   * }} options
   */
  constructor(values, options) {
    this.values = values;
    this.key = options.key;
    this.axis = options.axis;
    this.name = options.name;
    this.viewBox = options.viewBox;
    this.color = options.color;
    this.range = getRange(values);

    this.svgPoints = SVG.toPolylinePoints(
      this._normalizeToViewBox()
    )
  }

  get maxX() {
    return this.axis.values[this.axis.values.length - 1];
  }

  get minX() {
    return this.axis.values[0];
  }

  get maxY() {
    return this.range[1];
  }

  get minY() {
    return this.range[0];
  }

  /**
   * Normalize points of the line so that they are relative to the line's view box
   * @returns {Array<Point>}
   */
  _normalizeToViewBox() {
    const [width, height] = this.viewBox;
    const xValues = this.axis.values,
          y = this.values;
    const minX = this.minX,
          maxX = this.maxX,
          minY = this.minY,
          maxY = this.maxY;
    const dX = maxX - minX,
          dY = maxY - minY;

    return xValues.map((x, i) => [
      (x - minX)/dX * width,
      (y[i] - minY)/dY * height
    ]);
  }
}

import {LinesGroup} from "./LinesGroup";
import * as SVG from "../utils/svg.utils";
import * as DOM from '../utils/dom.utils';
import {lineEvents, linesGroupEvents, TIME_COMPARISON_PRECISION} from "../config";
import {findClosestIndex} from "../utils/array.utils";
import {Axis} from "./Axis";
import {format} from "../utils/date.utils";
import {equals} from "../utils/math.utils";


const keyAttr = 'data-key';
const xAxisMargin = 24;

export class Chart {
  constructor(element, lines, options) {
    this.el = element;
    this.viewBox = options.viewBox;
    this.axis = options.axis;
    this.horizontalBounds = options.horizontalBounds;
    this.linesGroup = new LinesGroup(lines, {
      viewBox: this.viewBox,
      horizontalBounds: this.horizontalBounds
    });

    if (!window.lg) { // TODO: delete
      window.lg = this.linesGroup;
    }

    this.linesGroup.events.subscribe(linesGroupEvents.UPDATE_SCALE, this._transformLines, this);

    this._createLayout();
  }

  setViewBox([width, height]) {
    height -= xAxisMargin;

    this.viewBox = [width, height];
    this.svgContainer.setAttribute('viewBox', `0 0 ${width} ${height}`);
    this.linesGroup.setViewBox([width, height]);
  }

  render() {
    this.svgLines = {};
    // SVG.setBounds(...);
    this.linesGroup.forEach(line => {
      this.svgLines[line.key] = SVG.createPolyline(line.svgPoints, line.color, {
        [keyAttr]: line.key
      });

      SVG.draw(this.svgContainer, this.svgLines[line.key]);

      this.svgLines[line.key].addEventListener('mouseover', (event) => {
        let bounds = this.el.getBoundingClientRect();
        let x = (event.clientX - bounds.left) / bounds.width;
        let i = findClosestIndex(line.axis.values, this.horizontalBounds[0] + x * (this.horizontalBounds[1] - this.horizontalBounds[0]));

        console.log(`${line.key}: ${format(line.axis.values[i])}, ${line.values[i]}`);
      });

      line.events.subscribe(lineEvents.TOGGLE, this._onToggleLine, this);
    });

    this._transformLines();
    this.xAxis.render(true);
  }

  setBounds(bounds) {
    if (equals(bounds[0], this.horizontalBounds[0], TIME_COMPARISON_PRECISION) &&
        equals(bounds[1], this.horizontalBounds[1], TIME_COMPARISON_PRECISION))
      return; // skip any actions if bounds did not actually change

    this.horizontalBounds = bounds;
    this.linesGroup.setHorizontalBounds(bounds);
    this.xAxis.setBounds(bounds);
  }

  finishInteraction() {
    this.xAxis.finishInteraction();
  }

  _transformLines() {
    for (let key in this.svgLines) {
      let svgLine = this.svgLines[key];
      let key = svgLine.getAttribute(keyAttr);
      let matrix = this.linesGroup.getTransformationMatrix(key);

      SVG.applyTransformationMatrix(svgLine, matrix);
    }
  }

  _createLayout() {
    this.scaleContainer = DOM.elementFromString(
      `<div class="scale-container">
        <div class="x-axis"></div>
        <div class="y-scale"></div>
      </div>`
    );

    this.svgContainer = SVG.generateSVGBox(this.viewBox);
    this.xAxis = new Axis(this.scaleContainer.firstElementChild, this.axis.values, {
      viewBox: this.viewBox,
      bottomMargin: xAxisMargin,
      bounds: this.horizontalBounds
    });

    this.el.appendChild(this.scaleContainer);
    this.el.appendChild(this.svgContainer);
  }

  _onToggleLine(line) {
    this.svgLines[line.key].classList.toggle('disabled')
  }
}

import {LinesGroup} from "./LinesGroup";
import * as SVG from "../utils/svg.utils";
import {lineEvents, linesGroupEvents} from "../config";


const keyAttr = 'data-key';

export class Chart {
  constructor(element, lines, options) {
    this.el = element;
    this.viewBox = options.viewBox;
    this.linesGroup = new LinesGroup(lines, { viewBox: this.viewBox });

    this.linesGroup.events.subscribe(linesGroupEvents.UPDATE_SCALE, this.renderScale, this);

    this._createElement();
  }

  render() {
    this.svgLines = {};
    // SVG.setBounds(...);
    this.linesGroup.forEach(line => {
      this.svgLines[line.key] = SVG.createPolyline(line.svgPoints, line.color, {
        [keyAttr]: line.key
      });

      SVG.draw(this.svgContainer, this.svgLines[line.key]);

      this.renderScale();

      line.events.subscribe(lineEvents.TOGGLE, this._onToggleLine, this);
    });
  }

  renderScale() {
    for (let key in this.svgLines) {
      let svgLine = this.svgLines[key];
      let key = svgLine.getAttribute(keyAttr);
      let matrix = this.linesGroup.getTransformationMatrix(key);

      SVG.applyTransformationMatrix(svgLine, matrix);
    }
  }

  _createElement() {
    this.svgContainer = SVG.generateSVGBox(this.viewBox);
    this.el.appendChild(this.svgContainer);
  }

  _onToggleLine(line) {
      if (line.enabled)
        this.svgLines[line.key].style.display = '';
      else
        this.svgLines[line.key].style.display = 'none';
  }
}

import * as SVG from '../utils/svg.utils';
import {LinesGroup} from "./LinesGroup";

export class ChartPreview {
  constructor(element, lines, options) {
    this.el = element;
    this.viewBox = options.viewBox;
    this.linesGroup = new LinesGroup(lines, {
      viewBox: this.viewBox
    });
    this._createElement();
  }

  render() {
    this.svgLines = {};
    // SVG.setBounds(...);
    this.linesGroup.forEach(line => {
      let l = SVG.createPolyline(line.svgPoints, line.color);
      this.svgLines[line.key] = l;

      l.style.transform = `matrix(${this.linesGroup.getTransformationMatrix(line).join(',')})`;

      SVG.draw(this.svgContainer, l);
    });
  }

  _createElement() {
    this.el.innerHTML = `<div class="sliding-window"></div>`;
    this.svgContainer = SVG.generateSVGBox(this.viewBox);

    this.el.appendChild(this.svgContainer);
  }
}

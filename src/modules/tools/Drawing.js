import * as SVG from "../utils/svg.utils";
import {lineEvents, linesGroupEvents} from "../config";


export class Drawing {
  constructor([width, height], options) {
    this.paddingRel = options && options.padding || 0;
    this.padding = height * this.paddingRel;
    this.viewBox = [width, height - 2 * this.padding];

    this.svgContainer = SVG.elementFromString(
      `<svg viewBox="0 0 ${width} ${height - 2 * this.padding}" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <g></g>
      </svg>`
    );
    this.svgContainer.style.marginTop = this.padding + 'px';
    this.linesContainer = this.svgContainer.firstElementChild;
  }

  resize([width, height]) {
    this.viewBox = [width, height];
    this.padding = height * this.paddingRel;
    this.svgContainer.setAttribute('viewBox', `0 0 ${width} ${height - 2 * this.padding}`);
    this.svgContainer.style.marginTop = this.paddingRel + '%';
    this._updateTransformations();
  }

  appendTo(el) {
    el.appendChild(this.svgContainer);
  }

  drawLinesGroup(linesGroup) {
    this.linesGroup = linesGroup;
    this.svgLines = {};

    this.linesGroup.forEach(line => {
      this.svgLines[line.key] = SVG.createPolyline(line.svgPoints, line.color);
      line.events.subscribe(lineEvents.TOGGLE, this._onToggleLine, this);
    });

    this._updateTransformations();

    for (let key in this.svgLines)
      SVG.draw(this.linesContainer, this.svgLines[key]);

    this.linesGroup.events.subscribe(linesGroupEvents.UPDATE_Y_RANGE, this._transformVertically, this);
    this.linesGroup.events.subscribe(linesGroupEvents.UPDATE_X_RANGE, this._transformHorizontally, this);
  }

  _updateTransformations() {
    this._transformVertically();
    this._transformHorizontally();
  }

  _transformVertically() {
    this.linesGroup.forEach(line => {
      let svgLine = this.svgLines[line.key];
      let matrix = this.linesGroup.getVerticalTransformForLine(this.viewBox, line);

      SVG.applyTransformationMatrix(svgLine, matrix);
    });
  }

  _transformHorizontally() {
    let matrix = this.linesGroup.getHorizontalTransform(this.viewBox);
    SVG.applyTransformationMatrix(this.linesContainer, matrix);
  }

  _onToggleLine(line) {
    let polyline = this.svgLines[line.key];
    polyline.classList.toggle('disabled');
  }
}

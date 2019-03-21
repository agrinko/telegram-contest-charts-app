import * as SVG from "../utils/svg.utils";
import {lineEvents, linesGroupEvents} from "../config";
import {findClosestIndex} from "../utils/array.utils";
import {format} from "../utils/date.utils";


export class Drawing {
  constructor([width, height], options) {
    this.paddingRel = options && options.padding || 0;
    this.padding = height * this.paddingRel;
    this.viewBox = [width, height - 2 * this.padding];

    this.svgContainer = SVG.elementFromString(
      `<svg viewBox="0 0 ${width} ${height - 2 * this.padding}" xmlns="http://www.w3.org/2000/svg" version="1.1"></svg>`
    );
    this.svgContainer.style.marginTop = this.padding + 'px';
  }

  resize([width, height]) {
    this.viewBox = [width, height];
    this.padding = height * this.paddingRel;
    this.svgContainer.setAttribute('viewBox', `0 0 ${width} ${height - 2 * this.padding}`);
    this.svgContainer.style.marginTop = this.padding + 'px';
  }

  appendTo(el) {
    el.appendChild(this.svgContainer);
  }

  drawLinesGroup(linesGroup) {
    this.linesGroup = linesGroup;
    this.svgLines = {};


    this.linesGroup.forEach(line => {
      this.svgLines[line.key] = SVG.createPolyline(line.svgPoints, line.color, {
        //[keyAttr]: line.key
      });

      // TODO: delete this
      this.svgLines[line.key].addEventListener('mouseover', (event) => {
        let bounds = this.svgContainer.getBoundingClientRect();
        let x = (event.clientX - bounds.left) / bounds.width;
        let i = findClosestIndex(line.axis.values, this.linesGroup.minX + x * (this.linesGroup.maxX - this.linesGroup.minX));

        console.log(`${line.key}: ${format(line.axis.values[i])}, ${line.values[i]}`);
      });

      line.events.subscribe(lineEvents.TOGGLE, this._onToggleLine, this);
    });

    this._transformLines();

    for (let key in this.svgLines)
      SVG.draw(this.svgContainer, this.svgLines[key]);

    this.linesGroup.events.subscribe(linesGroupEvents.UPDATE_RANGE, this._transformLines, this);
  }

  _transformLines() {
    this.linesGroup.forEach(line => {
      let svgLine = this.svgLines[line.key];
      let matrix = this.linesGroup.getTransformationMatrix(line, this.viewBox);

      SVG.applyTransformationMatrix(svgLine, matrix);
    });
  }

  _onToggleLine(line) {
    this.svgLines[line.key].classList.toggle('disabled'); // todo: hide line completely after animation
  }
}

import * as SVG from '../utils/svg.utils';
import {LinesGroup} from "./LinesGroup";
import {lineEvents, linesGroupEvents, previewEvents} from "../config";
import {Events} from "../utils/Events";
import {Slider} from "./Slider";


const keyAttr = 'data-key';

export class ChartPreview {
  constructor(element, lines, options) {
    this.el = element;
    this.axis = options.axis;
    this.events = new Events();
    this.linesGroup = new LinesGroup(lines);
    this.scale = this._getScaleByBounds(options.bounds) || [0.75, 1];

    this._createLayout();
    this._createSlider();
  }

  setViewBox(viewBox) {
    this.viewBox = viewBox;
    this.layout.svg.setAttribute('viewBox', `0 0 ${viewBox[0]} ${viewBox[1]}`);
    this.linesGroup.setViewBox(viewBox);
  }

  render() {
    this.svgLines = {};

    this.linesGroup.events.subscribe(linesGroupEvents.UPDATE_SCALE, this._transformLines, this);

    this.linesGroup.forEach(line => {
      this.svgLines[line.key] = SVG.createPolyline(line.svgPoints, line.color, {
        [keyAttr]: line.key
      });

      SVG.draw(this.layout.svg, this.svgLines[line.key]);

      line.events.subscribe(lineEvents.TOGGLE, this._onToggleLine, this);
    });

    this._transformLines();

    this.slider.setScale(this.scale);
  }

  _createLayout() {
    this.layout = {
      svg: SVG.generateSVGBox(this.viewBox || [1, 1])
    };

    this.el.appendChild(this.layout.svg);
  }

  _createSlider() {
    this.slider = new Slider(this.el, {
      onChange: (scale) => {
        this.events.next(previewEvents.UPDATE_BOUNDS, this._getBoundsByScale(scale));
      },
      onFinish: () => {
        this.events.next(previewEvents.FINISH_INTERACTION);
      }
    });
  }

  _transformLines() {
    for (let key in this.svgLines) {
      let svgLine = this.svgLines[key];
      let key = svgLine.getAttribute(keyAttr);
      let matrix = this.linesGroup.getTransformationMatrix(key);

      SVG.applyTransformationMatrix(svgLine, matrix);
    }
  }

  _onToggleLine(line) {
    this.svgLines[line.key].classList.toggle('disabled')
  }

  _getBoundsByScale(scale) {
    return [
      this.axis.min + scale[0] * (this.axis.max - this.axis.min),
      this.axis.min + scale[1] * (this.axis.max - this.axis.min)
    ];
  }

  _getScaleByBounds(bounds) {
    return [
      (bounds[0] - this.axis.min) / (this.axis.max - this.axis.min),
      (bounds[1] - this.axis.min) / (this.axis.max - this.axis.min)
    ];
  }
}

import {LinesGroup} from "../../tools/LinesGroup";
import {Slider} from "./Slider";
import {Drawing} from "../../tools/Drawing";
import {CHART_PREVIEW_PADDING} from "../../config";


export class ChartPreview {
  constructor(element, lines, options) {
    this.el = element;
    this.axis = options.axis;
    this.initialBounds = options.initialBounds;
    this.linesGroup = new LinesGroup(lines, {});
  }

  setViewBox([width, height]) {
    this.viewBox = [width, height];

    if (this.drawing)
      this.drawing.resize(this.viewBox);
  }

  draw() {
    this.drawing = new Drawing(this.viewBox, {
      padding: CHART_PREVIEW_PADDING
    });
    this.drawing.appendTo(this.el);

    this.slider = new Slider(this.el, {
      onChange: (scale) => {
        this.onUpdateBoundsCallback(this._getBoundsByScale(scale));
      },
      onFinish: () => {
        this.onFinishInteractionCallback();
      }
    });
  }

  renderData() {
    this.drawing.drawLinesGroup(this.linesGroup);
    this.slider.setScale(
      this._getScaleByBounds(this.initialBounds)
    );
  }

  onUpdateBounds(cb) {
    this.onUpdateBoundsCallback = cb;
  }

  onFinishInteraction(cb) {
    this.onFinishInteractionCallback = cb;
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

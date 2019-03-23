import {LinesGroup} from "../../tools/LinesGroup";
import * as DOM from '../../utils/dom.utils';
import {TIME_COMPARISON_PRECISION} from "../../config";
import {Axis} from "./Axis";
import {equals} from "../../utils/math.utils";
import {Scale} from "./Scale";
import {Drawing} from "../../tools/Drawing";
import {DataFlag} from "./DataFlag";


export class Chart {
  constructor(element, lines, options) {
    this.el = element;
    this.axis = options.axis;
    this.bounds = options.bounds;
    this.linesGroup = new LinesGroup(lines, {
      bounds: this.bounds
    });
  }

  setViewBox(viewBox) {
    this.viewBox = viewBox;

    if (this.drawing)
      this.drawing.resize(viewBox);
  }

  draw() {
    this.scaleContainer = DOM.elementFromString(
      `<div class="scale-container">
        <div class="x-axis"></div>
        <div class="y-scale"></div>
      </div>`
    );

    this.xAxis = new Axis(this.scaleContainer.firstElementChild, this.axis.values, {
      bounds: this.bounds
    });

    this.yScale = new Scale(this.scaleContainer.lastElementChild, this.linesGroup);

    this.el.appendChild(this.scaleContainer);

    this.drawing = new Drawing(this.viewBox, {
      onHover: (identifier, x) => {
        this.dataFlag.showAt(x, identifier);
      },
      onHoverEnd: (identifier) => {
        this.dataFlag.hide(identifier);
      }
    });

    this.dataFlag = new DataFlag(this.linesGroup, this.drawing);

    this.dataFlag.appendTo(this.el);
    this.drawing.appendTo(this.el);
  }

  renderData() {
    this.drawing.drawLinesGroup(this.linesGroup);

    this.xAxis.render(true);
    this.yScale.render();
  }

  setBounds(bounds) {
    if (equals(bounds[0], this.bounds[0], TIME_COMPARISON_PRECISION) &&
        equals(bounds[1], this.bounds[1], TIME_COMPARISON_PRECISION))
      return; // skip any actions if bounds did not actually change

    this.bounds = bounds;
    this.linesGroup.setHorizontalBounds(bounds);
    this.xAxis.setBounds(bounds);
  }

  finishInteraction() {
    this.xAxis.finishInteraction();
  }
}

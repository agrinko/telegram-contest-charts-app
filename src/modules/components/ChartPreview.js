import * as SVG from '../utils/svg.utils';
import * as DOM from '../utils/dom.utils';
import {LinesGroup} from "./LinesGroup";
import {lineEvents, linesGroupEvents} from "../config";


const keyAttr = 'data-key';

export class ChartPreview {
  constructor(element, lines, options) {
    this.el = element;
    this.viewBox = options.viewBox;
    this.linesGroup = new LinesGroup(lines, { viewBox: this.viewBox });
    this.horizontalScale = options.horizontalScale || [0.75, 1];
    this.onRescale = options.onRescale;
    this.onInteractionDone = options.onInteractionDone;

    this.linesGroup.events.subscribe(linesGroupEvents.UPDATE_SCALE, this._transformLines, this);

    this._createElement();
  }

  setViewBox(viewBox) {
    this.viewBox = viewBox;
    this.svgContainer.setAttribute('viewBox', `0 0 ${viewBox[0]} ${viewBox[1]}`);
    this.linesGroup.setViewBox(viewBox);
  }

  render() {
    this.svgLines = {};
    // SVG.setBounds(...);
    this.linesGroup.forEach(line => {
      this.svgLines[line.key] = SVG.createPolyline(line.svgPoints, line.color, {
        [keyAttr]: line.key
      });

      SVG.draw(this.svgContainer, this.svgLines[line.key]);

      line.events.subscribe(lineEvents.TOGGLE, this._onToggleLine, this);
    });


    this._transformLines();
    this._renderSlider();
  }

  _transformLines() {
    for (let key in this.svgLines) {
      let svgLine = this.svgLines[key];
      let key = svgLine.getAttribute(keyAttr);
      let matrix = this.linesGroup.getTransformationMatrix(key);

      SVG.applyTransformationMatrix(svgLine, matrix);
    }
  }

  _createElement() {
    this.slider = DOM.elementFromString(
      `<div class="sliding-window hidden">
        <div class="grip left-grip"></div>
        <div class="grip right-grip"></div>
      </div>`);
    this.svgContainer = SVG.generateSVGBox(this.viewBox);

    this.el.appendChild(this.slider);
    this.el.appendChild(this.svgContainer);
  }

  _onToggleLine(line) {
    this.svgLines[line.key].classList.toggle('disabled')
  }

  _renderSlider() {
    this.slider.classList.remove('hidden');
    const bounds = this.el.getBoundingClientRect();

    let prevLeft = bounds.width * this.horizontalScale[0],
        prevRight = bounds.width * this.horizontalScale[1];
    this.slider.style.left = prevLeft + 'px';
    this.slider.style.width = (prevRight - prevLeft) + 'px';

    let dragStartedAt = 0;
    let mode = 'move';

    this.slider.addEventListener('mousedown', (e) => {
      let sliderBounds = this.slider.getBoundingClientRect();
      dragStartedAt = e.clientX - sliderBounds.left;

      if (e.target.classList.contains('left-grip'))
        mode = 'left';
      else if (e.target.classList.contains('right-grip'))
        mode = 'right';
      else
        mode = 'move';

      console.log('mode', mode);
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', stopDD);
    });

    let self = this;
    function onMove(e) {
      let left, right;

      if (mode === 'right') {
        left = prevLeft;
        right = Math.min(bounds.width, e.clientX - bounds.left);
      } else if (mode === 'left') {
        left = Math.max(0, e.clientX - dragStartedAt - bounds.left);
        right = prevRight;
      } else {
        left = Math.max(0, e.clientX - dragStartedAt - bounds.left);
        left = Math.min(left, bounds.width - (prevRight - prevLeft));
        right = left + prevRight - prevLeft;
      }

      self.slider.style.left = left + 'px';
      self.slider.style.width = (right - left) + 'px';
      this.horizontalScale = [left/bounds.width, right/bounds.width];
      self.onRescale(this.horizontalScale);

      prevLeft = left;
      prevRight = right;
    }

    function  stopDD() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', stopDD);

      self.onInteractionDone();
    }
  }
}

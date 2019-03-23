import * as DOM from '../../utils/dom.utils';
import {ceilToMultiplier, equals, round, roundToMultiplier} from "../../utils/math.utils";
import {format} from "../../utils/date.utils";
import {MINIMAL_TIME_STEP, TIME_COMPARISON_PRECISION, ONE_DAY} from "../../config";


export class Axis {
  constructor(values, options) {
    this.values = values;
    this.bounds = options.bounds;
    this.width = options.viewBox[0] || 1;
    this.nSteps = this._getNumberOfSteps();
  }

  appendTo(container) {
    this._createElement();
    container.appendChild(this.el);
  }

  setBounds(bounds) {
    let oldBounds = this.bounds;
    this.bounds = bounds;
    this._move(bounds[0] - oldBounds[0], bounds[1] - oldBounds[1]);
  }

  resize(viewBox) {
    this.width = viewBox[0];
    this.nSteps = this._getNumberOfSteps();
    this.render();
  }

  render() {
    this._createLabels();
    this._renderLabels();
  }

  _createElement() {
    this.el = DOM.elementFromString(`<div class="x-axis"></div>`);
  }

  _createLabels() {
    let [lo, hi] = this.bounds;
    let diff = hi -lo;
    let step = Math.max(MINIMAL_TIME_STEP / 24, diff / this.nSteps);

    this.labels = [];
    this.step = step;

    for (let t = lo - step; t <= hi + step; t += step) {
      this.labels.push(this._createLabel(t));
    }

    console.log(this.labels);
  }

  _createLabel(t) {
    let diff = this.bounds[1] - this.bounds[0];

    return {
      t,
      opacity: 1,
      text: format(t), // TODO: optimize to only call format() if day is different; show hours when needed
      left: (t - this.bounds[0]) / diff,
      diff
    };
  }

  _move(deltaLo, deltaHi) {
    let [lo, hi] = this.bounds;
    let diff = hi -lo;
    let step = this.step;

    this.labels.forEach(l => {
      l.left = (l.t - this.bounds[0]) / diff;
    });

    for (let t = this.labels[0].t - step; t >= lo - step; t -= step) {
      this.labels.unshift(this._createLabel(t));
    }

    for (let t = this.labels[this.labels.length - 1].t + step; t <= hi + step; t += step) {
      this.labels.push(this._createLabel(t));
    }

    let labelsVisible = this.labels.filter(l => l.opacity > 0.5);
    let ll = labelsVisible.length - 3;

console.log(`ll: ${ll}, nSteps: ${this.nSteps}`);
      this.labels.forEach((l, i) => {
        if (i%2 == 0)
          l.opacity = 2 - ll / this.nSteps;
      });


    // let x1 = this.labels[1].t;

    this._renderLabels();
  }

  _renderLabels() {
    let html = '';

    this.labels.forEach(l => {
      let tx = Math.max(0, Math.min(100, l.left * 100));
      html += `<div class="label" style="left: ${l.left * 100}%; opacity: ${l.opacity}; transform: translateX(${-tx}%)">${l.text}</div>`;
    });

    this.el.innerHTML = html;
  }

  _getNumberOfSteps() {
    return Math.floor(0.7 * Math.pow(this.width, 1/3)) || 1;
  }
}

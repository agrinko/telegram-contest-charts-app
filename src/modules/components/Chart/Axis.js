import * as DOM from '../../utils/dom.utils';
import {equals, roundToMultiplier} from "../../utils/math.utils";
import {beginningOfDay, format} from "../../utils/date.utils";
import {MINIMAL_TIME_STEP, TIME_COMPARISON_PRECISION, ONE_DAY} from "../../config";


export class Axis {
  constructor(element, values, options) {
    this.el = element;
    this.values = values;

    // assuming values are sorted
    this.min = values[0];
    this.max = values[values.length - 1];

    this.bounds = options.bounds;

    this._resetDailyBounds();
  }

  setBounds(bounds) {
    const prevBounds = this.bounds;
    this.bounds = bounds;

    if (equals(bounds[1] - bounds[0], prevBounds[1] - prevBounds[0], TIME_COMPARISON_PRECISION)) {
      this.leftDirection = false;//bounds[1] - prevBounds[1] < 0;
      this.render();
    } else {
      this.leftDirection = equals(bounds[1], prevBounds[1], TIME_COMPARISON_PRECISION);
      this.render(); // todo
    }
  }

  render(reset) {
    let step = this._getReasonableTimeStep(this.boundsAsDays[1] - this.boundsAsDays[0]);
    let deltaAcc1 = this.bounds[0] - this.boundsAsDays[0];
    let n1 = Math.round(deltaAcc1 / step);
    let deltaAcc2 = this.bounds[1] - this.boundsAsDays[1];
    let n2 = Math.round(deltaAcc2 / step);

    this.boundsAsDays[0] = this.boundsAsDays[0] + n1 * step;
    this.boundsAsDays[1] = this.boundsAsDays[1] + n2 * step;

    let labels = this._getLabels(reset);
    let html = '';

    for (let key in labels) {
      let tX = -100 * Math.max(0, Math.min(1, labels[key].left));
      html += `<div class="label" style="left: ${labels[key].left * 100}%; transform: translateX(${tX}%)" data-key="${key}">${labels[key].text}</div>`;
    }

    this.el.innerHTML = html;
  }

  finishInteraction() {
    this._resetDailyBounds();
    this.render(true);
  }

  _getLabels(reset) {
    let diff = this.bounds[1] - this.bounds[0];
    let step = reset || !this.prevStep ? this._getReasonableTimeStep(diff) : this.prevStep;


    if (diff / step > this.stepsNumber * 2) {
      step = step << 1;
    } else if (diff / step < this.stepsNumber / 2) {
      step = step >> 1;
    }

    this.prevStep = step;
    let a, b;

    a = this.boundsAsDays[0] - step;
    b = this.boundsAsDays[1] + step;

    let labels = {};
    for (let t = this.leftDirection ? b : a; t >= a && t <= b; t += this.leftDirection ? -step : step)
      labels[t] = {
        text: format(roundToMultiplier(t, ONE_DAY)),
        left: (t - this.bounds[0]) / diff
      };

    return labels;
  }

  _getReasonableTimeStep(diff) {
    let desiredNumberOfSteps = Math.floor(0.7 * Math.pow(this.el.clientWidth, 1/3));
    let n = diff / ONE_DAY;
    //
    // let x1 = n % desiredNumberOfSteps;
    // let x2 = n % (desiredNumberOfSteps + 1);
    // let x3 = n % (desiredNumberOfSteps - 1);
    //
    // if (x2 < x1) {
    //   desiredNumberOfSteps = desiredNumberOfSteps + 1;
    //
    //   if (x3 < x2) {
    //     desiredNumberOfSteps = desiredNumberOfSteps - 2;
    //   }
    // } else {
    //   if (x3 < x1)
    //     desiredNumberOfSteps = desiredNumberOfSteps - 1;
    // }

    this.stepsNumber = desiredNumberOfSteps;

    return Math.max(MINIMAL_TIME_STEP, diff / this.stepsNumber);
  }

  _resetDailyBounds() {
    this.boundsAsDays = [
      +this.bounds[0],
      +this.bounds[1]
    ];
  }
}
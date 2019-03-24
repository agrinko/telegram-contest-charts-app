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

    this.nodes = [{
      x: lo,
      left: 0,
      step
    }, {
      x: hi,
      left: 1,
      step
    }];

    this.fillNodes(this.nodes[0], this.nodes[1], step);

    // this.labels = [];
    // this.step = step;
    //
    // for (let t = lo - step; t <= hi + step; t += step) {
    //   this.labels.push(this._createLabel(t));
    // }

    console.log(this.nodes, step);
  }

  fillNodes(n1, n2, step) {
    let [lo, hi] = this.bounds;
    let diff = hi -lo;

    if (n2.x - n1.x > step * 0.75) {
      let nNew = {
        x: (n2.x + n1.x) / 2,
        parentL: n1,
        parentR: n2,
        prev: n1,
        next: n2,
        step: step,
        left: ((n2.x + n1.x) / 2 - this.bounds[0]) / diff,
      };
      n1.next = nNew;
      n2.prev = nNew;
      this.nodes.push(nNew);

      this.fillNodes(n1, nNew, step);
      this.fillNodes(nNew, n2, step);
    }
  }

  _createLabel(node) {
    let [lo, hi] = this.bounds;
    let diff = hi -lo;
    let step = Math.max(MINIMAL_TIME_STEP / 24, diff / this.nSteps);
    let distanceToParent = node.parentL ? node.x - node.parentL.x : step;

    return {
      t: node.x,
      opacity: Math.max(0, Math.min(1, 2 * distanceToParent / step - 1)),
      text: format(node.x), // TODO: optimize to only call format() if day is different; show hours when needed
      left: node.left,
      diff
    };
  }

  _move(deltaLo, deltaHi) {
    let [lo, hi] = this.bounds;
    let diff = hi -lo;
    let step = Math.max(MINIMAL_TIME_STEP / 24, diff / this.nSteps);

    let leftNode, rightNode;

    this.nodes.forEach(node => {
      node.left = (node.x - lo) / diff;
      if (!leftNode || leftNode.left > node.left)
        leftNode = node;
      if (!rightNode || rightNode.left < node.left)
        rightNode = node;
    });

    let actualStep = leftNode.step;

    if (leftNode.x >= lo + actualStep) {
      let ddd = rightNode.x - leftNode.x;
      let newX = leftNode.x - ddd;
      let newNode = {
        x: newX,
        left: (newX - lo) / diff,
        step: actualStep
      };
      this.nodes.push(newNode);
      leftNode.parentR = rightNode;
      leftNode.parentL = newNode;
      this.fillNodes(newNode, leftNode, actualStep);
    }
    //
    // actualStep = rightNode.step;
    // if (rightNode.x <= lo - actualStep/2) {
    //   let newX = rightNode.x + 2 * actualStep;
    //   let newNode = {
    //     x: newX,
    //     left: (newX - lo) / diff,
    //     prev: rightNode,
    //     step: actualStep
    //   };
    //   this.nodes.push(newNode);
    //   this.fillNodes(rightNode, newNode, actualStep);
    // }

    this._renderLabels();
  }

  _renderLabels() {
    this.nodes.forEach(node => {
      let l = this._createLabel(node);
      let tx = Math.max(0, Math.min(100, l.left * 100));
      let el = DOM.elementFromString(`<div class="label" style="left: ${l.left * 100}%; opacity: ${l.opacity}; transform: translateX(${-tx}%)">${l.text}</div>`);

      if (node.el)
        this.el.removeChild(node.el);

      node.el = el;
      this.el.appendChild(el);
    });

  }

  _getNumberOfSteps() {
    return Math.floor(0.7 * Math.pow(this.width, 1/3)) || 1;
  }
}

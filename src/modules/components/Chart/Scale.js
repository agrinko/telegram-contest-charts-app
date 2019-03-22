import {linesGroupEvents} from "../../config";

export class Scale {
  constructor(element, linesGroup) {
    this.el = element;
    this.linesGroup = linesGroup;

    this.linesGroup.events.subscribe(linesGroupEvents.UPDATE_Y_RANGE, this.render, this);
  }

  render() {
    // TODO: check if yRange has actually changed
    let html = '';
    let nRows = 5;
    let min = this.linesGroup.minY * .9,
        max = this.linesGroup.maxY * 1.1;
    let step = (max - min) / (nRows + 0.5);

    for (let i = min; i < max; i += step) {
      html += `<div class="grid-line ${i === min ? 'edge' : ''}" style="bottom: ${(i - min) / (max - min) * 100}%">${Math.round(i)}</div>`
    }

    this.el.innerHTML = html;
  }
}

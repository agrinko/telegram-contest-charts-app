/**
 * @typedef {[number, number]} Point - [x, y]
 * @typedef {[number, number]} Bounds - [min, max]
 * @typedef {[number, number]} ViewBox - [width, height]
 * @typedef {[number, number, number, number, number, number]} TransformationMatrix - [a, b, c, d, tx, ty]
 */

import { ChartBox } from './components/ChartBox';

export function startApp(data) {
  const container = document.getElementById('charts-container');

  data.forEach(chartData => {
    const el = document.createElement('div');
    container.appendChild(el);

    let chart = new ChartBox(el, chartData);

    setTimeout(() => {
      chart.render();
    }, 0);
  });
}

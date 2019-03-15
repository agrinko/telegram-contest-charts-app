/**
 * @typedef {[number, number]} Point - [x, y]
 * @typedef {[number, number]} Bounds - [min, max]
 * @typedef {[number, number]} ViewBox - [width, height]
 * @typedef {{key: string, values: Array<number> }} Axis
 * @typedef {[number, number, number, number, number, number]} TransformationMatrix - [a, b, c, d, tx, ty]
 */

import { Chart } from './components/Chart';

export function startApp(data) {
  const container = document.getElementById('charts-container');

  data.forEach(chartData => {
    const el = document.createElement('DIV');
    container.appendChild(el);

    let chart = new Chart(el, chartData);

    setTimeout(() => {
      chart.render();
    }, 1000);
  });
}

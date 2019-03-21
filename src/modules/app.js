/**
 * @typedef {[number, number]} Point - [x, y]
 * @typedef {[number, number]} Bounds - [min, max]
 * @typedef {[number, number]} ViewBox - [width, height]
 * @typedef {[number, number, number, number, number, number]} TransformationMatrix - [a, b, c, d, tx, ty]
 */

import { ChartBox } from './components/ChartBox';

export function startApp(data) {
  const container = document.getElementById('charts-container');

  let charts = data.map((chartData, i) => {
    const el = document.createElement('div');
    el.className = 'chart-box';
    container.appendChild(el);


    return new ChartBox(el, chartData, `Chart #${i + 1}`);
  });

  charts.forEach(chart => chart.render());

  window.addEventListener('resize', () => {
    charts.forEach(chart => chart.resize());
  });
}

/**
 * @typedef {[number, number]} Point - [x, y]
 * @typedef {[number, number]} Bounds - [min, max]
 * @typedef {[number, number]} ViewBox - [width, height]
 * @typedef {[number, number, number, number, number, number]} TransformationMatrix - [a, b, c, d, tx, ty]
 */

import { ChartBox } from './components/ChartBox';
import {THEMES} from './config';


const switcher = document.getElementById('theme-switcher');

export function startApp(data) {
  setTheme(THEMES[0]);

  const container = document.getElementById('root');

  let charts = data.map((chartData, i) => {
    const el = document.createElement('div');
    el.className = 'chart-box';
    container.appendChild(el);


    return new ChartBox(el, chartData, `Chart Title #${i + 1}`);
  });

  charts.forEach(chart => chart.render());


  window.addEventListener('resize', () => {
    charts.forEach(chart => chart.resize());
  });

  switcher.addEventListener('click', () => {
    setTheme(document.body.getAttribute('data-theme') === 'day' ? 'night' : 'day');
  });
}

function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  switcher.firstElementChild.innerText = theme === THEMES[0] ? THEMES[1] : THEMES[0];
}

import {seriesTypes, REFERENCE_VIEW_BOX} from '../config';
import {ChartPreview} from './ChartPreview';
import {Line} from "./Line";
import {Chart} from "./Chart";
import {ChartLegend} from "./ChartLegend";


export class ChartBox {
  constructor(element, data) {
    this.el = element;
    this.el.className = 'chart-box';
    this.title = 'Chart';

    this._prepareData(data);
    this._createLayout();
  }

  render() {
    this.chart.render();
    this.preview.render();
    this.legend.render();
  }

  _prepareData({columns, types, names, colors}) {
    this.lines = [];

    let axisCol = columns.find(column => types[column[0]] === seriesTypes.AXIS);

    this.axis = {
      key: axisCol[0],
      values: axisCol.slice(1)
    };

    columns.forEach(column => {
      const [key, ...values] = column;

      if (types[key] === seriesTypes.LINE)
        this.lines.push(new Line(values, {
          key,
          axis: this.axis,
          name: names[key],
          color: colors[key],
          viewBox: REFERENCE_VIEW_BOX
        }));
    });
  }

  _createLayout() {
    this.el.innerHTML =
      `<h2 class="chart-title">${this.title}</h2>
       <div class="chart"></div>
       <div class="chart-preview"></div>
       <div class="chart-legend"></div>`;

    const [title, chart, preview, legend] = this.el.children;

    this.layout = {
      title,
      chart,
      preview,
      legend
    };

    this.preview = new ChartPreview(preview, this.lines, {
      viewBox: [100, 20]
    });

    this.chart = new Chart(chart, this.lines, {
      axis: this.axis,
      viewBox: [345, 70]
    });

    this.legend = new ChartLegend(legend, this.lines, {
      onToggle: (key, state) => {
        this.lines.find(l => l.key === key).toggle(state);
      }
    });
  }
}

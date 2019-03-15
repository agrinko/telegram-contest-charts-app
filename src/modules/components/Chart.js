import {seriesTypes, SVG_VIEW_BOX} from '../config';
import {ChartPreview} from './ChartPreview';
import {Line} from "./Line";


export class Chart {
  constructor(element, data) {
    this.el = element;
    this.el.className = 'chart';
    this.title = 'Chart';

    this._prepareData(data);
    this._createLayout();
  }

  render() {
    this._renderPreview();
    //this.renderChartContainer();
    //this.renderContent();
    //this.renderLegend();
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
          viewBox: SVG_VIEW_BOX
        }));
    });
  }

  _createLayout() {
    this.el.innerHTML =
      `<h2 class="chart-title">${this.title}</h2>
       <div class="chart-container"></div>
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
      viewBox: SVG_VIEW_BOX
    });
  }

  _renderPreview() {
    this.preview.render();
  }
}

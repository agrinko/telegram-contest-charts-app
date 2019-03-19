import {seriesTypes, REFERENCE_VIEW_BOX, DEFAULT_DATE_RANGE, previewEvents} from '../config';
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
  }

  render() {
    this.draw();
    this.resize();

    this.chart.renderData();
    this.preview.renderData();
    this.legend.renderData();
  }

  draw() {
    this._createLayout();
    this._createComponents();
    this._connectChartWithPreview();

    this.chart.draw();
    this.preview.draw();
  }

  resize() {
    this.chart.setViewBox([this.layout.chart.clientWidth, this.layout.chart.clientHeight]);
    this.preview.setViewBox([this.layout.preview.clientWidth, this.layout.preview.clientHeight]);
  }

  _prepareData({columns, types, names, colors}) {
    this.lines = [];

    let axisCol = columns.find(column => types[column[0]] === seriesTypes.AXIS);

    this.axis = {
      key: axisCol[0],
      values: axisCol.slice(1),
      min: axisCol[1],
      max: axisCol[axisCol.length - 1]
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
  }

  _createComponents() {
    const initialBounds = this._getInitialBounds();

    this.preview = new ChartPreview(this.layout.preview, this.lines, {
      axis: this.axis,
      bounds: initialBounds
    });

    this.chart = new Chart(this.layout.chart, this.lines, {
      axis: this.axis,
      bounds: initialBounds
    });

    this.legend = new ChartLegend(this.layout.legend, this.lines);
  }

  _connectChartWithPreview() {
    this.preview.events.subscribe(previewEvents.UPDATE_BOUNDS, (bounds) => {
      this.chart.setBounds(bounds);
    });

    this.preview.events.subscribe(previewEvents.FINISH_INTERACTION, () => {
      this.chart.finishInteraction();
    });
  }

  _getInitialBounds() {
    return [
      Math.max(this.axis.min, this.axis.max - DEFAULT_DATE_RANGE),
      this.axis.max
    ];
  }
}

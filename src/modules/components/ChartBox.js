import {seriesTypes, REFERENCE_VIEW_BOX, DEFAULT_POINTS_TO_DISPLAY, previewEvents} from '../config';
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

  render() { // TODO: fix rendering when changing orientation
    this.chart.setViewBox([this.layout.chart.clientWidth, this.layout.chart.clientHeight]);
    this.preview.setViewBox([this.layout.preview.clientWidth, this.layout.preview.clientHeight]);
    this.chart.render();
    this.preview.render();
    this.legend.render();
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
    const initialBounds = this._getInitialBounds();

    this.layout = {
      title,
      chart,
      preview,
      legend
    };

    this.preview = new ChartPreview(preview, this.lines, {
      axis: this.axis,
      bounds: initialBounds
    });

    this.chart = new Chart(chart, this.lines, {
      axis: this.axis,
      bounds: initialBounds
    });

    this.legend = new ChartLegend(legend, this.lines);

    this._connectChartWithPreview();
  }

  _getInitialBounds() {
    const nPoints = Math.min(DEFAULT_POINTS_TO_DISPLAY, this.axis.values.length);
    const pointsToDisplay = this.axis.values.slice(-nPoints);

    return [pointsToDisplay[0], pointsToDisplay[pointsToDisplay.length - 1]];
  }

  _connectChartWithPreview() {
    this.preview.events.subscribe(previewEvents.UPDATE_BOUNDS, (bounds) => {
      this.chart.setBounds(bounds);
    });

    this.preview.events.subscribe(previewEvents.FINISH_INTERACTION, () => {
      this.chart.finishInteraction();
    });
  }
}

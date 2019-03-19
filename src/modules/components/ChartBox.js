import {seriesTypes, REFERENCE_VIEW_BOX, DEFAULT_POINTS_TO_DISPLAY} from '../config';
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
      viewBox: REFERENCE_VIEW_BOX,
      horizontalScale: this._getScaleByBounds(initialBounds),
      onRescale: (scale) => {
        let bounds = this._getBoundsByScale(scale);
        this.chart.setBounds(bounds);
      },
      onInteractionDone: () => {
        this.chart.finishInteraction();
      }
    });

    this.chart = new Chart(chart, this.lines, {
      axis: this.axis,
      viewBox: REFERENCE_VIEW_BOX,
      horizontalBounds: initialBounds
    });

    this.legend = new ChartLegend(legend, this.lines, {
      onToggle: (key, state) => {
        this.lines.find(l => l.key === key).toggle(state);
      }
    });
  }

  _getBoundsByScale(scale) {
    return [
      this.axis.min + scale[0] * (this.axis.max - this.axis.min),
      this.axis.min + scale[1] * (this.axis.max - this.axis.min)
    ];
  }

  _getScaleByBounds(bounds) {
    return [
      (bounds[0] - this.axis.min) / (this.axis.max - this.axis.min),
      (bounds[1] - this.axis.min) / (this.axis.max - this.axis.min)
    ];
  }

  _getInitialBounds() {
    const nPoints = Math.min(DEFAULT_POINTS_TO_DISPLAY, this.axis.values.length);
    const pointsToDisplay = this.axis.values.slice(-nPoints);

    return [pointsToDisplay[0], pointsToDisplay[pointsToDisplay.length - 1]];
  }
}

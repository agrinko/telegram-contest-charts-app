import { elementFromString } from '../utils/dom.utils';


export class ChartLegend {
  constructor(element, lines) {
    this.el = element;
    this.lines = lines;
    this.values = lines.map(line => ({
      key: line.key,
      label: line.name,
      enabled: line.enabled
    }));
  }

  render() {
    this.values.forEach(item => {
      let button = elementFromString(
        `<div class="legend-button">
          <label>
            <input type="checkbox" value="${item.key}" ${item.enabled ? 'checked="checked"' : ''} />
            <span>${item.label}</span>
          </label>
         </div>`
      );

      button.querySelector('input').addEventListener('change', (event) => {
        let line = this.lines.find(l => l.key === event.target.value);
        line.toggle();
      });

      this.el.appendChild(button);
    });
  }
}

import { elementFromString } from '../utils/dom.utils';


export class ChartLegend {
  constructor(element, lines, options) {
    this.el = element;
    this.values = lines.map(line => ({
      key: line.key,
      label: line.name,
      enabled: line.enabled
    }));

    this.onToggle = options.onToggle;
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
        let input = event.target;
        this.onToggle(input.value, input.checked);
      });

      this.el.appendChild(button);
    });
  }
}

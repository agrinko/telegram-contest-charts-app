import * as DOM from "../utils/dom.utils";


export class Slider {
  constructor(parent, options) {
    this.parent = parent;
    this.onChange = options.onChange;
    this.onFinish = options.onFinish;
    this.scale = [0, 1];
  }

  setScale(scale) {
    if (!this.rendered)
      this._render();

    this.scale = scale;
    this._renderSlider();
  }
  
  _render() {
    this.slidingWindow = DOM.elementFromString(
      `<div class="sliding-window">
        <div class="grip left-grip"></div>
        <div class="grip right-grip"></div>
      </div>`);

    this.coverLeft = DOM.elementFromString(`<div class="cover cover-left"></div>`);
    this.coverRight = DOM.elementFromString(`<div class="cover cover-right"></div>`);

    this.parent.appendChild(this.coverLeft);
    this.parent.appendChild(this.coverRight);
    this.parent.appendChild(this.slidingWindow);

    this.rendered = true;
  }

  _renderSlider() {
    const bounds = this.parent.getBoundingClientRect();

    let prevLeft = bounds.width * this.scale[0],
      prevRight = bounds.width * this.scale[1];
    this.slidingWindow.style.left = prevLeft + 'px';
    this.slidingWindow.style.width = (prevRight - prevLeft) + 'px';

    this.coverLeft.style.width = prevLeft + 'px';
    this.coverRight.style.left = prevRight + 'px';

    let dragStartedAt = 0;
    let mode = 'move';

    this.slidingWindow.addEventListener('mousedown', (e) => {
      let sliderBounds = this.slidingWindow.getBoundingClientRect();
      dragStartedAt = e.clientX - sliderBounds.left;

      if (e.target.classList.contains('left-grip'))
        mode = 'left';
      else if (e.target.classList.contains('right-grip'))
        mode = 'right';
      else
        mode = 'move';

      console.log('mode', mode);
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', stopDD);
    });

    let self = this;
    function onMove(e) {
      let left, right;

      if (mode === 'right') {
        left = prevLeft;
        right = Math.min(bounds.width, e.clientX - bounds.left);
      } else if (mode === 'left') {
        left = Math.max(0, e.clientX - dragStartedAt - bounds.left);
        right = prevRight;
      } else {
        left = Math.max(0, e.clientX - dragStartedAt - bounds.left);
        left = Math.min(left, bounds.width - (prevRight - prevLeft));
        right = left + prevRight - prevLeft;
      }

      self.slidingWindow.style.left = left + 'px';
      self.slidingWindow.style.width = (right - left) + 'px';
      self.coverLeft.style.width = left + 'px';
      self.coverRight.style.left = right + 'px';
      self.scale = [left/bounds.width, right/bounds.width];

      self.onChange(self.scale);

      prevLeft = left;
      prevRight = right;
    }

    function  stopDD() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', stopDD);

      self.onFinish();
    }
  }
}

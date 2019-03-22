import * as DOM from "../../utils/dom.utils";


export class Slider {
  constructor(parent, options) {
    this.parent = parent;
    this.onChange = options.onChange;
    this.onFinish = options.onFinish;
    this.scale = [0, 1];
    this.minScaleWidth = options.minScaleWidth || 0.01;
  }

  setScale(scale) {
    if (!this.rendered)
      this._render();

    this.scale = scale;
    this._updateSlidingWindow();
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

    this._makeDraggable();
  }

  _updateSlidingWindow() {
    this.slidingWindow.style.left = this.scale[0] * 100 + '%';
    this.slidingWindow.style.width = (this.scale[1] - this.scale[0]) * 100 + '%';

    this.coverLeft.style.width = this.scale[0] * 100 + '%';
    this.coverRight.style.left = this.scale[1] * 100 + '%';
  }

  _makeDraggable() {
    let bounds, deltaX, mode;

    let onStart = (e) => {
      bounds = this.parent.getBoundingClientRect();
      this.parent.classList.add('moving');

      let sliderBounds = this.slidingWindow.getBoundingClientRect();
      let clientX = e.clientX || e.targetTouches && e.targetTouches[0].pageX || 0;

      deltaX = clientX - sliderBounds.left;

      if (e.target.classList.contains('left-grip'))
        mode = 'left';
      else if (e.target.classList.contains('right-grip'))
        mode = 'right';
      else
        mode = 'move';

      document.addEventListener('mousemove', onMove);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('mouseup', stopDD);
      document.addEventListener('touchend', stopDD);
    };

    let onMove = (e) => {
      let clientX = e.clientX || e.targetTouches && e.targetTouches[0].pageX || 0;
      let [left, right] = this.scale;
      let width = right - left;

      if (mode === 'right') {
        right = Math.min(1, (clientX - bounds.left) / bounds.width);
        right = Math.max(left + this.minScaleWidth, right);
      } else if (mode === 'left') {
        left = Math.max(0, (clientX - deltaX - bounds.left) / bounds.width);
        left = Math.min(right - this.minScaleWidth, left);
      } else {
        left = Math.max(0, (clientX - deltaX - bounds.left) / bounds.width);
        left = Math.min(1 - width, left);
        right = Math.min(1, left + width);
      }

      this.scale = [left, right];
      this._updateSlidingWindow();

      this.onChange(this.scale);

      e.preventDefault();
    };

    let stopDD = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('mouseup', stopDD);
      document.removeEventListener('touchend', stopDD);

      this.parent.classList.remove('moving');

      this.onFinish();
    };

    this.slidingWindow.addEventListener('mousedown', onStart);
    this.slidingWindow.addEventListener('touchstart', onStart);
  }
}

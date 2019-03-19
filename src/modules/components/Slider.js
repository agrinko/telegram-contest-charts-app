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

  _renderSlider() { // TODO: refactor! avoid assigning similar event listeners
    // TODO: add zooming gesture! (moving left and right with 2 fingers)
    const bounds = this.parent.getBoundingClientRect();

    let prevLeft = bounds.width * this.scale[0],
      prevRight = bounds.width * this.scale[1];
    this.slidingWindow.style.left = prevLeft/bounds.width * 100 + '%';
    this.slidingWindow.style.width = (prevRight - prevLeft)/bounds.width * 100 + '%';

    this.coverLeft.style.width = prevLeft/bounds.width * 100 + '%';
    this.coverRight.style.left = prevRight/bounds.width * 100 + '%';

    let dragStartedAt = 0;
    let mode = 'move';

    let onStart = (e) => {
      let sliderBounds = this.slidingWindow.getBoundingClientRect();
      let clientX = e.clientX || e.targetTouches[0].pageX;
      dragStartedAt = clientX - sliderBounds.left;

      if (e.target.classList.contains('left-grip'))
        mode = 'left';
      else if (e.target.classList.contains('right-grip'))
        mode = 'right';
      else
        mode = 'move';

      document.addEventListener('mousemove', onMove);
      document.addEventListener('touchmove', onMove);
      document.addEventListener('mouseup', stopDD);
      document.addEventListener('touchend', stopDD);
    };

    this.slidingWindow.addEventListener('mousedown', onStart);
    this.slidingWindow.addEventListener('touchstart', onStart);

    let self = this;
    function onMove(e) {
      let left, right;
      let clientX = e.clientX || e.targetTouches[0].pageX;

       if (mode === 'right') {
        left = prevLeft;
        right = Math.min(bounds.width, clientX - bounds.left);
      } else if (mode === 'left') {
        left = Math.max(0, clientX - dragStartedAt - bounds.left);
        right = prevRight;
      } else {
        left = Math.max(0, clientX - dragStartedAt - bounds.left);
        left = Math.min(left, bounds.width - (prevRight - prevLeft));
        right = left + prevRight - prevLeft;
      }

      self.slidingWindow.style.left = left/bounds.width * 100 + '%';
      self.slidingWindow.style.width = (right - left)/bounds.width * 100 + '%';
      self.coverLeft.style.width = left/bounds.width * 100 + '%';
      self.coverRight.style.left = right/bounds.width * 100 + '%';
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

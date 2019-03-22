import { round } from "./math.utils";

/**
 * Convert array of Point objects into a string for SVG <path> element points
 * @param {Array<Point>} points
 * @param {ViewBox} viewBox
 * @returns string
 */
export function toPathPoints(points, viewBox) {
  return 'M' + points.map(([x, y]) => {
    return `${round(x, 2)},${round(viewBox[1] - y, 2)}`;
  }).join(' L');
}

export function draw(svgContainer, element) {
  svgContainer.appendChild(element);
}

/**
 * Create SVG <path> element
 * @param {string} points
 * @param {string?} color
 * @returns {SVGElement}
 */
export function createPath(points, color = '#000000') {
  let el = elementFromString(
    `<path d="${points}" stroke="${color}" vector-effect="non-scaling-stroke"/>`
  );

  return el;
}

/**
 * Create DOM element from HTML string
 * @param {string} html
 * @returns {SVGElement}
 */
export function elementFromString(html) {
  let tmpl = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  tmpl.innerHTML = html.trim();
  return tmpl.firstChild;
}

/**
 * Apply 2D CSS transformation given by matrix
 * @param {SVGElement} el
 * @param {TransformationMatrix} matrix
 */
export function applyTransformationMatrix(el, matrix) {
  el.style.mozTransform = `matrix(${matrix.join(',')})`;
  el.style.webkitTransform = `matrix(${matrix.join(',')})`;
  el.style.transform = `matrix(${matrix.join(',')})`;
}

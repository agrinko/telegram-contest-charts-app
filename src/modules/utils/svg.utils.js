import { round } from "./math.utils";

/**
 * Convert array of Point objects into a string for SVG <polyline> element points
 * @param {Array<Point>} points
 * @param {ViewBox} viewBox
 * @returns string
 */
export function toPolylinePoints(points, viewBox) {
  return points.map(([x, y]) => {
    return `${round(x, 2)},${round(viewBox[1] - y, 2)}`;
  }).join(' ');
}

export function draw(svgContainer, element) {
  svgContainer.appendChild(element);
}

/**point[0]
 * Create SVG container element
 * @param {ViewBox} viewBox
 * @returns {SVGElement}
 */
export function generateSVGBox(viewBox) {
  return elementFromString(
    `<svg viewBox="0 0 ${viewBox[0]} ${viewBox[1]}"
                xmlns="http://www.w3.org/2000/svg" version="1.1"></svg>`
  );
}

/**
 * Create SVG <polyline> element
 * @param {string} points
 * @param {string?} color
 * @param {Object?} attributes
 * @returns {SVGElement}
 */
export function createPolyline(points, color = '#000000', attributes = {}) {
  let el = elementFromString(
    `<polyline points="${points}" stroke="${color}"/>`
  );

  for (let key in attributes)
    el.setAttribute(key, attributes[key]);

  return el;
}

/**
 * Create SVG <line> element
 * @param {string} points
 * @param {Object?} attributes
 * @returns {SVGElement}
 */
export function createLine(points, attributes = {}) {
  let el = elementFromString(
    `<line x1="${points[0][0]}" y1="${points[0][1]}" x2="${points[1][0]}" y2="${points[1][1]}" />`
  );

  for (let key in attributes)
    el.setAttribute(key, attributes[key]);

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
  el.style.transform = `matrix(${matrix.join(',')})`;
}

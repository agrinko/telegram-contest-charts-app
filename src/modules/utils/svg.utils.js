/**
 * Convert array of Point objects into a string for SVG <polyline> element points
 * @param {Array<Point>} points
 * @returns string
 */
export function toPolylinePoints(points) {
  return points.map(([x, y]) => `${Math.round(x * 100) / 100},${Math.round(y * 100) / 100}`).join(' ');
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
    `<svg viewBox="0 0 ${viewBox[0]} ${viewBox[1]}" preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg" version="1.1"></svg>`
  );
}

/**
 * Create SVG <polyline> element
 * @param {string} points
 * @param {string} color
 * @returns {SVGElement}
 */
export function createPolyline(points, color = '#000000') {
  return elementFromString(
    `<polyline points="${points}" stroke="${color}"/>`
  );
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

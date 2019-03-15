/**
 * Get {min, max} range of the array of numeric values
 * @param {Array<number>} values
 * @returns {Array<number>} - array of 2 elements
 */
export function getRange(values) {
  if (values.length > 0) {
    let min = Infinity;
    let max = -Infinity;

    values.forEach(x => {
      if (x < min)
        min = x;

      if (x > max)
        max = x;
    });

    return [min, max];
  }
}

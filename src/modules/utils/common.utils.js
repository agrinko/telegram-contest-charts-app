export function debounce(fn, delay) {
  let timeout;

  return function(...args) {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = null;
      fn.apply(this, ...args);
    }, delay);
  };
}

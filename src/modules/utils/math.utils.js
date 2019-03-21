export function equals(a, b, eps = Number.EPSILON) {
  return a <= b + eps && a >= b - eps;
}

export function round(x, decimals = 0) {
  const k = Math.pow(10, decimals);
  return Math.round(x * k) / k;
}

export function roundToMultiplier(x, multiplier) {
  const rem = x % multiplier;
  return x - rem + Math.round(rem / multiplier) * multiplier;
}

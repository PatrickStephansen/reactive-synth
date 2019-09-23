export const clamp = (minValue, maxValue) => input =>
  input < minValue ? minValue : input > maxValue ? maxValue : input;

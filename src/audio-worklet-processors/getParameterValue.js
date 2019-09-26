const clamp = (minValue, maxValue) => input =>
  input < minValue ? minValue : input > maxValue ? maxValue : input;

export const getParameterValue = (parameter, minValue, maxValue) => sampleNumber => {
  const clampValue = clamp(minValue, maxValue);
  if (parameter.length > 1) {
    return clampValue(parameter[sampleNumber]);
  }
  return clampValue(parameter[0]);
};

export function getValueAtTime(
  startValue,
  startTime,
  endValue,
  endTime,
  currentTime
) {
  if (startTime >= endTime) {
    startTime = endTime;
  }
  if (currentTime >= endTime) {
    return endValue;
  }
  if (currentTime <= startTime) {
    return startValue;
  }

  const gradient = (endValue - startValue) / (endTime - startTime);
  return startValue + (currentTime - startTime) * gradient;
}

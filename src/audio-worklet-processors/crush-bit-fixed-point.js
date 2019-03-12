// based on https://webaudio.github.io/web-audio-api/#the-bitcrusher-node
export function crush(sample, bitDepth) {
  const step = 2 ** -(bitDepth - 1);
  const max = 1 - step;
  if (sample >= 1) return max;
  if (sample <= -1) return -1;
  return step * Math.floor(sample / step);
}

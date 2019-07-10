// based on https://webaudio.github.io/web-audio-api/#the-bitcrusher-node
export function crush(sample, bitDepth, fractionalDepthMode) {
  if (bitDepth > 32) bitDepth = 32;
  if (bitDepth < 1) bitDepth = 1;
  if (fractionalDepthMode === 'trve') {
    bitDepth = Math.floor(bitDepth);
  }
  let numberOfSteps = 2 ** bitDepth;
  if (fractionalDepthMode === 'quantize-evenly') {
    numberOfSteps = Math.floor(numberOfSteps);
  }
  const stepSize = 2 / numberOfSteps;
  const max = 1 - stepSize;
  if (sample >= max) return max;
  if (sample <= -1) return -1;

  return -1 + Math.floor((1 + sample) / stepSize) * stepSize;
}

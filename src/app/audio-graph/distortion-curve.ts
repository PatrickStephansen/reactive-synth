// based on https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
export function makeDistortionCurve(amount = 50) {
  const n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

// sigmoid curve
export function makeDistortionCurve(n_samples = 44100) {
  const curve = new Float32Array(n_samples);
  for (let i = 0; i < n_samples; ++i) {
    const x = (i / n_samples) * Math.PI;
    curve[i] = -Math.cos(x);
  }
  return curve;
}

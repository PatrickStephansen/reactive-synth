const { readdir } = require('fs');
const { promisify } = require('util');

const readdirAsync = promisify(readdir);
readdirAsync('./src/assets/audio-worklet-processors').then(files => {
  // ensure we don't try read the map file
  const localSourceFiles = files.find(f => /worklets.*\.js$/.test(f));
  const bitcrusherWasmFile = files.find(f => /reactive_synth_bitcrusher.*\.wasm$/.test(f));
  const inverseGainWasmFile = files.find(f => /reactive_synth_inverse_gain.*\.wasm$/.test(f));
  const noiseGeneratorWasmFile = files.find(f => /reactive_synth_noise_generator.*\.wasm$/.test(f));
  const clockDividerWasmFile = files.find(f => /reactive_synth_clock_divider.*\.wasm$/.test(f));
  const envelopeGeneratorWasmFile = files.find(f => /reactive_synth_envelope_generator.*\.wasm$/.test(f));
  const baseUrl = '/assets/audio-worklet-processors/';
  console.log(`export const workletUrl = '${baseUrl}${localSourceFiles}';`);
  console.log(`export const bitcrusherWasmUrl = '${baseUrl}${bitcrusherWasmFile}';`);
  console.log(`export const inverseGainWasmUrl = '${baseUrl}${inverseGainWasmFile}';`);
  console.log(`export const noiseGeneratorWasmUrl = '${baseUrl}${noiseGeneratorWasmFile}';`);
  console.log(`export const clockDividerWasmUrl = '${baseUrl}${clockDividerWasmFile}';`);
  console.log(`export const envelopeGeneratorWasmUrl = '${baseUrl}${envelopeGeneratorWasmFile}';`);
}, console.error);

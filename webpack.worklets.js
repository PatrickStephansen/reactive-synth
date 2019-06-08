const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    noise: './src/audio-worklet-processors/noise.js',
    'bit-crusher': './src/audio-worklet-processors/bit-crusher-fixed-point.js',
    'inverse-gain': './src/audio-worklet-processors/inverse-gain.js'
  },
  output: {
    publicPath: './assets/audio-worklet-processors',
    path: path.join(__dirname, 'src', 'assets', 'audio-worklet-processors'),
    filename: '[name].js'
  }
};

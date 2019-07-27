const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    worklets: [
      './src/audio-worklet-processors/noise.js',
      './src/audio-worklet-processors/bit-crusher-fixed-point.js',
      './src/audio-worklet-processors/inverse-gain.js',
      './src/audio-worklet-processors/envelope-generator.js'
    ]
  },
  output: {
    publicPath: './assets/audio-worklet-processors',
    path: path.join(__dirname, 'src', 'assets', 'audio-worklet-processors'),
    filename: '[name].js'
  }
};

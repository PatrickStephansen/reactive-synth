const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    worklets: [
      './src/audio-worklet-processors/envelope-generator.js',
      './src/audio-worklet-processors/clock-divider.js',
      './node_modules/reactive-synth-noise-generator/noise-generator.js',
      './node_modules/reactive-synth-bitcrusher/bitcrusher.js',
      './node_modules/reactive-synth-inverse-gain/inverse-gain.js'
    ]
  },
  output: {
    publicPath: './assets/audio-worklet-processors',
    path: path.join(__dirname, 'src', 'assets', 'audio-worklet-processors'),
    filename: '[name].[contenthash].js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'node_modules/reactive-synth-inverse-gain/reactive_synth_inverse_gain.wasm',
          // somehow it knows to copy to the assets folder
          to: '[name].[contenthash].[ext]',
          toType: 'template'
        },
        {
          from: 'node_modules/reactive-synth-bitcrusher/reactive_synth_bitcrusher.wasm',
          to: '[name].[contenthash].[ext]',
          toType: 'template'
        },
        {
          from: 'node_modules/reactive-synth-noise-generator/reactive_synth_noise_generator.wasm',
          to: '[name].[contenthash].[ext]',
          toType: 'template'
        },
        {
          from: 'node_modules/reactive-synth-clock-divider/reactive_synth_clock_divider.wasm',
          to: '[name].[contenthash].[ext]',
          toType: 'template'
        },
      ]
    })
  ]
};

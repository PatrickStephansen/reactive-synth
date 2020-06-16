const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    worklets: [
      './src/audio-worklet-processors/noise.js',
      './src/audio-worklet-processors/envelope-generator.js',
      './src/audio-worklet-processors/clock-divider.js'
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
          from: 'node_modules/reactive-synth-inverse-gain/dist/*.*',
          // somehow it knows to copy to the assets folder
          to: '[name].[contenthash].[ext]',
          toType: 'template'
        },
        {
          from: 'node_modules/reactive-synth-bitcrusher/dist/*.*',
          to: '[name].[contenthash].[ext]',
          toType: 'template'
        }
      ]
    })
  ]
};

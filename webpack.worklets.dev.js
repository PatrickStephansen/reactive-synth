const merge = require('webpack-merge');
const common = require('./webpack.worklets.common');
module.exports = merge(common, {
  devtool: 'inline-source-map',
  output: {
    filename: '[name].js',
  }
});

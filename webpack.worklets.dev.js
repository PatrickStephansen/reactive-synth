const merge = require('webpack-merge');
const common = require('./webpack.worklets.common');
module.exports = merge(common, {
  output: {
    filename: '[name].js'
  }
});

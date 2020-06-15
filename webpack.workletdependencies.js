module.exports = {
  mode: 'production',
  module: { rules: [{ test: /reactive-synth-bitcrusher\//, use: { loader: 'file-loader' } }] }
};

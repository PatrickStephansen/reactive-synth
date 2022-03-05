// jest runs with this config so we can keep using es modules in the tests

module.exports = api => {
  const isTest = api.env('test');

  if (isTest) {
    return {
      presets: [
        '@babel/typescript',
        [
          'env',
          {
            modules: 'commonjs',
            targets: {
              node: 'current'
            }
          }
        ]
      ],

      env: {
        test: {
          // since jest runs in node, it only understands commonjs modules
          plugins: [
            '@babel/plugin-transform-modules-commonjs',
            [
              '@babel/plugin-proposal-decorators',
              {
                legacy: true
              }
            ]
          ]
        }
      }
    };
  }
  return {};
};

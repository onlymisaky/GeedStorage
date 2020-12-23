/** @type {import('@babel/core').TransformOptions} */
const transformOptions = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
    '@babel/typescript',
  ],
};

module.exports = transformOptions;

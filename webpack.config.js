const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

/** @type {import('webpack').Configuration} */
const webpackConfig = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    index: path.resolve(__dirname, './src/index.ts'),
  },
  output: {
    path: path.resolve(__dirname),
    filename: 'dist/index.js',
    library: '[name]',
    libraryTarget: 'umd',
    globalObject: 'typeof self !== \'undefined\' ? self : this',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.ts$/,
        use: [
          'babel-loader',
          'ts-loader',
        ],
      },
    ],
  },
  plugins: [new ESLintPlugin()],
};

module.exports = webpackConfig;

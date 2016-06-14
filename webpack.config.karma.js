/* eslint max-len: 0 */
const webpack = require('webpack');
const neatPath = require('node-neat').includePaths[1];
const bourbonPath = require('node-bourbon').includePaths;
const path = require('path');

const config = {
  entry: {
    betaling: './src/app/Index.jsx',
    tests: './tests.webpack.js',
  },
  externals: {
    cheerio: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
  debug: true,
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.ENVIRONMENT': `"${process.env.NODE_ENV}"`,
    }),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
    root: [
      path.resolve('./src/'),
    ],
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
      {
        test: /\.yml$/,
        loader: 'json!yaml',
      },
      {
        test: /\.scss$/,
        loader: `style!css!postcss!sass?sourceMap&includePaths[]=${bourbonPath}&includePaths[]=${neatPath}`,
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2|png)(\?[\s\S]+)?$/,
        loader: 'file?name=dist/[name].[hash].[ext]',
      },
    ],
  },
};

module.exports = config;

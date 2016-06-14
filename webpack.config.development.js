/* eslint max-len: 0 */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const neatPath = require('node-neat').includePaths[1];
const bourbonPath = require('node-bourbon').includePaths;
const autoprefixer = require('autoprefixer');
const os = require('os');
const path = require('path');

const config = {
  entry: {
    timetravel: [
      'webpack-dev-server/client?http://localhost:7777',
      'webpack/hot/only-dev-server',
      './src/app/Index.jsx',
    ],
    tests: './tests.webpack.js',
  },
  output: {
    path: path.join(__dirname, 'public'),
    // publicPath: '/public/',
    filename: '[name].bundle.js',
  },
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  // devServer: {
  //   host: `localhost`,
  // },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.ENVIRONMENT': `"${process.env.NODE_ENV}"`,
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'index.html',
      template: 'src/app/index_template.html',
      // baseHref: '/dbank/innlogget/betaling/',
      title: 'Timetravel',
      excludeChunks: ['tests'],
    }),
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en|nn|nb)$/),
  ],
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/, /\.spec\.js?$/],
        loader: 'babel-loader',
      },
      {
        test: /\.jsx?$/,
        include: /\.spec\.js?$/,
        loader: 'ignore-loader',
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
  postcss: [
    autoprefixer(),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: [
      path.resolve('./src/'),
    ],
  },
};

module.exports = config;

/* eslint max-len: 0 */
const webpack = require('webpack');
const neatPath = require('node-neat').includePaths[1];
const bourbonPath = require('node-bourbon').includePaths;
const autoprefixer = require('autoprefixer');
const eslintTeamcity = require('eslint-teamcity');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const environment = process.env.NODE_ENV;

const publicPaths = {
  utvikling: 'https://u-www2.spv.no/cdn',
  systemtest: 'https://s-www2.spv.no/cdn',
};

const config = {
  entry: {
    betaling: './src/app/Index.jsx',
  },
  output: {
    path: `${__dirname}/wwwroot/dist/${environment}`,
    filename: '[name].bundle.[chunkhash].js',
    publicPath: `${publicPaths[environment]}/betaling-web`,
    chunkFilename: '/async/[name].bundle.[chunkhash].js',
  },
  eslint: {
    formatter: eslintTeamcity,
    failOnError: true,
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
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
        loader: ExtractTextPlugin.extract('style', `css!postcss!sass?sourceMap&includePaths[]=${bourbonPath}&includePaths[]=${neatPath}`, {
          publicPath: '',
        }),
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2|png)(\?[\s\S]+)?$/,
        loader: 'file?name=[name].[hash].[ext]',
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
  plugins: [
    new ExtractTextPlugin('[name].bundle.[chunkhash].css'),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      'process.env.ENVIRONMENT': `"${environment}"`,
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'index.html',
      template: 'src/app/index_template.html',
      baseHref: '/dbank/innlogget/betaling/',
      vendorScripts: [
        'https://u-www2.spv.no/cdn/static/vendor/react/15.1.0/react-with-dom.min.js',
      ],
      title: 'Overføre',
      cdnPath: `${publicPaths[environment]}`,
    }),
  ],
};

module.exports = config;

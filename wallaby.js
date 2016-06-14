const wallabyWebpack = require('wallaby-webpack');
const babel = require('babel-core');
const path = require('path');

module.exports = function wallabyConfig(wallaby) {
  const babelCompiler = wallaby.compilers.babel({
    babel,
    presets: ['es2015', 'react'],
    plugins: ['transform-object-rest-spread'],
  });

  const webpackPostprocessor = wallabyWebpack(Object.assign({}, {
    externals: {
      cheerio: 'window',
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true,
    },
    module: {
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
          exclude: /(node_modules)/,
          loader: 'style!css!sass',
        },
      ],
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
      root: [
        wallaby.projectCacheDir,
        path.join(wallaby.projectCacheDir, 'src'),
      ],
    },
  }, { entryPatterns: ['src/**/*.spec.js*'] }));

  return {
    debug: true,
    files: [
      { pattern: 'node_modules/intl/dist/Intl.min.js', instrument: false },
      { pattern: 'node_modules/intl/locale-data/jsonp/nb-NO.js', instrument: false },
      { pattern: 'node_modules/babel-polyfill/browser.js', instrument: false },
      { pattern: 'src/**/!(*.spec).js*', load: false },
      { pattern: 'src/infrastructure/config/*.yml', load: true },
    ],
    tests: [
      { pattern: 'src/**/*.spec.js*', load: false },
    ],
    testFramework: 'mocha',
    compilers: {
      '**/*.js*': babelCompiler,
    },
    postprocessor: webpackPostprocessor,
    bootstrap: function bootstrap() {
      window.__moduleBundler.loadTests();
    },
  };
};

/* eslint-disable no-console */
require('babel-polyfill');
const webpackKarmaConfig = require('./webpack.config.karma');

module.exports = function karmaConfig(config) {
  // bail=true --> Testene krasjer ved kompileringsfeil
  if (config.bail) {
    webpackKarmaConfig.bail = true;
    webpackKarmaConfig.plugins = webpackKarmaConfig.plugins.concat([
      function makeKarmaCrashAndBurn() {
      // bail-flagget klarer ikke å fange opp kompileringsfeil i selve testene
        this.plugin('done', (stats) => {
          if (stats.compilation.errors.length) {
            stats.compilation.errors.forEach((error) => {
              console.log(error.message || error);
            });
            throw new Error(stats.compilation.errors);
          }
        });
      }]);
  }
  config.set({
    browsers: ['PhantomJS'],
    singleRun: true,
    frameworks: ['mocha'],
    files: [
      'tests.webpack.js',
    ],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap'],
    },
    reporters: ['mocha'],
    webpack: webpackKarmaConfig,
    webpackServer: {
      noInfo: true,
    },
  });
};

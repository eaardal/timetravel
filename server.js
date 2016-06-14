var webpack = require('webpack');
var WebPackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.development');

new WebPackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    inline: true,
    colors: true
}).listen(7777, 'localhost');

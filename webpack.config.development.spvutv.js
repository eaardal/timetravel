/* eslint max-len: 0 */
// For de som fortsatt er på spv-utvikling. Kjøres med: npm run start-utv
const webpackDev = require('./webpack.config.development');
const os = require('os');
const spvUtvConfig = Object.create(webpackDev);

spvUtvConfig.output.publicPath = `http://${os.hostname()}.spvutvikling.no:8080/`;
spvUtvConfig.devServer.host = `${os.hostname()}.spvutvikling.no`;

module.exports = spvUtvConfig;

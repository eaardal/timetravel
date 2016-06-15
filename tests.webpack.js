import 'babel-polyfill';
import 'intl';
import 'intl/locale-data/jsonp/nb-NO';

const context = require.context('./src', true, /\.spec\.js?$/);
context.keys().forEach(context);

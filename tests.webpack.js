import 'babel-polyfill';
import 'intl';
import 'intl/locale-data/jsonp/nb-NO';
import moment from 'moment';
import i18n from 'i18n/i18nCache';
i18n.initialize();

moment.locale('nn');

const context = require.context('./src', true, /\.spec\.js?$/);
context.keys().forEach(context);

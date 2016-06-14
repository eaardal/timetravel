import IntlMessageFormat from 'intl-messageformat';

const formatOptions = {
  number: {
    twoDecimals: { minimumFractionDigits: 2 },
    noDecimals: { maximumFractionDigits: 0 },
  },
  date: {
    mediumNoYear: {
      day: 'numeric',
      month: 'short',
    },
  },
};

export const getLocale = () => 'nb-NO';

export const createI18n = (template) => (key) => {
  if (!window.Intl) {
    require.ensure(['intl', 'intl/locale-data/jsonp/nb-NO'], () => {
      require('intl');
      require('intl/locale-data/jsonp/nb-NO');
    }, 'intl-polyfill');
  }
  const intl = new IntlMessageFormat(template[key][getLocale()], getLocale(), formatOptions);
  return (obj) => intl.format(obj);
};

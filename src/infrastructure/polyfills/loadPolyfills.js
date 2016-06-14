const availablePolyfills = [
  {
    shouldLoad: () => !window.Intl,
    load: () =>
      new Promise(resolve =>
        require.ensure(['intl', 'intl/locale-data/jsonp/nb-NO'], () => {
          resolve({
            intl: require('intl'),
            'intl-nb-NO': require('intl/locale-data/jsonp/nb-NO'),
          });
        }, 'intl-polyfill')
      ),
  },
];

const loadPolyfills = (initializeApp) => {
  if (availablePolyfills.some(poly => poly.shouldLoad())) {
    const polyfillPromises = [];

    availablePolyfills.forEach(poly => {
      if (poly.shouldLoad()) {
        polyfillPromises.push(poly.load());
      }
    });

    Promise.all(polyfillPromises).then(() => initializeApp());
  } else {
    initializeApp();
  }
};

export default loadPolyfills;

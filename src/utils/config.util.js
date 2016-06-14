/* eslint no-param-reassign: ["error", { "props": false }] */
import isPlainObject from 'lodash/isPlainObject';
const os = require('os');

export const replaceLocalhost = (configObj) => {
  const _configObjCopy = Object.assign({}, configObj);

  for (const prop in _configObjCopy) {
    if (_configObjCopy.hasOwnProperty(prop)) {
      if (isPlainObject(_configObjCopy[prop])) {
        _configObjCopy[prop] = replaceLocalhost(_configObjCopy[prop]);
      } else {
        _configObjCopy[prop] = _configObjCopy[prop].replace('http://localhost', `http://${os.hostname()}`);
      }
    }
  }
  return _configObjCopy;
};

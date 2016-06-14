import 'whatwg-fetch';
import merge from 'lodash/merge';

export const checkResponseStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  return response.json().then((json) => {
    const error = new Error(response.statusText);
    error.response = response;
    error.result = json;
    throw error;
  });
};

export const parseJSON = (response) => response.json();

const defaultFetchOptions = {
  method: 'GET',
  credentials: 'include',
  headers: {
    Accept: 'application/json',
  },
};
export const fetch = (url, method = 'GET', options = defaultFetchOptions) =>
  window.fetch(
    url,
    merge({}, defaultFetchOptions, options, { method })
  )
  .then(checkResponseStatus)
  .then(parseJSON);

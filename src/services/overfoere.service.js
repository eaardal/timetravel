import 'whatwg-fetch';
import config from 'infrastructure/config/config';
import { fetch } from 'utils/http.util';

const getTransferFromAccounts = () =>
  fetch(`${config.apiEndpoints.transferfrom}`)
  .then(fromAccounts => fromAccounts);

const getTransferToAccounts = () =>
  fetch(`${config.apiEndpoints.transferto}`)
  .then(toAccounts => toAccounts);

const postTransferForm = (postData) =>
  fetch(`${config.apiEndpoints.createtransfer}`, 'POST', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })
  .then(result => result);

export default {
  getTransferFromAccounts,
  getTransferToAccounts,
  postTransferForm,
};

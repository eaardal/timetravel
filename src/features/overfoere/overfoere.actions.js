import { change } from 'redux-form';

import {
  AMOUNT_INCREASER_AMOUNT_CLICK_TRANSFER,
  NOT_ENOUGH_ACCOUNTS_TRANSFER,
  POST_TRANSFERFORM_RECEIVE,
  POST_TRANSFERFORM_SERVER_ERROR,
  TOGGLE_FORM_CALENDAR,
  HIDE_FORM_CALENDAR,
} from './overfoere.constants';

import {
  requestAccountList,
  receiveAccountList,
  disableAccountItem,
  onClickSelectAccountItem,
  onKeypressedAccountPicker,
} from 'components/AccountPicker/accountPicker.actions';

import createActionCreator from 'utils/createActionCreator.util';
import { hasEnoughAccountsForTransfer } from 'utils/account.util';

import errorCodes from 'common/errorCodes';

import transferService from 'services/overfoere.service';

export const amountClicked = createActionCreator(AMOUNT_INCREASER_AMOUNT_CLICK_TRANSFER, 'amount');

export const toggleFormCalendar = createActionCreator(TOGGLE_FORM_CALENDAR);

export const closeFormCalendar = createActionCreator(HIDE_FORM_CALENDAR);

export const receivePostTransferForm = createActionCreator(POST_TRANSFERFORM_RECEIVE, 'result');

export const serverErrorPostTransferForm = createActionCreator(POST_TRANSFERFORM_SERVER_ERROR);

export const postTransferForm = (postData) =>
  dispatch => new Promise((resolve, reject) => {
    transferService.postTransferForm(postData)
      .then(result => {
        resolve();
        dispatch(receivePostTransferForm(result));
      })
      .catch((e) => {
        console.log('Error', e);
        if (e.result && Array.isArray(e.result)) {
          const formErrors = {};
          let hasDisplayErrors = false;
          for (let i = 0; i < e.result.length; i++) {
            if (errorCodes[e.result[i].errorCode] && errorCodes[e.result[i].errorCode].overfoere) {
              hasDisplayErrors = true;
              const errorField = errorCodes[e.result[i].errorCode].overfoere;
              formErrors[errorField] = errorCodes[e.result[i].errorCode].getMessage();
            }
          }
          if (hasDisplayErrors) {
            reject(formErrors);
          } else {
            resolve();
            dispatch(serverErrorPostTransferForm());
          }
        } else {
          resolve();
          dispatch(serverErrorPostTransferForm());
        }
      });
  });


// END: Transfer clicked

const selectFromAccount = (dispatch, getCurrentState) => {
  const selectedAccount = getCurrentState().accountPickers.fromAccountsPicker.selectedAccount;
  const selectedToAccount = getCurrentState().accountPickers.toAccountsPicker.selectedAccount;
  dispatch(change('transfer', 'fromAccount', selectedAccount));
  if (selectedAccount.accountNumber === selectedToAccount && selectedToAccount.accountNumber) {
    dispatch(change('transfer', 'toAccount', null));
  }
  dispatch(disableAccountItem('toAccountsPicker', selectedAccount.accountNumber));
};

export function onClickSelectFromAccountItem(newAccount) {
  return (dispatch, getCurrentState) => {
    dispatch(onClickSelectAccountItem('fromAccountsPicker', newAccount));
    selectFromAccount(dispatch, getCurrentState);
  };
}

export function onKeypressedFromAccountPicker(keyEvent) {
  return (dispatch, getCurrentState) => {
    dispatch(onKeypressedAccountPicker('fromAccountsPicker', keyEvent));
    selectFromAccount(dispatch, getCurrentState);
  };
}

export function onKeypressedToAccountPicker(keyEvent) {
  return (dispatch, getCurrentState) => {
    dispatch(onKeypressedAccountPicker('toAccountsPicker', keyEvent));
    const selectedAccount = getCurrentState().accountPickers.toAccountsPicker.selectedAccount;
    if (selectedAccount) {
      dispatch(change('transfer', 'toAccount', selectedAccount));
    }
  };
}

export function onClickSelectToAccountItem(newAccount) {
  return (dispatch, getCurrentState) => {
    dispatch(onClickSelectAccountItem('toAccountsPicker', newAccount));
    const selectedAccount = getCurrentState().accountPickers.toAccountsPicker.selectedAccount;
    dispatch(change('transfer', 'toAccount', selectedAccount));
  };
}

export const notEnoughAccountsToTransfer
  = createActionCreator(NOT_ENOUGH_ACCOUNTS_TRANSFER);

export function getAccountLists() {
  return (dispatch, getCurrentState) => {
    dispatch(requestAccountList('fromAccountsPicker'));
    dispatch(requestAccountList('toAccountsPicker'));

    const fromAccountsPromise = transferService.getTransferFromAccounts()
      .then((fromAccounts) => {
        dispatch(receiveAccountList('fromAccountsPicker', fromAccounts));
        if (fromAccounts && fromAccounts.length > 0) {
          dispatch(onClickSelectFromAccountItem(fromAccounts[0]));
        }
        return fromAccounts;
      });

    const toAccountsPromsie = transferService.getTransferToAccounts()
      .then((toAccounts) => {
        dispatch(receiveAccountList('toAccountsPicker', toAccounts));
        const selectedAccount = getCurrentState().accountPickers.fromAccountsPicker &&
          getCurrentState().accountPickers.fromAccountsPicker.selectedAccount;
        if (selectedAccount) {
          dispatch(disableAccountItem('toAccountsPicker', selectedAccount.accountNumber));
        }
        return toAccounts;
      });

    Promise.all([fromAccountsPromise, toAccountsPromsie])
      .then(values => {
        const fromAccounts = values[0];
        const toAccounts = values[1];
        if (!hasEnoughAccountsForTransfer(fromAccounts, toAccounts)) {
          dispatch(notEnoughAccountsToTransfer());
        }
      }, error => {
        dispatch(serverErrorPostTransferForm());
        // TODO: Logging
        console.log('### Error fetching accounts for transfer ###', error);
      });
  };
}

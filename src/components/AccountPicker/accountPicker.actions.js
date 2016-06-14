import {
  TOGGLE_ACCOUNTLIST,
  GET_ACCOUNTLIST_RECIEVE,
  GET_ACCOUNTLIST_REQUEST,
  DISABLE_ACCOUNTITEM,
  ONBLUR_ACCOUNTPICKER,
  ONFOCUS_ACCOUNTPICKER,
  ONCLICKSELECT_ACCOUNTITEM,
  ONKEYPRESSED_ACCOUNTPICKER,
} from './accountPicker.constants';
import createActionCreator from 'utils/createActionCreator.util';

export const toggleAccountList = createActionCreator(TOGGLE_ACCOUNTLIST, 'accountPicker');

export const requestAccountList
  = createActionCreator(GET_ACCOUNTLIST_REQUEST, 'accountPicker', 'accounts');

export const receiveAccountList
  = createActionCreator(GET_ACCOUNTLIST_RECIEVE, 'accountPicker', 'accounts');

export const disableAccountItem
  = createActionCreator(DISABLE_ACCOUNTITEM, 'accountPicker', 'disabledAccountNumber');

export const onBlurAccountPicker
  = createActionCreator(ONBLUR_ACCOUNTPICKER, 'accountPicker');

export const onFocusAccountPicker
  = createActionCreator(ONFOCUS_ACCOUNTPICKER, 'accountPicker');

export const onClickSelectAccountItem
  = createActionCreator(ONCLICKSELECT_ACCOUNTITEM, 'accountPicker', 'newAccount');

export const onKeypressedAccountPicker
  = createActionCreator(ONKEYPRESSED_ACCOUNTPICKER, 'accountPicker', 'keyEvent');

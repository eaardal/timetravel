import first from 'lodash/first';
import last from 'lodash/last';
import findIndex from 'lodash/findIndex';
import orderBy from 'lodash/orderBy';

import keyCodes from 'common/keyCodes';
import {
  TOGGLE_ACCOUNTLIST,
  GET_ACCOUNTLIST_REQUEST,
  GET_ACCOUNTLIST_RECIEVE,
  DISABLE_ACCOUNTITEM,
  CONTRACT_ACCOUNTLIST,
  ONBLUR_ACCOUNTPICKER,
  ONFOCUS_ACCOUNTPICKER,
  ONCLICKSELECT_ACCOUNTITEM,
  ONKEYPRESSED_ACCOUNTPICKER,
} from './accountPicker.constants';
import { ONCLICK_OUTSIDE } from
  'components/ClickOutsideHandler/clickOutsideHandler.constants';

const toggleKeyIsPressed = (keyEvent) =>
  keyEvent.keyCode === keyCodes.ENTER
  || keyEvent.keyCode === keyCodes.SPACE
  || (keyEvent.altKey
    && (keyEvent.keyCode === keyCodes.ARROW_DOWN || keyEvent.keyCode === keyCodes.ARROW_UP));

const escapeKeyIsPressed = (keyEvent) =>
  keyEvent.keyCode === keyCodes.ESCAPE
  || keyEvent.keyCode === keyCodes.TAB;

const selectNextKeyIsPressed = (keyEvent) =>
  keyEvent.keyCode === keyCodes.ARROW_RIGHT
  || keyEvent.keyCode === keyCodes.ARROW_DOWN;

const selectPreviousKeyIsPressed = (keyEvent) =>
  keyEvent.keyCode === keyCodes.ARROW_LEFT
  || keyEvent.keyCode === keyCodes.ARROW_UP;

const searchAccounts = (state, selectedIndex, keyCode) => {
  // Prøver å se om keyCode matcher 1. bokstav i et kontonavn
  const firstChar = String.fromCharCode(keyCode);
  // søket er sirkulært, så en må sjekke både før og etter allerede valgt konto
  const sliceIndex = selectedIndex > -1 ? selectedIndex : 0;
  const [beforeSelected, afterSelected] = [
    state.accounts.slice(0, sliceIndex),
    state.accounts.slice(sliceIndex + 1),
  ];

  const matchesAccount = (account) =>
    account.name[0].toLowerCase() === firstChar.toLowerCase()
    && !account.isDisabled;

  const match = afterSelected.filter(matchesAccount)[0]
    || beforeSelected.filter(matchesAccount)[0];

  return match;
};

const findPreviousAccountBeforeSelected = (state, selectedIndex) => {
  if (selectedIndex === -1) return null;
  const possibleAccountNumbers = state.accounts.slice(0, selectedIndex).
    filter(a => !a.isDisabled);

  const previousAccount = last(possibleAccountNumbers)
    || state.selectedAccount;

  return previousAccount;
};

const findNextAccountAfterSelected = (state, selectedIndex) => {
  const possibleAccountNumbers = state.accounts.slice(selectedIndex + 1).
    filter(a => !a.isDisabled);

  const nextAccount = first(possibleAccountNumbers)
    || state.selectedAccount;

  return nextAccount;
};

const picker = (state = {
  accountListVisible: false,
  accounts: [],
  selectedAccount: null,
  hasFocus: false,
}, action) => {
  switch (action.type) {
    case TOGGLE_ACCOUNTLIST: {
      const selectedAccountNumber
        = state.selectedAccount ? state.selectedAccount.accountNumber : '';
      return {
        ...state,
        accountListVisible: !state.accountListVisible,
        accounts: state.accounts.map(a => ({
          ...a,
          wasMarkedInList: false,
          isMarkedInList: a.accountNumber === selectedAccountNumber,
        })),
      };
    }
    case ONBLUR_ACCOUNTPICKER:
      return {
        ...state,
        hasFocus: false,
      };
    case ONFOCUS_ACCOUNTPICKER:
      return {
        ...state,
        hasFocus: true,
      };
    case GET_ACCOUNTLIST_REQUEST:
      return {
        ...state,
        isFetchingAccounts: true,
      };
    case GET_ACCOUNTLIST_RECIEVE:
      return {
        ...state,
        accounts: action.accounts,
        isFetchingAccounts: false,
      };
    case DISABLE_ACCOUNTITEM:
      return {
        ...state,
        selectedAccount: (state.selectedAccount &&
          state.selectedAccount.accountNumber === action.disabledAccountNumber
            ? null
            : state.selectedAccount),
        accounts: state.accounts.map(a => ({
          ...a,
          isMarkedInList: a.accountNumber === action.disabledAccountNumber
            ? false
            : a.isMarkedInList,
          isDisabled: a.accountNumber === action.disabledAccountNumber,
        })),
      };
    case ONCLICKSELECT_ACCOUNTITEM: {
      if (action.newAccount.isDisabled) return state;
      return {
        ...state,
        selectedAccount: { ...action.newAccount, isMarkedInList: false },
        accountListVisible: false,
        accounts: state.accounts.map(a => ({
          ...a,
          wasMarkedInList: false,
          isMarkedInList: a.accountNumber === action.newAccount.accountNumber,
        })),
      };
    }
    case ONKEYPRESSED_ACCOUNTPICKER: {
      const selectedAccountNumber
        = state.selectedAccount ? state.selectedAccount.accountNumber : '';
      if (toggleKeyIsPressed(action.keyEvent)) {
        return {
          ...state,
          accountListVisible: !state.accountListVisible,
          accounts: state.accounts.map(a => ({
            ...a,
            isMarkedInList: a.accountNumber === selectedAccountNumber,
          })),
        };
      }
      if (escapeKeyIsPressed(action.keyEvent)) {
        return {
          ...state,
          accountListVisible: false,
        };
      }

      const selectedIndex
        = findIndex(state.accounts, a => a.accountNumber === selectedAccountNumber);
      let newAccount = null;
      if (selectNextKeyIsPressed(action.keyEvent)) {
        newAccount = findNextAccountAfterSelected(state, selectedIndex);
      } else if (selectPreviousKeyIsPressed(action.keyEvent)) {
        newAccount = findPreviousAccountBeforeSelected(state, selectedIndex);
      } else {
        // Inge treff på keyCodes, så vi prøver å se om den matcher 1. bokstav i et kontonavn
        newAccount = searchAccounts(state, selectedIndex, action.keyEvent.keyCode);
      }
      if (!newAccount) return state;

      return {
        ...state,
        selectedAccount: newAccount,
        accounts: state.accounts.map(a => ({
          ...a,
          isMarkedInList: a.accountNumber === newAccount.accountNumber,
        })),
      };
    }
    default:
      return state;
  }
};

const accountPickers = (state = {}, action) => {
  switch (action.type) {
    case GET_ACCOUNTLIST_REQUEST:
    case GET_ACCOUNTLIST_RECIEVE:
    case TOGGLE_ACCOUNTLIST:
    case DISABLE_ACCOUNTITEM:
    case CONTRACT_ACCOUNTLIST:
    case ONBLUR_ACCOUNTPICKER:
    case ONFOCUS_ACCOUNTPICKER:
    case ONCLICKSELECT_ACCOUNTITEM:
    case ONKEYPRESSED_ACCOUNTPICKER: {
      const accountState = {
        ...state[action.accountPicker],
        accounts: state[action.accountPicker] && state[action.accountPicker].accounts
          ? state[action.accountPicker].accounts.map(a => ({
            ...a,
            wasMarkedInList: !!a.isMarkedInList, // Trengs for å unngå IE event/scroll quirks
          }))
          : [],
      };
      const accountPicker = picker(accountState, action);
      const sortedAccountPicker = Object.assign({}, accountPicker, {
        accounts: orderBy(accountPicker.accounts,
          (account) => account.kontotype && account.kontotype !== 'kredittkort', 'desc'),
      });
      return {
        ...state,
        [action.accountPicker]: sortedAccountPicker,
      };
    }
    case ONCLICK_OUTSIDE: {
      const newState = { ...state };
      const constainerId = action.containerIds.find((cid) => state.hasOwnProperty(cid));
      if (constainerId) {
        return {
          ...state,
          [constainerId]: {
            ...state[constainerId],
            accountListVisible: false,
          },
        };
      }
      return newState;
    }
    default:
      return state;
  }
};

export default accountPickers;

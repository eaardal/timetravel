import {
  NOT_ENOUGH_ACCOUNTS_TRANSFER,
  POST_TRANSFERFORM_RECEIVE,
  POST_TRANSFERFORM_SERVER_ERROR,
  TOGGLE_FORM_CALENDAR,
  HIDE_FORM_CALENDAR,
} from './overfoere.constants';
import { ONCLICK_OUTSIDE } from
  'components/ClickOutsideHandler/clickOutsideHandler.constants';
import dateTimeUtil from 'utils/dateTime.util';

const defaultState = {
  toFewAccounts: false,
  transferSuccess: null,
  transferError: false,
  showCalendar: false,
};

const getTransferSuccess =
  ({
    creditAccountName,
    debitAccountName,
    creditAccountBalance,
    debitAccountBalance,
    amount,
    transferredToday,
    transferDate,
  }) => (
    {
      fraKonto: {
        navn: debitAccountName,
        saldo: debitAccountBalance,
      },
      tilKonto: {
        navn: creditAccountName,
        saldo: creditAccountBalance,
      },
      beloep: amount,
      overfoertToday: transferredToday,
      overfoeringsDato: dateTimeUtil.parseIsoDate(transferDate),
    }
  );

const reduceForCalendar = (state, show) =>
  Object.assign({}, state, {
    showCalendar: show,
  });

const transfer = (state = defaultState, action) => {
  switch (action.type) {
    case NOT_ENOUGH_ACCOUNTS_TRANSFER:
      return {
        ...state,
        toFewAccounts: true,
      };
    case POST_TRANSFERFORM_RECEIVE:
      return {
        ...state,
        transferSuccess: getTransferSuccess(action.result),
      };
    case POST_TRANSFERFORM_SERVER_ERROR:
      return {
        ...state,
        transferError: true,
      };
    case TOGGLE_FORM_CALENDAR:
      return reduceForCalendar(state, !state.showCalendar);
    case HIDE_FORM_CALENDAR:
      return reduceForCalendar(state, false);
    case ONCLICK_OUTSIDE: {
      return reduceForCalendar(state, false);
    }
    default:
      return state;
  }
};

export default transfer;

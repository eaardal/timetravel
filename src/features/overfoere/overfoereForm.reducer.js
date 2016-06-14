import { AMOUNT_INCREASER_AMOUNT_CLICK_TRANSFER } from './overfoere.constants';
import {
  concatKronerAndOere,
  getAmountAsNumber,
  formatNumberToLocale,
  ensureNumberIsWithoutWhitespace,
} from 'utils/format.util';
import { interpretTextAsDate } from 'utils/dateInterpretation.util';
import DateTimeUtil from 'utils/dateTime.util';
import i18n from 'i18n/i18nCache';

const ensureAmountIsAllowed = (amount) => {
  const maxAllowedAmount = 999999999;
  const numberAmount = ensureNumberIsWithoutWhitespace(amount);
  return maxAllowedAmount < numberAmount || 0
    ? maxAllowedAmount
    : amount;
};

const calculateOereWhenKronerChanged = (currentKroner, currentOere) => {
  const isKronerEmptyOrZero = currentKroner === '' || currentKroner === '0';
  const isOereEmptyOrZero = currentOere === '' || currentOere === '0';
  const isOerePlaceholderValue = currentOere === '00';

  let oere;

  if (isKronerEmptyOrZero && isOerePlaceholderValue) {
    oere = '';
  } else if (!isKronerEmptyOrZero && isOereEmptyOrZero) {
    oere = '00';
  } else {
    oere = currentOere;
  }

  return oere;
};

const reduceKronerForReduxFormChange = (state, action) => {
  if (action.field !== 'kroner') {
    return state.kroner;
  }
  const kroner = ensureAmountIsAllowed(action.value);
  return {
    value: kroner,
    originalValue: action.value,
  };
};

const reduceKronerForAmountIncreaserClick = (state, action) => {
  const kroner = getAmountAsNumber(state.kroner.value) + action.amount;
  const kronerValid = ensureAmountIsAllowed(kroner);
  const kronerFormatted = formatNumberToLocale(kronerValid);
  return {
    value: kronerFormatted,
  };
};

const reduceOereForAmountIncreaserClick = (state, action) => {
  const currentKroner = getAmountAsNumber(state.kroner.value) + action.amount;
  const oere = calculateOereWhenKronerChanged(currentKroner, state.oere.value);
  return {
    value: oere,
  };
};

const reduceOereForReduxFormChange = (state, action) => {
  if (action.field !== 'kroner' && action.field !== 'oere') {
    return state.oere;
  }
  const oere = action.field === 'kroner'
    ? calculateOereWhenKronerChanged(action.value, state.oere.value)
    : action.value;

  return {
    value: oere,
  };
};

const reduceAmount = (kroner, oere) => {
  const amount = concatKronerAndOere(kroner, oere);
  return {
    value: amount,
  };
};

const reduceAmountForAmountIncreaserClick = (state, action) => {
  const kroner = getAmountAsNumber(state.kroner.value) + action.amount;
  const kronerFormatted = ensureAmountIsAllowed(kroner);

  return reduceAmount(kronerFormatted, state.oere.value);
};

const reduceAmountForReduxFormChange = (state, action) => {
  if (action.field !== 'kroner' && action.field !== 'oere') {
    return state.amount;
  }

  const amountNumber = getAmountAsNumber(action.value);
  const amount = ensureAmountIsAllowed(amountNumber);

  return action.field === 'kroner'
    ? reduceAmount(amount, state.oere.value)
    : reduceAmount(state.kroner.value, amount);
};

const reduceDueDate = (state, action) => {
  if (action.field !== 'dueDate') {
    return state.dueDate;
  }

  if (!action.value) {
    return state.dueDate;
  }

  const dueDate = DateTimeUtil.isValid(action.value)
    ? DateTimeUtil.parse(action.value).format(i18n.translate(i => i.DATE_FORMAT))
    : interpretTextAsDate(action.value);

  return {
    value: dueDate,
  };
};

const reduceOereForReduxFormBlur = (state, action) => {
  if (action.field !== 'oere') {
    return state.oere;
  }

  const isOereEmptyOrZero = state.oere.value === '' || state.oere.value === '0';
  const isKronerEmptyOrZero = state.kroner.value === '0' || state.kroner.value === '00';
  const isKronerGreaterThanZero = state.kroner.value && !isKronerEmptyOrZero;

  const oere = isOereEmptyOrZero && isKronerGreaterThanZero
    ? '00'
    : state.oere.value;

  return {
    value: oere,
  };
};

const reduceKronerForReduxFormBlur = (state, action) => {
  if (action.field !== 'kroner') {
    return state.kroner;
  }
  if (state.kroner.value === '') {
    return state.kroner;
  }

  const kroner = getAmountAsNumber(state.kroner.value);
  const kronerValid = ensureAmountIsAllowed(kroner);
  const kronerFormatted = formatNumberToLocale(kronerValid);

  return {
    value: kronerFormatted,
    originalValue: state.kroner.value,
  };
};

const reduceForReduxFormBlur = (state, action) =>
  Object.assign({}, state, {
    oere: reduceOereForReduxFormBlur(state, action),
    dueDate: reduceDueDate(state, action),
    kroner: reduceKronerForReduxFormBlur(state, action),
  });

const reduceForReduxFormFocus = (state, action) => {
  if (action.field === 'oere' && state.oere.value === '00') {
    return Object.assign({}, state, {
      oere: {
        value: '',
      },
    });
  } else if (action.field === 'kroner') {
    const kronerNumber = ensureNumberIsWithoutWhitespace(state.kroner.value);
    return Object.assign({}, state, {
      kroner: {
        value: kronerNumber || state.kroner.value,
      },
    });
  }
  return state;
};

const reduceForReduxFormChange = (state, action) =>
  Object.assign({}, state, {
    kroner: reduceKronerForReduxFormChange(state, action),
    oere: reduceOereForReduxFormChange(state, action),
    amount: reduceAmountForReduxFormChange(state, action),
  });

const reduceForAmountIncreaserClick = (state, action) =>
  Object.assign({}, state, {
    kroner: reduceKronerForAmountIncreaserClick(state, action),
    oere: reduceOereForAmountIncreaserClick(state, action),
    amount: reduceAmountForAmountIncreaserClick(state, action),
  });

const transferForm = (state = {}, action) => {
  switch (action.type) {
    case 'redux-form/FOCUS':
      return reduceForReduxFormFocus(state, action);
    case 'redux-form/BLUR':
      return reduceForReduxFormBlur(state, action);
    case 'redux-form/CHANGE':
      return reduceForReduxFormChange(state, action);
    case AMOUNT_INCREASER_AMOUNT_CLICK_TRANSFER: {
      return reduceForAmountIncreaserClick(state, action);
    }
    default:
      return state;
  }
};

export default transferForm;

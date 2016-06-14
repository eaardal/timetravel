import i18n from 'i18n/i18nCache';
import {
  isTextTooLong,
  isAccountValid,
  isAmountGreaterThanZero,
  isAmountNumeric,
  isAvailableAmountSufficient,
} from 'utils/validation.util';

const createValidator = () => (values) => {
  const errors = {};

  if (!isAccountValid(values.fromAccount)) {
    errors.fromAccount = i18n.translate(i => i.FROM_ACCOUNT_NOT_SELECTED);
  } else {
    const canValidateSufficientAmount = values.fromAccount && values.amount && values.dueDate;
    if (canValidateSufficientAmount && !isAvailableAmountSufficient(
      values.fromAccount.availableAmount, values.amount, values.dueDate)) {
      errors.amount = i18n.translate(i => i.BELOEP_STORRE_ENN_DISPONIBELT);
    }
  }

  if (!isAccountValid(values.toAccount)
    || values.toAccount.accountNumber === values.fromAccount.accountNumber) {
    errors.toAccount = i18n.translate(i => i.TO_ACCOUNT_NOT_SELECTED);
  }
  const kronerHasValue = values.kroner && values.kroner !== '0';
  const oereHasValue = values.oere && values.oere !== '0';

  const kronerIsNumeric = isAmountNumeric(values.kroner);
  const oereIsNumeric = isAmountNumeric(values.oere);

  const kronerIsNotZero = isAmountGreaterThanZero(values.kroner);
  const oereIsNotZero = isAmountGreaterThanZero(values.oere);

  const kronerValid = kronerHasValue && kronerIsNumeric && kronerIsNotZero;
  const oereValid = oereHasValue && oereIsNumeric && oereIsNotZero;

  const kronerIsZeroAndOereIsNotSet = values.kroner && values.kroner === '0' && !oereHasValue;
  const oereIsZeroAndKronerIsNotSet = values.oere
    && (values.oere === '0' || values.oere === '00')
    && !kronerHasValue;

  if (kronerValid && !oereHasValue && !errors.amount) {
    errors.amount = null;
  } else if (oereValid && !kronerHasValue && !errors.amount) {
    errors.amount = null;
  } else if (kronerHasValue && !kronerIsNumeric) {
    errors.amount = i18n.translate(i => i.KRONER_IS_INVALID);
  } else if (oereHasValue && !oereIsNumeric) {
    errors.amount = i18n.translate(i => i.OERE_IS_INVALID);
  } else if (kronerIsZeroAndOereIsNotSet || oereIsZeroAndKronerIsNotSet) {
    errors.amount = i18n.translate(i => i.AMOUNT_IS_ZERO);
  } else if (!kronerValid && !oereValid && !errors.amount) {
    errors.amount = i18n.translate(i => i.NO_AMOUNT);
  }

  if (values.message && !isTextTooLong(values.message, 70)) {
    errors.message = i18n.translate(i => i.MESSAGE_TOO_LONG);
  }

  return errors;
};

export default createValidator;

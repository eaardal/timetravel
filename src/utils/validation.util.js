import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import { getAmountAsNumber } from './format.util';
import DateTimeUtil from './dateTime.util';

/**
 * @description Validates the length of the given string.
 * @name validateTextLength
 * @param {String} value
 * @param {Int} maxLength
 * @returns {Bool}
 */
export const isTextTooLong = (value, maxLength) => {
  if (!isString(value)) {
    throw new Error('value to validate must be a string');
  }

  if (!isNumber(maxLength) || maxLength <= 0) {
    throw new Error('maxLength must be a number greater than 0');
  }

  return value.length <= maxLength;
};

export const isAmountGreaterThanZero = (amount) => {
  try {
    const amountNumber = getAmountAsNumber(amount);
    return amountNumber > 0;
  } catch (e) {
    return false;
  }
};

export const isAmountNumeric = (amount) => {
  const containsOnlyDigitsAndWhitespace = /^(\s*[0-9]+\s*)+$/;
  return containsOnlyDigitsAndWhitespace.test(amount);
};

export const isAccountValid = (account) => {
  if (!account) {
    return false;
  }

  if (!account.accountNumber || !account.accountName) {
    return false;
  }

  return true;
};

export const isAvailableAmountSufficient = (availableAmount, enteredAmount, dueDate) => {
  if (!isString(availableAmount) && !isNumber(availableAmount)) {
    throw new Error('availableAmount must be a number or a number represented as string');
  }

  if (!isString(enteredAmount) && !isNumber(enteredAmount)) {
    throw new Error('enteredAmount must be a number or a number represented as string');
  }

  if (!dueDate) {
    throw new Error('date must be a valid date object');
  }

  const availableAmountNumber = isNumber(availableAmount)
    ? availableAmount
    : getAmountAsNumber(availableAmount);

  const enteredAmountNumber = isNumber(enteredAmount)
    ? enteredAmount
    : getAmountAsNumber(enteredAmount);

  const date = DateTimeUtil.parse(dueDate);
  const now = DateTimeUtil.now();

  if (DateTimeUtil.isSame(date, now)) {
    return availableAmountNumber >= enteredAmountNumber;
  }
  return true;
};

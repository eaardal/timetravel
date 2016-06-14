import isString from 'lodash/isString';

import i18n from 'i18n/i18nCache';

export const formatAccountNumber
  = (number) => `${number.slice(0, 4)}.${number.slice(4, 6)}.${number.slice(6)}`;

export const stripWhitespace = (number) => {
  if (!isString(number)) {
    throw new Error('Provided number must be a string');
  }
  return number.replace(/\s/g, '');
};

export const ensureNumberIsWithoutWhitespace = (number) => {
  const numberString = isString(number) ? number : number.toString();
  const numberWithoutWhitespace = stripWhitespace(numberString);
  if (isNaN(numberWithoutWhitespace)) {
    return null;
  }
  return numberWithoutWhitespace;
};

export const getAmountAsNumber = (amount) => {
  const amountWithoutWhitespace = ensureNumberIsWithoutWhitespace(amount);
  return amountWithoutWhitespace === null
    ? amount
    : Number(amountWithoutWhitespace, 10);
};

export const formatNumberToLocale = (number) => {
  const numberWithoutWhitespace = ensureNumberIsWithoutWhitespace(number);
  return numberWithoutWhitespace === null
    ? number
    : i18n.translate(i => i.NUMBER_NO_DIGITS, { number: numberWithoutWhitespace });
};

export const formatNumberToLocaleWithTwoDecimals = (number) => {
  const numberWithoutWhitespace = ensureNumberIsWithoutWhitespace(number);
  return numberWithoutWhitespace === null
    ? number
    : i18n.translate(i => i.NUMBER_TWO_DIGITS, { number: numberWithoutWhitespace });
};

export const prependLeadingZero = (number) => {
  const numberString = number.toString();
  if (numberString.length > 1) {
    return numberString;
  }
  return number > 9 ? numberString : `0${number}`;
};

export const concatKronerAndOere = (kroner, oere) => {
  const kronerNumber = getAmountAsNumber(kroner);

  if (oere === '0') {
    return kronerNumber;
  }

  const oereFormatted = prependLeadingZero(oere);

  const amount = `${kronerNumber}.${oereFormatted}`;
  return getAmountAsNumber(amount);
};

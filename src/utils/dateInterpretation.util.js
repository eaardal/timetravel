import isNumber from 'lodash/isNumber';
import toString from 'lodash/toString';

import DateTimeUtil from './dateTime.util';
import i18n from 'i18n/i18nCache';

const formats = [
  'D',
  'D.',
  'D.M',
  'DDMM',
  'D.M.YY',
  'DDMMYY',
  'D.M.YYYY',
  'DDMMYYYY',
  'DDMM.YYYY',
  'DD.MMYYYY',
  'DD.MMYY',
  'DDMM.YY',
  'D.M.',
];

const adjustForZeroIndex = (month) => month + 1;

const nextMonth = (currentMonth) => {
  const newMonth = currentMonth + 1;
  return newMonth > 12 ? 1 : newMonth;
};

const tryGetDateByFormat = (text, format) => {
  const result = DateTimeUtil.parse(text, format);
  return result.isValid() ? result : null;
};

const tryGetYearByFormat = (text, format) => {
  const date = tryGetDateByFormat(text, format);
  return date !== null ? date.year() : null;
};

const tryGetMonthByFormat = (text, format) => {
  const date = tryGetDateByFormat(text, format);
  return date !== null ? adjustForZeroIndex(date.month()) : null;
};

const extractDay = (text) => {
  const indexOfDot = text.indexOf('.');
  const containsDot = indexOfDot > -1;
  if (containsDot && indexOfDot <= 2) {
    return text.split('.')[0];
  } else if (containsDot && indexOfDot === 4) {
    return text.substring(0, 2);
  } else if (text.length > 2) {
    return text.substring(0, 2);
  }
  return text;
};

const canExtractMonth = (text) => {
  const indexOfDot = text.indexOf('.');
  const containsDot = indexOfDot > -1;
  const endsWithDot = text.endsWith('.');

  // Matches DD.M(...), D.M(...), .M(...)
  const dotIsSeparatingDayAndMonth = (containsDot && !endsWithDot && indexOfDot <= 2);

  // Matches DDMM.Y(...)
  const dotIsSeparatingMonthAndYear = (containsDot && !endsWithDot && indexOfDot === 4);

  const textContainsMonth = (text.length >= 4);

  return dotIsSeparatingDayAndMonth || dotIsSeparatingMonthAndYear || textContainsMonth;
};

const extractMonthByFormat = (text) => {
  for (const format of formats) {
    const month = tryGetMonthByFormat(text, format);
    if (month !== null) {
      return month;
    }
  }
  return null;
};

const extractMonth = (text) => {
  if (canExtractMonth(text)) {
    return extractMonthByFormat(text);
  }
  return null;
};

const extractYear = (text) => {
  for (const format of formats) {
    const year = tryGetYearByFormat(text, format);
    if (year !== null) {
      return year;
    }
  }
  return null;
};

const isYearInText = (text) => {
  const yearRegexes = [
    /^.{4}\..*$/,                   // Matches DDMM.(...)
    /^[0-9]\.[0-9]\.[0-9]{2,4}$/,   // Matches D.D.YY or D.D.YYYY
    /^[0-9]{2}\.[0-9]{4,6}$/,       // Matches DD.MMYY or DD.MMYYYY
    /^[0-9]{4}[0-9]{2,4}$/,         // Matches DDMMYY or DDMMYYYY
  ];

  return yearRegexes.find(regex => regex.test(text) !== false);
};

const isDayEarlierThanToday = (day) => day < DateTimeUtil.now().date();

const isCurrentMonth = (month) => {
  const today = DateTimeUtil.now();
  return month === adjustForZeroIndex(today.month());
};

const isDayInCurrentMonth = (day) => {
  const today = DateTimeUtil.now();
  return today.daysInMonth() >= day;
};

const isMonthEarlierThanCurrent = (month) => {
  const today = DateTimeUtil.now();
  return month < adjustForZeroIndex(today.month());
};

const findMonthWhenNotSpecified = (day) => {
  const month = adjustForZeroIndex(DateTimeUtil.now().month());
  return isDayEarlierThanToday(day) || !isDayInCurrentMonth(day)
    ? nextMonth(month)
    : month;
};

const getDay = (text) => extractDay(text);

const getMonth = (day, text) => {
  const month = extractMonth(text);
  return month === null
    ? findMonthWhenNotSpecified(day)
    : month;
};

const shouldAddYear = (day, month, text) => {
  const monthIsEarlierAndYearNotInText = isMonthEarlierThanCurrent(month) && !isYearInText(text);
  const dayIsEarlierAndIsCurrentMonthAndYearNotInText = isDayEarlierThanToday(day)
    && isCurrentMonth(month) && !isYearInText(text);
  return monthIsEarlierAndYearNotInText || dayIsEarlierAndIsCurrentMonthAndYearNotInText;
};

const getYear = (day, month, text) => {
  const today = DateTimeUtil.now();
  if (shouldAddYear(day, month, text)) {
    return today.year() + 1;
  } else if (isYearInText(text)) {
    return extractYear(text);
  }
  return today.year();
};

const validateText = (text) => {
  if (text.length === 2 && parseInt(text, 10) < 32) {
    return true;
  }
  const parsedText = DateTimeUtil.parse(text, formats);
  return parsedText.isValid();
};

const sanitizeInput = (input) => {
  if (isNumber(input)) {
    return toString(input);
  }
  return input;
};

const constructDate = (day, month, year) => {
  const date = `${day}.${month}.${year}`;
  return DateTimeUtil.parse(date);
};

export const interpretTextAsDate = (input) => {
  const text = sanitizeInput(input);
  const isValidInput = validateText(text);

  if (isValidInput) {
    const day = getDay(text);
    const month = getMonth(day, text);
    const year = getYear(day, month, text);
    const date = constructDate(day, month, year);
    return date.format(i18n.translate(i => i.DATE_FORMAT));
  }
  return input;
};

export default {
  interpretTextAsDate,
};

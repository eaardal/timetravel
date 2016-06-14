import i18n from 'i18n/i18nCache';

const weekdaysShort = [
  'WEEKDAY_SHORT_0',
  'WEEKDAY_SHORT_1',
  'WEEKDAY_SHORT_2',
  'WEEKDAY_SHORT_3',
  'WEEKDAY_SHORT_4',
  'WEEKDAY_SHORT_5',
  'WEEKDAY_SHORT_6',
];
const weekdaysLong = [
  'WEEKDAY_LONG_0',
  'WEEKDAY_LONG_1',
  'WEEKDAY_LONG_2',
  'WEEKDAY_LONG_3',
  'WEEKDAY_LONG_4',
  'WEEKDAY_LONG_5',
  'WEEKDAY_LONG_6',
];
const months = [
  'MONTH_0',
  'MONTH_1',
  'MONTH_2',
  'MONTH_3',
  'MONTH_4',
  'MONTH_5',
  'MONTH_6',
  'MONTH_7',
  'MONTH_8',
  'MONTH_9',
  'MONTH_10',
  'MONTH_11',
];

const firstDayOfWeek = 1;

const getMonths = () => months.map((month) => i18n.translate(i => i[month]));

const getDayOfWeek = (date) => {
  if (date.getDay() < firstDayOfWeek) {
    return 7 - firstDayOfWeek;
  }
  return date.getDay() - firstDayOfWeek;
};

const localeUtils = {
  formatDay: (d) =>
    `${i18n.translate(i => i[weekdaysLong[getDayOfWeek(d)]])} ${d.getDate()} ` +
    `${i18n.translate(i => i[months[d.getMonth()]])} ${d.getFullYear()}`,
  formatWeekdayShort: (index) => i18n.translate(i => i[weekdaysShort[index]]),
  formatWeekdayLong: (index) => i18n.translate(i => i[weekdaysLong[index]]),
  getFirstDayOfWeek: () => firstDayOfWeek,
  getMonths: () => getMonths(),
  formatMonthTitle: (d) =>
    `${i18n.translate(i => i[months[d.getMonth()]])} ` +
    `${d.getFullYear()}`,
};

export default localeUtils;

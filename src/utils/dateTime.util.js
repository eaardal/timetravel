import moment from 'moment';
import i18n from 'i18n/i18nCache';

class DateTimeUtil {
  static now() {
    return moment();
  }

  static isSame(date1, date2) {
    return moment(date1).isSame(date2, 'day');
  }

  static isAfter(dateToCheck, dateBaseline) {
    return moment(dateToCheck).isAfter(dateBaseline, 'day');
  }

  static isBefore(dateToCheck, dateBaseline) {
    return moment(dateToCheck).isBefore(dateBaseline, 'day');
  }

  static parseLenient(...date) {
    return moment(...date);
  }

  static parse(date, formats) {
    const format = formats || i18n.translate(i => i.PARSE_DATE_FORMAT);
    return moment(date, format, true);
  }

  static parseIsoDate(date) {
    return moment(date, moment.ISO_8601);
  }

  static locale() {
    return moment.locale();
  }

  static isValid(date) {
    const parsedDate = DateTimeUtil.parse(date);
    return parsedDate.isValid();
  }
}

export default DateTimeUtil;

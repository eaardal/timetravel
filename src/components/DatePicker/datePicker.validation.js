import dateTimeUtil from 'utils/dateTime.util';
import i18n from 'i18n/i18nCache';

const createDateValidator = (fieldName, minDate, maxDate) => values => {
  const errors = {};

  if (values[fieldName] === '') {
    errors[fieldName] = i18n.translate(i => i.MISSING_DATE);
    return errors;
  }

  const date = dateTimeUtil.parse(values[fieldName]);

  if (!date.isValid()) {
    errors[fieldName] = i18n.translate(i => i.INVALID_DATE_FORMAT, { format:
      i18n.translate(i => i.DATE_DISPLAY_FORMAT) });
  } else if (dateTimeUtil.isBefore(date, minDate)) {
    errors[fieldName] = i18n.translate(i => i.INVALID_DATE_BEFORE,
      { date: minDate.clone().add(-1, 'days').toDate() });
  } else if (dateTimeUtil.isAfter(date, maxDate)) {
    errors[fieldName] = i18n.translate(i => i.INVALID_DATE_AFTER,
      { date: maxDate.clone().add(1, 'days').toDate() });
  }

  return errors;
};
export default createDateValidator;

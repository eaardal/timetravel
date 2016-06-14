import React, { PropTypes } from 'react';

const DatePickerHeader = ({ date, localeUtils, locale }) => {
  const months = localeUtils.getMonths(locale);
  return (
    <div className="DayPicker-Caption" role="heading">
      {months[date.getMonth()]}
      &nbsp;
      <span className="DayPicker-Caption-year">{date.getFullYear()}</span>
    </div>
  );
};

DatePickerHeader.propTypes = {
  date: PropTypes.object,
  localeUtils: PropTypes.object,
  locale: PropTypes.string,
};

export default DatePickerHeader;

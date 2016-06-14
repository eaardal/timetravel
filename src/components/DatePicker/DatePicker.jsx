import React, { PropTypes } from 'react';
import DayPicker from 'react-day-picker';
import LocaleUtils from 'utils/dateLocale.util';
import DateTimeUtil from 'utils/dateTime.util';
import DatePickerHeader from './DatePickerHeader';
import DatePickerDate from './DatePickerDate';
import DatePickerNavbar from './DatePickerNavbar';
import keyCodes from 'common/keyCodes';

class DatePicker extends React.Component {

  componentDidMount() {
    this.refs.dayPickerComponent.refs.dayPicker.focus();
  }

  render() {
    const { minDate, maxDate, selectedDate, onSelectDate } = this.props;
    const isDisabledDate = (day) => {
      const momentDay = DateTimeUtil.parseLenient(day);
      return DateTimeUtil.isBefore(momentDay, minDate) ||
             DateTimeUtil.isAfter(momentDay, maxDate);
    };

    const isSelectedDate = (day) => {
      const calendarDay = DateTimeUtil.parseLenient(day);
      return DateTimeUtil.isSame(calendarDay, selectedDate);
    };

    const onDayClick = (e, day, { disabled }) => {
      e.stopPropagation();
      e.preventDefault();
      if (!disabled) {
        const date = DateTimeUtil.parseLenient(day);
        onSelectDate(date);
      }
    };

    const initialMonth = !selectedDate.isValid() || isDisabledDate(selectedDate)
      ? DateTimeUtil.now()
      : selectedDate;

    const onKeypress = (e) => {
      if (e.keyCode === keyCodes.ESCAPE) {
        onSelectDate(DateTimeUtil.parse(selectedDate));
      } else if (e.keyCode === keyCodes.TAB) {
        if (e.target.id === 'DayPicker' && e.shiftKey ||
            e.target.classList.contains('DayPicker-Day') && !e.shiftKey) {
          setTimeout(() => {  // Timeout to fix IE tab order quirk
            onSelectDate(DateTimeUtil.parse(selectedDate));
          }, 0);
        }
      }
    };

    return (<DayPicker
      enableOutsideDays
      ref="dayPickerComponent"
      navbarComponent={ DatePickerNavbar }
      fromMonth={ minDate.toDate() }
      toMonth={ maxDate.toDate() }
      initialMonth={ initialMonth.toDate() }
      modifiers={{ disabled: isDisabledDate, selected: isSelectedDate }}
      onDayClick={ onDayClick }
      onKeyDown= { onKeypress }
      localeUtils={ LocaleUtils }
      captionElement={ <DatePickerHeader /> }
      renderDay={ DatePickerDate }
      id="DayPicker"
    />);
  }
}

DatePicker.propTypes = {
  selectedDate: PropTypes.object.isRequired,
  minDate: PropTypes.object.isRequired,
  maxDate: PropTypes.object.isRequired,
  onSelectDate: PropTypes.func,
};

export default DatePicker;

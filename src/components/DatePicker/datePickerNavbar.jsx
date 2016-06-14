import React, { PropTypes } from 'react';

const buttonBaseClass = 'DayPicker-NavButton DayPicker-NavButton';

export default function Navbar({
  className,
  showPreviousButton,
  showNextButton,
  onPreviousClick,
  onNextClick,
  dir,
}) {
  const previousClickHandler = (e) => {
    e.preventDefault();
    onPreviousClick();
  };
  const nextClickHandler = (e) => {
    e.preventDefault();
    onNextClick();
  };

  const previousButton = showPreviousButton &&
    <span
      role="button"
      key="previous"
      className={`${buttonBaseClass}--prev`}
      touchEnd={(e) => previousClickHandler(e)}
      onClick={(e) => previousClickHandler(e)}
    />;

  const nextButton = showNextButton &&
    <span
      role="button"
      key="right"
      className={`${buttonBaseClass}--next`}
      touchEnd={(e) => nextClickHandler(e)}
      onClick={(e) => nextClickHandler(e)}
    />;

  return (
    <div className={className}>
      {dir === 'rtl' ? [nextButton, previousButton] : [previousButton, nextButton]}
    </div>
  );
}

export const NavbarPropTypes = {
  className: PropTypes.string,
  nextMonth: PropTypes.instanceOf(Date),
  previousMonth: PropTypes.instanceOf(Date),
  showPreviousButton: PropTypes.bool,
  showNextButton: PropTypes.bool,
  onPreviousClick: PropTypes.func,
  onNextClick: PropTypes.func,
  dir: PropTypes.string,
  locale: PropTypes.string,
};

Navbar.propTypes = NavbarPropTypes;

Navbar.defaultProps = {
  className: 'DayPicker-NavBar',
  dir: 'ltr',
  showPreviousButton: true,
  showNextButton: true,
};

import React, { PropTypes } from 'react';

const ResetButton = ({ onClick, type }) => {
  if (!onClick) {
    return null;
  }

  const click = (ev) => {
    onClick(ev);
  };

  return (
    <button
      type="button"
      className={`form-control__button form-control__${type}`}
      tabIndex="0"
      onClick={ click }
    >
      <i className={`icon icon-${type}`}></i>
    </button>
  );
};

ResetButton.propTypes = {
  getInputcontrol: PropTypes.func,
  onClick: PropTypes.func,
  type: PropTypes.string,
};

export default ResetButton;

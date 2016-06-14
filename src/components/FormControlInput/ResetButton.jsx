import React, { PropTypes } from 'react';

const ResetButton = ({ getInputcontrol, fields }) => {
  if (!fields || !fields.value || !getInputcontrol) {
    return null;
  }

  if (fields && fields.value.length <= 0) {
    return null;
  }

  const resetButtonClick = () => {
    fields.onChange(fields.initialValue);
    getInputcontrol().focus();
  };

  return (
    <span className="form-control__clear" role="button" onClick={resetButtonClick}>
      <i className="icon icon-times"></i>
    </span>
  );
};

ResetButton.propTypes = {
  getInputcontrol: PropTypes.func,
  fields: PropTypes.object,
};

export default ResetButton;

import React, { PropTypes } from 'react';

const TimetravelButton = ({ onClick, text }) => (
  <div>
    <h3>{text}</h3>
      <button onClick={onClick}>
        {text}
      </button>
  </div>
);

TimetravelButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default TimetravelButton;

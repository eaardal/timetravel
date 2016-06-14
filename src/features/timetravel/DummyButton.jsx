import React, { PropTypes } from 'react';

const DummyButton = ({ onClick, text }) => (
  <div>
    <h3>{text}</h3>
      <button onClick={onClick}>
        {text}
      </button>
  </div>
);

DummyButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default DummyButton;

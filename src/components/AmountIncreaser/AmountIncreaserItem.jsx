import React from 'react';

const AmountIncreaserItem = ({ amount, onAmountClick }) => {
  const handleClick = (ev) => {
    ev.preventDefault();
    onAmountClick(amount);
  };

  return (
    <button type="button" className="amount-increaser__item" href="" onClick={handleClick}>
      <span><span className="amount-increaser__plus">+</span>{amount}</span>
    </button>
  );
};

AmountIncreaserItem.propTypes = {
  amount: React.PropTypes.number.isRequired,
  onAmountClick: React.PropTypes.func.isRequired,
};

export default AmountIncreaserItem;

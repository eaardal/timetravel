import React from 'react';

import AmountIncreaserItem from './AmountIncreaserItem';

const AmountIncreaser = ({ classNames, onAmountClick, amounts }) =>
  <div className={`amount-increaser ${classNames}`}>
    { amounts.map((amount) =>
      <AmountIncreaserItem
        key={amount}
        amount={amount}
        onAmountClick={onAmountClick}
      />
    )}
  </div>;

AmountIncreaser.propTypes = {
  onAmountClick: React.PropTypes.func.isRequired,
  amounts: React.PropTypes.array.isRequired,
  classNames: React.PropTypes.string,
};


export default AmountIncreaser;

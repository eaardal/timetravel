import React, { PropTypes } from 'react';
import i18n from 'i18n/i18nCache';
import { formatAccountNumber } from 'utils/format.util';

const AccountItem = ({ accountName, accountNumber, availableAmount, isDisabled, isMarkedInList }) =>
  (
    <div>
      <div className={`account-picker__account-name
        ${isDisabled ? 'account-picker__account-name--disabled' : ''}
        ${isMarkedInList ? 'account-picker__account-name--selected' : ''}`}
      >
        {accountName}
      </div>
      <div
        className={`account-picker__account-details
          ${isDisabled ? 'account-picker__account-details--disabled' : ''}
          ${isMarkedInList ? 'account-picker__account-details--selected' : ''}`}
      >
        {formatAccountNumber(accountNumber)}
         <span className="account-picker__account-amount">
           { availableAmount !== null
             ? i18n.translate(i => i.DISPONIBELT, { amount: availableAmount })
             : null
           }
         </span>
     </div>
    </div>
  );

AccountItem.propTypes = {
  accountName: PropTypes.string.isRequired,
  accountNumber: PropTypes.string.isRequired,
  availableAmount: PropTypes.number,
  isDisabled: PropTypes.bool,
  isMarkedInList: PropTypes.bool,
};

export default AccountItem;

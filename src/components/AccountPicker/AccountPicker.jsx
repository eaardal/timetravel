import React, { PropTypes } from 'react';
import AccountItem from './AccountPickerItem';
import AccountListItem from './AccountPickerListItem';
import keyCodes from 'common/keyCodes';
import i18n from 'i18n/i18nCache';
import AlertBox from 'components/AlertBox/AlertBox';

const AccountPicker = ({
    accounts,
    selectedAccount,
    isFetchingAccounts,
    accountListVisible,
    hasFocus,
    onBlurAccounts,
    onSelectAccount,
    onDropdownClick,
    onFocusAccounts,
    onKeyHandling,
    defaultChoiceMessage,
    label,
    id,
    fields,
  }) => {
  if (isFetchingAccounts) {
    return (
      <div className="form-group account-picker">
        <div className="account-picker__select account-picker__select--nonfocused">
           <div className="account-picker__defaultmsg account-picker__defaultmsg--loading">
             <div><span>{ i18n.translate(i => i.FETCHING_KONTOER) }</span></div>
          </div>
          <div className="account-picker__arrow">
            <div className="account-picker__arrow--loading">
            </div>
          </div>
        </div>
      </div>);
  }

  const kontoInformation = () => {
    const title = i18n.translate(i => i.OVERFOERE_FROM_KREDITTKORT_TITLE);
    const text = i18n.translate(i => i.OVERFOERE_FROM_KREDITTKORT_TEXT);
    const isKredittkort = selectedAccount
      && selectedAccount.kontotype
      && selectedAccount.kontotype.toLowerCase() === 'kredittkort';

    return isKredittkort
      ? <AlertBox className="account-picker-info" type="info">
          <p style={{ marginBottom: '2px' }}><b>{title}</b></p>
          <p>{text}</p>
        </AlertBox>
      : null;
  };

  const errorMessageElement = fields.error && fields.touched
    ? <span>{fields.error}</span>
    : null;

  const onKeyDown = (ev) => {
    if (ev.keyCode === keyCodes.ARROW_UP || ev.keyCode === keyCodes.ARROW_DOWN) {
      ev.preventDefault();
    }
    onKeyHandling(ev);
  };

  return (
    <div>
       <div
         id={id}
         tabIndex="0"
         onClick={onDropdownClick}
         onKeyDown={onKeyDown}
         onBlur={onBlurAccounts}
         onFocus={onFocusAccounts}
         className={`form-group account-picker
           ${selectedAccount ? 'form-group--active account-picker--active' : ''}
           ${errorMessageElement ? 'form-group--error' : ''}`}
         role="combobox"
         aria-labelledby={label}
         aria-expanded={`${accountListVisible ? 'true' : 'false'}`}
         aria-owns={`${id}-listbox`}
         aria-activedescendant={`${selectedAccount
           ? `${id}-${selectedAccount.accountNumber}` : ''}`}
       >
         <div
           className={`account-picker__select
             ${selectedAccount ? 'account-picker__select--active' : ''}
             ${hasFocus ? 'account-picker__select--focused' : 'account-picker__select--nonfocused'}
             ${accountListVisible ? 'account-picker__select--expanded' : ''}`}
         >
           <div
             className={`account-picker__defaultmsg
               ${(!selectedAccount || accountListVisible)
                 ? 'account-picker__defaultmsg--active' : ''}`}
           >
             <div>
               <span>{defaultChoiceMessage}</span>
             </div>
           </div>
           <div
             className={`account-picker__selected-account
               ${(selectedAccount && !accountListVisible)
                 ? 'account-picker__selected-account--active' : ''}`}
           >
             <div>
               {selectedAccount &&
                 <AccountItem {...selectedAccount} />
               }
             </div>
           </div>
           <div className="account-picker__arrow">
             <i
               className={`icon
                 ${accountListVisible ? 'icon-caret-up' : 'icon-caret-down'}`}
             ></i>
           </div>
         </div>
         <label
           className={`account-picker__label
             ${selectedAccount ? 'account-picker__label--active' : ''}`}
         >
          {label}
         </label>
         {accounts &&
           <ul role="listbox" id={`${id}-listbox`} className={
               `account-picker__account-list
               ${accountListVisible ? 'account-picker__account-list--active' : ''}`}
           >
             {
               accounts.map((account) =>
                 (<AccountListItem
                   account={account}
                   key={account.accountNumber}
                   handleClick={onSelectAccount}
                   id={id}
                 />)
               )
             }
           </ul>
         }
         {kontoInformation()}
         <div className="form-error form-error--active" role="alert">{errorMessageElement}</div>
       </div>
       </div>
     );
};

AccountPicker.propTypes = {
  accounts: PropTypes.array,
  isFetchingAccounts: PropTypes.bool,
  accountListVisible: PropTypes.bool,
  onSelectAccount: PropTypes.func.isRequired,
  onDropdownClick: PropTypes.func.isRequired,
  onBlurAccounts: PropTypes.func.isRequired,
  onFocusAccounts: PropTypes.func.isRequired,
  selectedAccount: PropTypes.object,
  defaultChoiceMessage: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  hasFocus: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onKeyHandling: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
};

export default AccountPicker;

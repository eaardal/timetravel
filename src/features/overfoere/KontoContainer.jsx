import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ClickOutsideHandler from 'components/ClickOutsideHandler/ClickOutsideHandler';
import {
  onBlurAccountPicker,
  toggleAccountList,
  onFocusAccountPicker,
} from 'components/AccountPicker/accountPicker.actions';
import {
  getAccountLists,
  onClickSelectFromAccountItem,
  onClickSelectToAccountItem,
  onKeypressedFromAccountPicker,
  onKeypressedToAccountPicker,
} from './overfoere.actions';
import AccountPicker from 'components/AccountPicker/AccountPicker';
import i18n from 'i18n/i18nCache';

class TransferAccountsContainer extends React.Component {
  componentWillMount() {
    this.props.getAccountLists();
  }

  render() {
    const {
      fromAccountsPicker,
      toAccountsPicker,
      toggleFromAccounts,
      toggleToAccounts,
      onBlurFromAccounts,
      onBlurToAccounts,
      onFocusFromAccounts,
      onFocusToAccounts,
      onClickSelectFromAccount,
      onClickSelectToAccount,
      onKeypressedFromAccounts,
      onKeypressedToAccounts,
      fields,
    } = this.props;

    return (
      <div>
        <ClickOutsideHandler
          subscribe={ (fromAccountsPicker && fromAccountsPicker.accountListVisible) }
          containerId="fromAccountsPicker"
        />
        <ClickOutsideHandler
          subscribe={ (toAccountsPicker && toAccountsPicker.accountListVisible) }
          containerId="toAccountsPicker"
        />
        <div>
          <AccountPicker
            {...fromAccountsPicker}
            onSelectAccount={onClickSelectFromAccount}
            onDropdownClick={toggleFromAccounts}
            onBlurAccounts={onBlurFromAccounts}
            onFocusAccounts={onFocusFromAccounts}
            onKeyHandling={onKeypressedFromAccounts}
            defaultChoiceMessage={ i18n.translate(i => i.FRA_KONTO_DEFAULTCHOICE) }
            label={ i18n.translate(i => i.FRA_KONTO_INPUT_LABEL) }
            id="fromAccountsPicker"
            fields={fields.fromAccount}
          />
        </div>
        <div>
          <AccountPicker
            {...toAccountsPicker}
            onSelectAccount={onClickSelectToAccount}
            onDropdownClick={toggleToAccounts}
            onBlurAccounts={onBlurToAccounts}
            onFocusAccounts={onFocusToAccounts}
            onKeyHandling={onKeypressedToAccounts}
            defaultChoiceMessage={ i18n.translate(i => i.TIL_KONTO_DEFAULTCHOICE) }
            label={ i18n.translate(i => i.TIL_KONTO_INPUT_LABEL) }
            id="toAccountsPicker"
            fields={fields.toAccount}
          />
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  transferForm: state.form.transfer,
  fromAccountsPicker: state.accountPickers.fromAccountsPicker,
  toAccountsPicker: state.accountPickers.toAccountsPicker,
});

const mapDispatchToProps = (dispatch) => ({
  getAccountLists: () => dispatch(getAccountLists()),
  toggleFromAccounts: () => dispatch(toggleAccountList('fromAccountsPicker')),
  toggleToAccounts: () => dispatch(toggleAccountList('toAccountsPicker')),
  onBlurFromAccounts: () => dispatch(onBlurAccountPicker('fromAccountsPicker')),
  onBlurToAccounts: () => dispatch(onBlurAccountPicker('toAccountsPicker')),
  onFocusFromAccounts: () => dispatch(onFocusAccountPicker('fromAccountsPicker')),
  onFocusToAccounts: () => dispatch(onFocusAccountPicker('toAccountsPicker')),
  onClickSelectFromAccount: (newAccount) => dispatch(onClickSelectFromAccountItem(newAccount)),
  onClickSelectToAccount: (newAccount) => dispatch(onClickSelectToAccountItem(newAccount)),
  onKeypressedFromAccounts: (keyEvent) => dispatch(onKeypressedFromAccountPicker(keyEvent)),
  onKeypressedToAccounts: (keyEvent) => dispatch(onKeypressedToAccountPicker(keyEvent)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransferAccountsContainer);

TransferAccountsContainer.propTypes = {
  transferForm: PropTypes.object,
  fromAccountsPicker: PropTypes.object,
  toAccountsPicker: PropTypes.object,
  toggleFromAccounts: PropTypes.func.isRequired,
  toggleToAccounts: PropTypes.func.isRequired,
  getAccountLists: PropTypes.func.isRequired,
  onBlurFromAccounts: PropTypes.func.isRequired,
  onBlurToAccounts: PropTypes.func.isRequired,
  onFocusFromAccounts: PropTypes.func.isRequired,
  onFocusToAccounts: PropTypes.func.isRequired,
  onClickSelectFromAccount: PropTypes.func.isRequired,
  onClickSelectToAccount: PropTypes.func.isRequired,
  onKeypressedFromAccounts: PropTypes.func.isRequired,
  onKeypressedToAccounts: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
};

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import AccountItem from './AccountPickerItem';

class AccountListItem extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidUpdate() {
    if (this.props.account.isMarkedInList && !this.props.account.wasMarkedInList) {
      ReactDOM.findDOMNode(this).scrollIntoViewIfNeeded(false);
    }
  }

  render() {
    const {
      id,
      account,
      handleClick,
    } = this.props;

    const onClick = (event) => {
      event.stopPropagation();
      event.preventDefault();
      handleClick(account);
    };

    return (
      <li
        role="option"
        id={`${id}-${account.accountNumber}`}
        className={`account-picker__account-list-item
          ${account.isDisabled ? '' : 'account-picker__account-list-item--enabled'}
          ${account.isMarkedInList ? ' account-picker__account-list-item--selected' : ''}
          `}
        onClick={onClick}
      >
        <AccountItem {...account} />
      </li>
    );
  }
}

AccountListItem.propTypes = {
  account: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
};

export default AccountListItem;

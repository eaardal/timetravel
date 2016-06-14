import React from 'react';

import AlertBox from 'components/AlertBox/AlertBox';
import NavList from 'components/NavList/NavList';
import i18n from 'i18n/i18nCache';
import { PAY, CREATE_ACCOUNT, DUE_OVERVIEW, LATEST_MOVEMENTS } from 'common/links';

const noAccountsLinks = [PAY, CREATE_ACCOUNT, DUE_OVERVIEW, LATEST_MOVEMENTS];

const noAccounts = () => (
  <main role="main" className="l-transfer__alert">
    <AlertBox type="info" large title={ i18n.translate(i => i.NO_ACCOUNTS_TO_TRANSFER_BETWEEN) }>
      <p>{ i18n.translate(i => i.NO_ACCOUNTS_TO_TRANSFER_BETWEEN_HELPTEXT) }
        <a href="#">{ i18n.translate(i => i.NO_ACCOUNTS_FOR_TRANSFER_LINK) }</a>.
      </p>
    </AlertBox>
    <NavList links={noAccountsLinks} />
  </main>
);

export default noAccounts;

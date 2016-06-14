import React from 'react';

import AlertBox from 'components/AlertBox/AlertBox';
import i18n from 'i18n/i18nCache';

const transferSuccess = () => (
  <main role="main" className="l-transfer__alert">
    <AlertBox type="danger" large title={ i18n.translate(i => i.TRANSFER_ERROR_TITLE) }>
      <p>
        { i18n.translate(i => i.TRANSFER_ERROR_MESSAGE) }
      </p>
    </AlertBox>
  </main>
);

export default transferSuccess;

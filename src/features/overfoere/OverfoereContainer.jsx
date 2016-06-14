import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import MainPanel from './OverfoereMainPanel';
import SuccessPanel from './kvittering/KvitteringSuccess';
import ErrorPanel from './kvittering/KvitteringError';
import NoAccountsPanel from './kvittering/KvitteringNoAccounts';

const getMainContent = (state) => {
  if (state.toFewAccounts) {
    return <NoAccountsPanel />;
  } else if (state.transferError) {
    return <ErrorPanel />;
  } else if (state.transferSuccess) {
    return <SuccessPanel {...state.transferSuccess} />;
  }
  return (
    <MainPanel />
  );
};

const Transfer = ({ transferState }) => (
  <div className="l-transfer">
    <h1 className="l-transfer__heading">Overføre</h1>
    {getMainContent(transferState)}
    <aside role="complementary" className="l-transfer__aside">
      <div className="l-transfer__info-card">
        <h3 className="l-transfer__info-heading">Oppgjørstider</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Curabitur tempus urna ut scelerisque facilisis.
          Quisque dictum nunc at est blandit, nec tempus arcu laoreet.
        </p>
      </div>
      <div className="l-transfer__info-card">
        <h3 className="l-transfer__info-heading">Tips</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Curabitur tempus urna ut scelerisque facilisis.
          Quisque dictum nunc at est blandit, nec tempus arcu laoreet.
        </p>
      </div>
    </aside>
  </div>
);

Transfer.propTypes = {
  transferState: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  transferState: state.transfer,
});

export default connect(
  mapStateToProps
)(Transfer);

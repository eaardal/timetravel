import React, { PropTypes } from 'react';

import AlertBox from 'components/AlertBox/AlertBox';
import NavList from 'components/NavList/NavList';
import i18n from 'i18n/i18nCache';
import dateTimeUtil from 'utils/dateTime.util';
import { PAY, DUE_OVERVIEW, LATEST_MOVEMENTS, NEW_TRANSFER } from 'common/links';

const transferSuccessLinks = [NEW_TRANSFER, LATEST_MOVEMENTS, DUE_OVERVIEW, PAY];

const getOverfoertTodayBody = (fraKonto, tilKonto) => {
  if (tilKonto.saldo !== null) {
    return (
      <div>
        <p>
          { i18n.translate(i => i.HAS_NEW_BALANCE, { accountName: fraKonto.navn }) }
          <b>{ i18n.translate(i => i.NUMBER_TWO_DIGITS, { number: fraKonto.saldo }) }</b>
          <br />
          { i18n.translate(i => i.HAS_NEW_BALANCE, { accountName: tilKonto.navn }) }
          <b>{ i18n.translate(i => i.NUMBER_TWO_DIGITS, { number: tilKonto.saldo }) }</b>
        </p>
      </div>
    );
  }
  return (
    <div>
      <p>
        { i18n.translate(i => i.OVERFORING_UTFORT_TEKST_FRA, { accountName: fraKonto.navn }) }
      <br />
        { i18n.translate(i => i.OVERFORING_UTFORT_TEKST_TIL, { accountName: tilKonto.navn }) }
      </p>
    </div>
  );
};

const transferSuccess = ({
    fraKonto,
    tilKonto,
    beloep,
    overfoertToday,
    overfoeringsDato,
  }) => {
  const title = overfoertToday
    ? i18n.translate(i => i.OVERFORING_UTFORT_TITTEL, { amount: beloep })
    : i18n.translate(i => i.OVERFORING_FORFALL_TITTEL);

  const formattedDate = dateTimeUtil.isAfter(overfoeringsDato,
    dateTimeUtil.now().add(12, 'M').subtract(1, 'd'))
    ? i18n.translate(i => i.FULL_DATE, { dato: overfoeringsDato })
    : i18n.translate(i => i.FULL_DATE_NO_YEAR, { dato: overfoeringsDato });

  const body = overfoertToday
    ? getOverfoertTodayBody(fraKonto, tilKonto)
    : <div>
        <p>
          kr <b>{ i18n.translate(i => i.NUMBER_TWO_DIGITS, { number: beloep }) }</b>
        { i18n.translate(i => i.OVERFORING_FORFALL_TEKST,
            { fromAccount: fraKonto.navn, toAccount: tilKonto.navn }
          )}
          <b>{ formattedDate }</b>
      </p>
      </div>;

  return (
    <main role="main" className="l-transfer__alert">
      <AlertBox type="success" large title={title}>
        {body}
    </AlertBox>
    <NavList links={transferSuccessLinks} />
    </main>
  );
};


transferSuccess.propTypes = {
  fraKonto: PropTypes.object.isRequired,
  tilKonto: PropTypes.object.isRequired,
  beloep: PropTypes.number.isRequired,
  overfoertToday: PropTypes.bool.isRequired,
  overfoeringsDato: PropTypes.object.isRequired,
};

export default transferSuccess;

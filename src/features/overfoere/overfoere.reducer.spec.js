/* eslint max-len: 0 */

import { expect } from 'chai';
import moment from 'moment';
import deepFreeze from 'deep-freeze';
import transferReducer from './overfoere.reducer';
import {
  notEnoughAccountsToTransfer,
  receivePostTransferForm,
} from './overfoere.actions';
import i18n from 'i18n/i18nCache';

describe('Test transferReducer', () => {
  beforeEach(() => {
    i18n.initialize();
  });
  context('Action type: notEnoughAccountsToTransfer', () => {
    it('It should return the toFewAccounts = true', () => {
      const originalState = {
        toFewAccounts: false,
      };
      const newState = transferReducer(deepFreeze(originalState), notEnoughAccountsToTransfer());
      const expectedState = {
        toFewAccounts: true,
      };
      expect(newState).to.deep.equal(expectedState);
    });
  });

  context('Action: receivePostTransferForm', () => {
    it('It should return the correct state', () => {
      const successresponse = {
        debitAccountName: 'Regningskto',
        creditAccountName: 'Betaling lån',
        debitAccountBalance: 999.43,
        creditAccountBalance: 243.66,
        errorCode: 0,
        amount: 12.84,
        transferredToday: true,
        transferDate: '2016-05-11T00:00:00',
      };

      const originalState = {
        toFewAccounts: false,
        transferSuccess: null,
        transferError: false,
      };
      const successResult = {
        fraKonto: {
          navn: 'Regningskto',
          saldo: 999.43,
        },
        tilKonto: {
          navn: 'Betaling lån',
          saldo: 243.66,
        },
        beloep: 12.84,
        overfoertToday: successresponse.transferredToday,
        overfoeringsDato: moment(successresponse.transferDate),
      };

      const newState = transferReducer(deepFreeze(originalState), receivePostTransferForm(successresponse));
      const expectedState = {
        toFewAccounts: false,
        transferSuccess: successResult,
        transferError: false,
      };

      expect(newState).to.deep.equal(expectedState);
    });

    it('It should return the correct state when transferedToday is false', () => {
      const successresponse = {
        debitAccountName: 'Regningskto',
        creditAccountName: 'Betaling lån',
        debitAccountBalance: 999.43,
        creditAccountBalance: 243.66,
        errorCode: 0,
        amount: 12.84,
        transferredToday: false,
        transferDate: '2016-05-11T00:00:00',
      };
      const originalState = {
        toFewAccounts: false,
        transferSuccess: null,
        transferError: false,
      };
      const successResult = {
        fraKonto: {
          navn: 'Regningskto',
          saldo: 999.43,
        },
        tilKonto: {
          navn: 'Betaling lån',
          saldo: 243.66,
        },
        beloep: 12.84,
        overfoertToday: successresponse.transferredToday,
        overfoeringsDato: moment(successresponse.transferDate),
      };
      const newState = transferReducer(deepFreeze(originalState), receivePostTransferForm(successresponse));
      const expectedState = {
        toFewAccounts: false,
        transferSuccess: successResult,
        transferError: false,
      };
      expect(newState).to.deep.equal(expectedState);
    });
  });

  context('Action: unknown', () => {
    it('It should return the original state', () => {
      const originalState = {
        toFewAccounts: false,
      };
      const newState = transferReducer(deepFreeze(originalState), { type: 'NONE_EXISTING_ACTION' });
      const expectedState = {
        toFewAccounts: false,
      };
      expect(newState).to.deep.equal(expectedState);
    });
  });
});

/* eslint no-unused-expressions: 0 */

import { expect } from 'chai';

import { hasEnoughAccountsForTransfer } from './account.util';

describe('Test accountUtils', () => {
  context('hasEnoughAccountsForTransfer', () => {
    const multiAccountList = [{
      name: 'kontonavn1',
      accountNumber: '1234 56 789',
      availableAmount: parseInt(1000, 10),
    }, {
      name: 'kontonavn2',
      accountNumber: '1234 56 710',
      availableAmount: parseInt(1000, 10),
    }];
    const singleAccount1 = [{
      name: 'kontonavn3',
      accountNumber: '1234 56 711',
      availableAmount: parseInt(1000, 10),
    }];
    const singleAccount2 = [{
      name: 'kontonavn4',
      accountNumber: '1234 56 712',
      availableAmount: parseInt(1000, 10),
    }];

    it('Should exist - ice breaker', () => {
      expect(hasEnoughAccountsForTransfer).to.exist;
    });

    it('Should return true if each accountlist contains multiple accounts', () => {
      const result = hasEnoughAccountsForTransfer(multiAccountList, multiAccountList);
      expect(result).to.be.true;
    });

    it('Should return true if each accountlist contains different account', () => {
      const result = hasEnoughAccountsForTransfer(singleAccount1, singleAccount2);
      expect(result).to.be.true;
    });

    it('Should return false if each accountlist contains single same account', () => {
      const result = hasEnoughAccountsForTransfer(singleAccount1, singleAccount1);
      expect(result).to.be.false;
    });

    it('Should return false if one accountlist contains no accounts', () => {
      const result = hasEnoughAccountsForTransfer(multiAccountList, []);
      expect(result).to.be.false;
    });
  });
});

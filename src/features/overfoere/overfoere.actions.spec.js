import { expect } from 'chai';
import { amountClicked } from './overfoere.actions';
import { AMOUNT_INCREASER_AMOUNT_CLICK_TRANSFER } from './overfoere.constants';

describe('Test amountIncreaser actions', () => {
  context('Action type: AMOUNT_INCREASER_AMOUNT_CLICK_TRANSFER', () => {
    it('should return the correct object', () => {
      const amount = 100;
      const expectedResult = {
        type: AMOUNT_INCREASER_AMOUNT_CLICK_TRANSFER,
        amount,
      };
      const result = amountClicked(amount);
      expect(expectedResult).to.deep.equal(result);
    });
  });
});

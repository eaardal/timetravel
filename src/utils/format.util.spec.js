/* eslint no-unused-expressions: 0 */
/* eslint max-len: 0 */

import { expect } from 'chai';
import {
  formatAccountNumber,
  getAmountAsNumber,
  concatKronerAndOere,
  prependLeadingZero,
  formatNumberToLocale,
  stripWhitespace,
} from './format.util';
import i18n from 'i18n/i18nCache';

describe('Test formatUtil', () => {
  beforeEach(() => {
    i18n.initialize();
  });

  context('formatAccountNumber', () => {
    it('Should exist - ice breaker', () => {
      expect(formatAccountNumber).to.exist;
    });

    it('Should format 36372729923 to 3637.27.29923', () => {
      const accountNumber = '36372729923';
      const formattedAccountNumber = formatAccountNumber(accountNumber);
      expect(formattedAccountNumber).to.equal('3637.27.29923');
    });

    it('Should format 36333277365 to 3633.32.77365', () => {
      const accountNumber = '36333277365';
      const formattedAccountNumber = formatAccountNumber(accountNumber);
      expect(formattedAccountNumber).to.equal('3633.32.77365');
    });

    it('Should format 36333277373 to 3633.32.77373', () => {
      const accountNumber = '36333277373';
      const formattedAccountNumber = formatAccountNumber(accountNumber);
      expect(formattedAccountNumber).to.equal('3633.32.77373');
    });
  });

  context('formatNumberToLocale', () => {
    it('It should return correct formated amount for 5', () => {
      const amount = '5';
      const expected = '5';
      const result = formatNumberToLocale(amount);
      expect(result).to.be.a('string');
      expect(result).to.equal(expected);
    });

    it('It should return correct formated amount for 17', () => {
      const amount = '17';
      const expected = '17';
      const result = formatNumberToLocale(amount);
      expect(result).to.equal(expected);
    });

    it('It should return correct formated amount for 145', () => {
      const amount = '145';
      const expected = '145';
      const result = formatNumberToLocale(amount);
      expect(result).to.be.a('string');
      expect(result).to.equal(expected);
    });

    it('It should return correct formated amount for 1367', () => {
      const amount = '1367';
      const expected = '1 367'; // hold inne alt og trykk 0160 for å skrive riktig whitespace
      const result = formatNumberToLocale(amount);
      expect(result).to.be.a('string');
      expect(result).to.equal(expected);
    });

    it('It should return correct formated amount for 55678', () => {
      const amount = '55678';
      const expected = '55 678';
      const result = formatNumberToLocale(amount);
      expect(result).to.be.a('string');
      expect(result).to.equal(expected);
    });

    it('It should return correct formated amount for 534567', () => {
      const amount = '534567';
      const expected = '534 567';
      const result = formatNumberToLocale(amount);
      expect(result).to.be.a('string');
      expect(result).to.equal(expected);
    });

    it('It should return correct formated amount for 5897567', () => {
      const amount = '5897567';
      const expected = '5 897 567';
      const result = formatNumberToLocale(amount);
      expect(result).to.be.a('string');
      expect(result).to.equal(expected);
    });

    it('It should return correct formated amount for 5 897 567', () => {
      const amount = '5 897 567';
      const expected = '5 897 567';
      const result = formatNumberToLocale(amount);
      expect(result).to.be.a('string');
      expect(result).to.equal(expected);
    });

    // it('It should return number with two decimals', () => {
    //   const amount = '20';
    //   const expected = '20';
    //   const result = formatNumberToLocale(amount);
    //
    //   expect(result).to.be.a('string');
    //   expect(result).to.equal(expected);
    // });

    it('It should return input value when amount is not a string represented number', () => {
      const amount = 'sdg';
      const result1 = formatNumberToLocale(amount);
      expect(result1).to.equal(amount);
    });

    it('It should throw error when input is not of type string', () => {
      const amount2 = { sdf: 'sdf' };
      expect(formatNumberToLocale.bind(amount2)).to.throw(Error);

      const amount3 = [];
      expect(formatNumberToLocale.bind(amount3)).to.throw(Error);
    });
  });

  context('stripWhitespace', () => {
    it('Should exist', () => {
      expect(stripWhitespace).to.exist;
    });

    it('Should return 10000 for 10 000', () => {
      expect(stripWhitespace('10 000')).to.equal('10000');
    });

    it('Should return 123123123 for 123 123 123', () => {
      expect(stripWhitespace('123 123 123')).to.equal('123123123');
    });

    it('Should throw error when number param is not a string', () => {
      expect(stripWhitespace.bind(123)).to.throw('Provided number must be a string');
      expect(stripWhitespace.bind({})).to.throw('Provided number must be a string');
      expect(stripWhitespace.bind([])).to.throw('Provided number must be a string');
      expect(stripWhitespace.bind(false)).to.throw('Provided number must be a string');
    });
  });

  context('getAmountAsNumber', () => {
    it('It should return the number 5 for "5"', () => {
      const amount = '5';
      const expected = 5;
      const result = getAmountAsNumber(amount);
      expect(result).to.be.a('number');
      expect(result).to.equal(expected);
    });

    it('It should return the number 17 for "17"', () => {
      const amount = '17';
      const expected = 17;
      const result = getAmountAsNumber(amount);
      expect(result).to.be.a('number');
      expect(result).to.equal(expected);
    });

    it('It should return the number 148 for "148"', () => {
      const amount = '148';
      const expected = 148;
      const result = getAmountAsNumber(amount);
      expect(result).to.be.a('number');
      expect(result).to.equal(expected);
    });

    it('It should return the number 1267 for "1267"', () => {
      const amount = '1267';
      const expected = 1267;
      const result = getAmountAsNumber(amount);
      expect(result).to.be.a('number');
      expect(result).to.equal(expected);
    });

    it('It should return the number 1267 for "1 267"', () => {
      const amount = '1 267';
      const expected = 1267;
      const result = getAmountAsNumber(amount);
      expect(result).to.be.a('number');
      expect(result).to.equal(expected);
    });

    it('It should return the number 12567 for "12567"', () => {
      const amount = '12567';
      const expected = 12567;
      const result = getAmountAsNumber(amount);
      expect(result).to.be.a('number');
      expect(result).to.equal(expected);
    });

    it('It should return the number 145678 for "145678"', () => {
      const amount = '145678';
      const expected = 145678;
      const result = getAmountAsNumber(amount);
      expect(result).to.be.a('number');
      expect(result).to.equal(expected);
    });

    it('It should return the number 1789456 for "1789456"', () => {
      const amount = '1789456';
      const expected = 1789456;
      const result = getAmountAsNumber(amount);
      expect(result).to.be.a('number');
      expect(result).to.equal(expected);
    });

    it('It should return the number 1789456 for "1 789 456"', () => {
      const amount = '1 789 456';
      const expected = 1789456;
      const result = getAmountAsNumber(amount);
      expect(result).to.be.a('number');
      expect(result).to.equal(expected);
    });

    it('It should return input value when amount is not a string represented number', () => {
      const amount = 'sdg';
      const result1 = getAmountAsNumber(amount);
      expect(result1).to.equal(amount);
    });

    it('It should throw error when input is not of type string', () => {
      const amount2 = { sdf: 'sdf' };
      expect(getAmountAsNumber.bind(amount2)).to.throw(Error);

      const amount3 = [];
      expect(getAmountAsNumber.bind(amount3)).to.throw(Error);
    });
  });

  context('concatKronerAndOere', () => {
    it('Should exist - ice breaker', () => {
      expect(concatKronerAndOere).to.exist;
    });

    it('Should throw error if kroner is not a string', () => {
      const oere = '10';
      expect(concatKronerAndOere.bind(123, oere)).to.throw(Error);
      expect(concatKronerAndOere.bind([], oere)).to.throw(Error);
      expect(concatKronerAndOere.bind({}, oere)).to.throw(Error);
    });

    it('Should throw error if øre is not a string', () => {
      const kroner = '10';
      expect(concatKronerAndOere.bind(kroner, 123)).to.throw(Error);
      expect(concatKronerAndOere.bind(kroner, [])).to.throw(Error);
      expect(concatKronerAndOere.bind(kroner, {})).to.throw(Error);
    });

    it('Should return 100.00 when kroner is 100 and øre is 00', () => {
      const kroner = '100';
      const oere = '00';
      const result = concatKronerAndOere(kroner, oere);
      expect(result).to.equal(100.00);
    });

    it('Should return 100.20 when kroner is 100 and øre is 20', () => {
      const kroner = '100';
      const oere = '20';
      const result = concatKronerAndOere(kroner, oere);
      expect(result).to.equal(100.20);
    });

    it('Should return 10230.67 when kroner is 10 230 and øre is 67', () => {
      const kroner = '10 230';
      const oere = '67';
      const result = concatKronerAndOere(kroner, oere);
      expect(result).to.equal(10230.67);
    });

    it('Should return 132230232.01 when kroner is 132 230 232 and øre is 1', () => {
      const kroner = '132 230 232';
      const oere = '1';
      const result = concatKronerAndOere(kroner, oere);
      expect(result).to.equal(132230232.01);
    });

    it('Should return 132230232.09 when kroner is 132 230 232 and øre is 9', () => {
      const kroner = '132 230 232';
      const oere = '9';
      const result = concatKronerAndOere(kroner, oere);
      expect(result).to.equal(132230232.09);
    });

    it('Should return 132230232.07 when kroner is 132 230 232 and øre is 07', () => {
      const kroner = '132 230 232';
      const oere = '07';
      const result = concatKronerAndOere(kroner, oere);
      expect(result).to.equal(132230232.07);
    });

    it('Should return 132230232.00 when kroner is 132 230 232 and øre is 0', () => {
      const kroner = '132 230 232';
      const oere = '00';
      const result = concatKronerAndOere(kroner, oere);
      expect(result).to.equal(132230232.00);
    });
  });

  context('prependLeadingZero', () => {
    it('Should exist', () => {
      expect(prependLeadingZero).to.exist;
    });

    it('Should return 00 for 0', () => {
      expect(prependLeadingZero(0)).to.equal('00');
    });

    it('Should return 05 for 5', () => {
      expect(prependLeadingZero(5)).to.equal('05');
    });

    it('Should return 10 for 10', () => {
      expect(prependLeadingZero(10)).to.equal('10');
    });

    it('Should return 11 for 11', () => {
      expect(prependLeadingZero(11)).to.equal('11');
    });

    it('Should return 000 for 000 (do nothing)', () => {
      expect(prependLeadingZero('000')).to.equal('000');
    });

    it('Should return 123 for 123 (do nothing)', () => {
      expect(prependLeadingZero(123)).to.equal('123');
    });

    it('Should return 45 554 for 45 554 (do nothing)', () => {
      expect(prependLeadingZero('45 554')).to.equal('45 554');
    });
  });
});

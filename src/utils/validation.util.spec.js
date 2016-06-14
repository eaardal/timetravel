/* eslint no-unused-expressions: 0 */
/* eslint max-len: 0 */

import { expect } from 'chai';
import moment from 'moment';
import sinon from 'sinon';
import {
  isTextTooLong,
  isAccountValid,
  isAmountGreaterThanZero,
  isAmountNumeric,
  isAvailableAmountSufficient,
} from './validation.util';
import DateTimeUtil from './dateTime.util';


const createDateTimeUtilStub = () => {
  const stub = {
    now: sinon.stub(DateTimeUtil, 'now'),
    isSame: sinon.stub(DateTimeUtil, 'isSame'),
    isAfter: sinon.stub(DateTimeUtil, 'isAfter'),
    isBefore: sinon.stub(DateTimeUtil, 'isBefore'),
    parse: sinon.stub(DateTimeUtil, 'parse'),
  };
  stub.restore = () => {
    stub.now.restore();
    stub.isSame.restore();
    stub.isAfter.restore();
    stub.isBefore.restore();
    stub.parse.restore();
  };
  return stub;
};

describe('Test validationUtil', () => {
  context('isTextTooLong', () => {
    const defaultMaxLength = 70;

    it('Should exist - ice breaker', () => {
      expect(isTextTooLong).to.exist;
    });

    it('Should throw error if value is not a string', () => {
      const maxLength = 1;
      expect(isTextTooLong.bind(123, maxLength)).to.throw(Error);
      expect(isTextTooLong.bind({}, maxLength)).to.throw(Error);
      expect(isTextTooLong.bind([], maxLength)).to.throw(Error);
      expect(isTextTooLong.bind(null, maxLength)).to.throw(Error);
      expect(isTextTooLong.bind(undefined, maxLength)).to.throw(Error);
    });

    it('Should throw error if maxLength is not a number', () => {
      const value = 'a';
      expect(isTextTooLong.bind(value, 'not a number')).to.throw(Error);
      expect(isTextTooLong.bind(value, {})).to.throw(Error);
      expect(isTextTooLong.bind(value, [])).to.throw(Error);
      expect(isTextTooLong.bind(value, undefined)).to.throw(Error);
      expect(isTextTooLong.bind(value, null)).to.throw(Error);
    });

    it('Should throw error if maxLength is less than zero', () => {
      const value = 'a';
      const maxLength = -1;
      expect(isTextTooLong.bind(value, maxLength)).to.throw(Error);
    });

    it('Should throw error if maxLength is zero', () => {
      const value = 'a';
      const maxLength = 0;
      expect(isTextTooLong.bind(value, maxLength)).to.throw(Error);
    });

    it('Should return true when length is 1', () => {
      const value = 'a';
      const result = isTextTooLong(value, defaultMaxLength);
      expect(result).to.be.true;
    });

    it('Should return true when length is 25', () => {
      const value = 'HJl4C8KRGLvbocZqcceb41Nu8';
      const result = isTextTooLong(value, defaultMaxLength);
      expect(result).to.be.true;
    });

    it('Should return true when length is 69', () => {
      const value = 'mT0rsoa3FNAI2jjJM2kaphsWPhFCo3yIv8SDQy4naggqGhttVFOjyser5WAhpoVfunqeV';
      const result = isTextTooLong(value, defaultMaxLength);
      expect(result).to.be.true;
    });

    it('Should return true when length is 70', () => {
      const value = 'FOh6IIMBAYAnno58KSgMZu7QjabXDCMP489Osc6icOJMGbjqOZ3Q9Tb76zORy18AQzvazk';
      const result = isTextTooLong(value, defaultMaxLength);
      expect(result).to.be.true;
    });

    it('Should return false when length is 71', () => {
      const value = 'IUVKxO7sFm4H4rnOqa0ttPLJFQPZkprf2FQBY9KZl0AWNLPWJaaZmtVDXjuHX81wIGBvDZt';
      const result = isTextTooLong(value, defaultMaxLength);
      expect(result).to.be.false;
    });
  });

  context('isAmountGreaterThanZero', () => {
    it('Should exist - ice breaker', () => {
      expect(isAmountGreaterThanZero).to.exist;
    });

    it('Should return true if amount is 1', () => {
      const result = isAmountGreaterThanZero('1');
      expect(result).to.be.true;
    });

    it('Should return true if amount contains whitespace', () => {
      const result = isAmountGreaterThanZero('234 212');
      expect(result).to.be.true;
    });

    it('Should return false if amount is 0', () => {
      const result = isAmountGreaterThanZero('0');
      expect(result).to.be.false;
    });

    it('Should return false if amount is -1', () => {
      const result = isAmountGreaterThanZero('-1');
      expect(result).to.be.false;
    });

    it('Should return true if amount is 0.1', () => {
      const result = isAmountGreaterThanZero('0.1');
      expect(result).to.be.true;
    });

    it('Should return false if amount is -0.1', () => {
      const result = isAmountGreaterThanZero('-0.1');
      expect(result).to.be.false;
    });
  });

  context('isAmountNumeric', () => {
    it('Should exist - ice breaker', () => {
      expect(isAmountNumeric).to.exist;
    });

    it('Should return false if amount is not a number', () => {
      expect(isAmountNumeric('not a number')).to.be.false;
      expect(isAmountNumeric({})).to.be.false;
      expect(isAmountNumeric([])).to.be.false;
      expect(isAmountNumeric(undefined)).to.be.false;
      expect(isAmountNumeric(null)).to.be.false;
    });

    it('Should return false if amount contains a letter', () => {
      const result = isAmountNumeric('1a');
      expect(result).to.be.false;
    });

    it('Should return true if amount is a valid string representation number', () => {
      const result = isAmountNumeric('5');
      expect(result).to.be.true;
    });

    it('Should return false if amount contains a string representation of a number and letters', () => {
      const result = isAmountNumeric('1312a');
      expect(result).to.be.false;
    });

    it('Should return true if amount contains whitespace', () => {
      const result = isAmountNumeric('1 234');
      expect(result).to.be.true;
    });

    it('Should return true if amount contains several whitespaces', () => {
      const result = isAmountNumeric('1 234 567 890');
      expect(result).to.be.true;
    });

    it('Should return false if amount contains several whitespaces and letters', () => {
      const result = isAmountNumeric('1 234 56d 890');
      expect(result).to.be.false;
    });

    it('Should return false if amount contains negative number with several whitespaces', () => {
      const result = isAmountNumeric('-1 234 567 890');
      expect(result).to.be.false;
    });
  });

  context('isAccountValid', () => {
    it('Should exist - ice breaker', () => {
      expect(isAccountValid).to.exist;
    });

    it('Should return false if account is undefined or null', () => {
      expect(isAccountValid(undefined)).to.be.false;
      expect(isAccountValid(null)).to.be.false;
    });

    it('Should return false if account number is not set', () => {
      const account1 = {
        accountNumber: undefined,
        availableAmount: '987',
        accountName: 'Testkonto 1',
      };
      const account2 = {
        accountNumber: null,
        availableAmount: '987',
        accountName: 'Testkonto 1',
      };
      const account3 = {
        accountNumber: '',
        availableAmount: '987',
        accountName: 'Testkonto 1',
      };

      expect(isAccountValid(account1)).to.be.false;
      expect(isAccountValid(account2)).to.be.false;
      expect(isAccountValid(account3)).to.be.false;
    });


    it('Should return true if disponibelt beløp is 0', () => {
      const account = {
        accountNumber: '1234567',
        availableAmount: '0',
        accountName: 'Testkonto 1',
      };
      expect(isAccountValid(account)).to.be.true;
    });

    it('Should return true if disponibelt beløp is 0 as a number', () => {
      const account = {
        accountNumber: '1234567',
        availableAmount: 0,
        accountName: 'Testkonto 1',
      };
      expect(isAccountValid(account)).to.be.true;
    });

    it('Should return false if name is not set', () => {
      const account1 = {
        accountNumber: '98989898',
        availableAmount: '65656',
        accountName: undefined,
      };
      const account2 = {
        accountNumber: '98989898',
        availableAmount: '65656',
        accountName: null,
      };
      const account3 = {
        accountNumber: '98989898',
        availableAmount: '65656',
        accountName: '',
      };
      expect(isAccountValid(account1)).to.be.false;
      expect(isAccountValid(account2)).to.be.false;
      expect(isAccountValid(account3)).to.be.false;
    });

    it('Should return true if account number, disponibelt beløp, and name is set', () => {
      const account = {
        accountNumber: '98989898',
        availableAmount: '65656',
        accountName: 'Testkonto 1',
      };
      expect(isAccountValid(account)).to.be.true;
    });
  });

  context('isAvailableAmountSufficient', () => {
    let dateTimeUtilStub;
    const today = moment('2016-04-16');

    beforeEach(() => {
      dateTimeUtilStub = createDateTimeUtilStub();
      dateTimeUtilStub.now.returns(today);
      dateTimeUtilStub.isSame.returns(false);
      dateTimeUtilStub.isAfter.returns(false);
      dateTimeUtilStub.parse.returns(today);
    });

    afterEach(() => {
      dateTimeUtilStub.restore();
    });

    it('Should exist', () => {
      expect(isAvailableAmountSufficient).to.exist;
    });

    it('Should throw error if availableAmount is not a valid number', () => {
      const enteredAmount = '0';
      const date = new Date(2016, 4, 14);
      expect(isAvailableAmountSufficient.bind('10a', enteredAmount, date)).to.throw(Error);
      expect(isAvailableAmountSufficient.bind('10 023a', enteredAmount, date)).to.throw(Error);
      expect(isAvailableAmountSufficient.bind([], enteredAmount, date)).to.throw(Error);
      expect(isAvailableAmountSufficient.bind({}, enteredAmount, date)).to.throw(Error);
    });

    it('Should throw error if enteredAmount is not a valid number', () => {
      const availableAmount = '0';
      const date = new Date(2016, 4, 14);
      expect(isAvailableAmountSufficient.bind(availableAmount, '10a', date)).to.throw(Error);
      expect(isAvailableAmountSufficient.bind(availableAmount, '10 023a', date)).to.throw(Error);
      expect(isAvailableAmountSufficient.bind(availableAmount, [], date)).to.throw(Error);
      expect(isAvailableAmountSufficient.bind(availableAmount, {}, date)).to.throw(Error);
    });

    it('Should throw error if date is undefined or null', () => {
      const availableAmount = '100';
      const enteredAmount = '10';
      expect(isAvailableAmountSufficient.bind(availableAmount, enteredAmount, undefined)).to.throw(Error);
      expect(isAvailableAmountSufficient.bind(availableAmount, enteredAmount, null)).to.throw(Error);
    });

    it('Should return true if availableAmount is 100, enteredAmount is 99, and date is today', () => {
      const availableAmount = '100';
      const enteredAmount = '10';

      dateTimeUtilStub.isSame.returns(true);

      const result = isAvailableAmountSufficient(availableAmount, enteredAmount, today);

      expect(result).to.be.true;
    });

    it('Should return true if availableAmount is 100, enteredAmount is 101, and date is tomorrow', () => {
      const availableAmount = '100';
      const enteredAmount = '101';
      const tomorrow = today.add(1, 'days');

      dateTimeUtilStub.now.returns(today);
      dateTimeUtilStub.isSame.returns(false);
      dateTimeUtilStub.isAfter.returns(true);

      const result = isAvailableAmountSufficient(availableAmount, enteredAmount, tomorrow);

      expect(result).to.be.true;
    });

    it('Should return true if availableAmount is 100, enteredAmount is 100, and date is today', () => {
      const availableAmount = '100';
      const enteredAmount = '100';

      dateTimeUtilStub.now.returns(today);
      dateTimeUtilStub.isSame.returns(true);
      dateTimeUtilStub.isAfter.returns(false);

      const result = isAvailableAmountSufficient(availableAmount, enteredAmount, today);

      expect(result).to.be.true;
    });

    it('Should return true if availableAmount is 100 as number, enteredAmount is 100, and date is today', () => {
      const availableAmount = 100.00;
      const enteredAmount = '100';

      dateTimeUtilStub.now.returns(today);
      dateTimeUtilStub.isSame.returns(true);
      dateTimeUtilStub.isAfter.returns(false);

      const result = isAvailableAmountSufficient(availableAmount, enteredAmount, today);

      expect(result).to.be.true;
    });

    it('Should return false if availableAmount is 100, enteredAmount is 101, and date is today', () => {
      const availableAmount = '100';
      const enteredAmount = '101';

      dateTimeUtilStub.now.returns(today);
      dateTimeUtilStub.isSame.returns(true);
      dateTimeUtilStub.isAfter.returns(false);

      const result = isAvailableAmountSufficient(availableAmount, enteredAmount, today);

      expect(result).to.be.false;
    });

    it('Should return false if availableAmount is 100, enteredAmount 100.1 and date is today', () => {
      const availableAmount = '100';
      const enteredAmount = '100.1';

      dateTimeUtilStub.now.returns(today);
      dateTimeUtilStub.isSame.returns(true);
      dateTimeUtilStub.isAfter.returns(false);

      const result = isAvailableAmountSufficient(availableAmount, enteredAmount, today);

      expect(result).to.be.false;
    });
  });
});

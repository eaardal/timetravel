/* eslint no-unused-expressions: 0 */
/* eslint max-len: 0 */

import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';
import createValidator from './overfoere.validation';
import i18n from 'i18n/i18nCache';
import DateTimeUtil from 'utils/dateTime.util';

const validate = createValidator();

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

describe('Test transferFormValidation', () => {
  let dateTimeUtilStub;
  const today = moment('2016-04-16');

  beforeEach(() => {
    i18n.initialize();

    dateTimeUtilStub = createDateTimeUtilStub();
    dateTimeUtilStub.now.returns(today);
    dateTimeUtilStub.isSame.returns(false);
    dateTimeUtilStub.isAfter.returns(false);
    dateTimeUtilStub.isBefore.returns(false);
    dateTimeUtilStub.parse.returns(today);
  });

  afterEach(() => {
    dateTimeUtilStub.restore();
  });

  context('validate', () => {
    it('Should exist - ice breaker', () => {
      expect(validate).to.exist;
    });

    context('kroner and øre/amount', () => {
      it('Should not set errors.amount when kroner is 10 and øre is 0', () => {
        const values = {
          toAccount: undefined,
          message: '',
          kroner: '10',
          oere: '0',
          dueDate: '2016-03-01',
          amount: '',
        };
        const errors = validate(values);
        expect(errors.amount).to.be.null;
      });

      it('Should not set errors.amount when kroner is 0 and øre is 10', () => {
        const values = {
          toAccount: undefined,
          message: '',
          kroner: '0',
          oere: '10',
          dueDate: '2016-03-01',
          amount: '',
        };
        const errors = validate(values);
        expect(errors.amount).to.be.null;
      });

      it('Should set errors.amount when kroner is 10a (not numeric) and øre is 0', () => {
        const values = {
          toAccount: undefined,
          message: '',
          kroner: '10a',
          oere: '0',
          dueDate: '2016-03-01',
          amount: '',
        };
        const expectedError = i18n.translate(i => i.KRONER_IS_INVALID);
        const errors = validate(values);
        expect(errors.amount).to.be.a('string');
        expect(errors.amount).to.equal(expectedError);
      });

      it('Should set errors.amount when kroner is 0 and øre is 5a (not numeric)', () => {
        const values = {
          toAccount: undefined,
          message: '',
          kroner: '0',
          oere: '5a',
          dueDate: '2016-03-01',
          amount: '',
        };
        const expectedError = i18n.translate(i => i.OERE_IS_INVALID);
        const errors = validate(values);
        expect(errors.amount).to.be.a('string');
        expect(errors.amount).to.equal(expectedError);
      });

      it('Should set errors.amount when kroner is 0 and øre is 0', () => {
        const values = {
          toAccount: undefined,
          message: '',
          kroner: 0,
          oere: 0,
          dueDate: '2016-03-01',
          amount: '',
        };
        const expectedError = i18n.translate(i => i.NO_AMOUNT);
        const errors = validate(values);
        expect(errors.amount).to.be.a('string');
        expect(errors.amount).to.equal(expectedError);
      });

      it('Should set errors.amount when kroner is 0 and øre is not set', () => {
        const values = {
          toAccount: undefined,
          message: '',
          kroner: '0',
          oere: '',
          dueDate: '2016-03-01',
          amount: '',
        };
        const expectedError = i18n.translate(i => i.AMOUNT_IS_ZERO);
        const errors = validate(values);
        expect(errors.amount).to.be.a('string');
        expect(errors.amount).to.equal(expectedError);
      });

      it('Should set errors.amount when kroner is not set and øre is 0', () => {
        const values = {
          toAccount: undefined,
          message: '',
          kroner: '',
          oere: '0',
          dueDate: '2016-03-01',
          amount: '',
        };
        const expectedError = i18n.translate(i => i.AMOUNT_IS_ZERO);
        const errors = validate(values);
        expect(errors.amount).to.be.a('string');
        expect(errors.amount).to.equal(expectedError);
      });

      it('Should set errors.amount when kroner is 10f and øre is 2d', () => {
        const values = {
          toAccount: undefined,
          message: '',
          kroner: '10f',
          oere: '2d',
          dueDate: '2016-03-01',
          amount: '',
        };
        const expectedError = i18n.translate(i => i.KRONER_IS_INVALID);
        const errors = validate(values);
        expect(errors.amount).to.be.a('string');
        expect(errors.amount).to.equal(expectedError);
      });
    });

    context('disponibelt beløp på dagens dato', () => {
      it('Should set errors.amount when fromAccount.availableAmount is less than total entered amount and dueDate is today', () => {
        dateTimeUtilStub.isSame.returns(true);
        const values = {
          fromAccount: {
            availableAmount: '9',
            accountName: 'testkonto',
            accountNumber: '123456789',
          },
          message: '',
          kroner: '10',
          oere: '',
          dueDate: '2016-04-16',
          amount: '10',
        };
        const expectedError = i18n.translate(i => i.BELOEP_STORRE_ENN_DISPONIBELT);
        const errors = validate(values);
        expect(errors.amount).to.be.a('string');
        expect(errors.amount).to.equal(expectedError);
      });

      it('Should set errors.amount when fromAccount.availableAmount is less than total entered amount (is a number) and dueDate is today', () => {
        dateTimeUtilStub.isSame.returns(true);
        const values = {
          fromAccount: {
            availableAmount: '9',
            accountName: 'testkonto',
            accountNumber: '123456789',
          },
          message: '',
          kroner: '10',
          oere: '',
          dueDate: '2016-04-16',
          amount: 10,
        };
        const expectedError = i18n.translate(i => i.BELOEP_STORRE_ENN_DISPONIBELT);
        const errors = validate(values);
        expect(errors.amount).to.be.a('string');
        expect(errors.amount).to.equal(expectedError);
      });

      it('Should not set errors.amount when fromAccount.availableAmount is less than total entered amount and dueDate is tomorrow', () => {
        dateTimeUtilStub.isSame.returns(false);
        dateTimeUtilStub.isAfter.returns(true);
        const values = {
          fromAccount: {
            availableAmount: '9',
            accountName: 'testkonto',
            accountNumber: '123456789',
          },
          message: '',
          kroner: '10',
          oere: '',
          dueDate: '2016-04-16',
          amount: 10,
        };
        const errors = validate(values);
        expect(errors.amount).to.be.null;
      });

      it('Should not set errors.amount when fromAccount.availableAmount is greater than total entered amount and dueDate is today', () => {
        dateTimeUtilStub.isSame.returns(true);
        const values = {
          fromAccount: {
            availableAmount: '11',
            accountName: 'testkonto',
            accountNumber: '123456789',
          },
          message: '',
          kroner: '10',
          oere: '',
          dueDate: '2016-04-16',
          amount: 10,
        };
        const errors = validate(values);
        expect(errors.amount).to.be.null;
      });

      it('Should not set errors.amount when fromAccount.availableAmount is greater than total entered amount and dueDate is tomorrow', () => {
        dateTimeUtilStub.isSame.returns(false);
        dateTimeUtilStub.isAfter.returns(true);
        const values = {
          fromAccount: {
            availableAmount: '11',
            accountName: 'testkonto',
            accountNumber: '123456789',
          },
          message: '',
          kroner: '10',
          oere: '',
          dueDate: '2016-04-16',
          amount: 10,
        };
        const errors = validate(values);
        expect(errors.amount).to.be.null;
      });
    });

    context('fromAccount', () => {
      it('Should set errors.fromAccount when fromAccount is missing accountNumber', () => {
        const values = {
          fromAccount: {
            availableAmount: '9',
            accountName: 'testkonto',
            accountNumber: undefined,
          },
          message: '',
          kroner: '10',
          oere: '',
          dueDate: '2016-04-16',
          amount: 10,
        };
        const expectedError = i18n.translate(i => i.FROM_ACCOUNT_NOT_SELECTED);
        const errors = validate(values);
        expect(errors.fromAccount).to.be.a('string');
        expect(errors.fromAccount).to.equal(expectedError);
      });

      it('Should set errors.fromAccount when fromAccount is missing name', () => {
        const values = {
          fromAccount: {
            availableAmount: '100',
            accountName: undefined,
            accountNumber: '123456789',
          },
          message: '',
          kroner: '10',
          oere: '',
          dueDate: '2016-04-16',
          amount: '10',
        };
        const expectedError = i18n.translate(i => i.FROM_ACCOUNT_NOT_SELECTED);
        const errors = validate(values);
        expect(errors.fromAccount).to.be.a('string');
        expect(errors.fromAccount).to.equal(expectedError);
      });
    });

    context('toAccount', () => {
      it('Should set errors.toAccount when toAccount is missing accountNumber', () => {
        const values = {
          fromAccount: {
            availableAmount: '9',
            accountName: 'testkonto1',
            accountNumber: '123456789',
          },
          toAccount: {
            availableAmount: '19',
            name: 'testkonto2',
            accountNumber: undefined,
          },
          message: '',
          kroner: '10',
          oere: '',
          dueDate: '2016-04-16',
          amount: '10',
        };
        const expectedError = i18n.translate(i => i.TO_ACCOUNT_NOT_SELECTED);
        const errors = validate(values);
        expect(errors.toAccount).to.be.a('string');
        expect(errors.toAccount).to.equal(expectedError);
      });

      it('Should set errors.toAccount when toAccount is missing availableAmount', () => {
        const values = {
          fromAccount: {
            availableAmount: '9',
            accountName: 'testkonto1',
            accountNumber: '123456789',
          },
          toAccount: {
            availableAmount: '',
            accountName: 'testkonto2',
            accountNumber: '123456789',
          },
          message: '',
          kroner: '10',
          oere: '',
          dueDate: '2016-04-16',
          amount: '10',
        };
        const expectedError = i18n.translate(i => i.TO_ACCOUNT_NOT_SELECTED);
        const errors = validate(values);
        expect(errors.toAccount).to.be.a('string');
        expect(errors.toAccount).to.equal(expectedError);
      });

      it('Should set errors.toAccount when toAccount is missing name', () => {
        const values = {
          fromAccount: {
            availableAmount: '9',
            accountName: 'testkonto1',
            accountNumber: '123456789',
          },
          toAccount: {
            availableAmount: '19',
            accountName: undefined,
            accountNumber: '123123123',
          },
          message: '',
          kroner: '10',
          oere: '',
          dueDate: '2016-04-16',
          amount: '10',
        };
        const expectedError = i18n.translate(i => i.TO_ACCOUNT_NOT_SELECTED);
        const errors = validate(values);
        expect(errors.toAccount).to.be.a('string');
        expect(errors.toAccount).to.equal(expectedError);
      });

      it('Should set errors.toAccount when toAccount number is same as fromAccount', () => {
        const values = {
          fromAccount: {
            availableAmount: '9',
            accountName: 'testkonto1',
            accountNumber: '123456789',
          },
          toAccount: {
            availableAmount: '9',
            accountName: 'testkonto1',
            accountNumber: '123456789',
          },
          message: '',
          kroner: '10',
          oere: '',
          dueDate: '2016-04-16',
          amount: '10',
        };
        const expectedError = i18n.translate(i => i.TO_ACCOUNT_NOT_SELECTED);
        const errors = validate(values);
        expect(errors.toAccount).to.be.a('string');
        expect(errors.toAccount).to.equal(expectedError);
      });
    });

    context('message', () => {
      it('Should set errors.message when message is 71 characters', () => {
        const values = {
          fromAccount: {
            availableAmount: '9',
            accountName: 'testkonto1',
            accountNumber: '123456789',
          },
          toAccount: {
            availableAmount: '19',
            accountName: undefined,
            accountNumber: '123123123',
          },
          message: '04DCfii7sRTyiUPO6Rm2AaiJezG3TvLx0UMFSeGayWKImITG4Eb8Dbcc7XmYyz6SmF5zCWa',
          kroner: '10',
          oere: '',
          dueDate: '2016-04-16',
          amount: '10',
        };
        const expectedError = i18n.translate(i => i.MESSAGE_TOO_LONG);
        const errors = validate(values);
        expect(errors.message).to.be.a('string');
        expect(errors.message).to.equal(expectedError);
      });

      it('Should not set errors.message when message is 70 characters', () => {
        const values = {
          fromAccount: {
            availableAmount: '9',
            accountName: 'testkonto1',
            accountNumber: '123456789',
          },
          toAccount: {
            availableAmount: '19',
            accountName: undefined,
            accountNumber: '123123123',
          },
          message: '04DCfii7sRTyiUPO6Rm2AaiJezG3TvLx0UMFSeGayWKImITG4Eb8Dbcc7mYyz6SmF5zCWa',
          kroner: '10',
          oere: '',
          dueDate: '2016-04-16',
          amount: '10',
        };
        const errors = validate(values);
        expect(errors.message).to.be.undefined;
      });
    });
  });
});

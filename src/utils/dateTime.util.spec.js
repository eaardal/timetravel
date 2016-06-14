/* eslint max-len: 0 */
/* eslint no-unused-expressions: 0 */

import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';
import DateTimeUtil from './dateTime.util';
import i18n from 'i18n/i18nCache';

describe('Test DateTimeUtil', () => {
  beforeEach(() => {
    i18n.initialize();
  });
  context('now', () => {
    it('Should exist', () => expect(DateTimeUtil.now).to.exist);

    it('Should return a moment object', () => {
      expect(DateTimeUtil.now()._isAMomentObject).to.be.true;
    });
  });

  context('isSame', () => {
    it('Should exist', () => expect(DateTimeUtil.isSame).to.exist);

    it('Should return true when day is same', () => {
      const dateToCheck = moment('2016-12-20');
      const dateBaseline = moment('2016-12-20');
      expect(DateTimeUtil.isSame(dateToCheck, dateBaseline)).to.be.true;
    });

    it('Should return false when day is not same', () => {
      const dateToCheck = moment('2016-12-20');
      const dateBaseline = moment('2016-12-21');
      expect(DateTimeUtil.isSame(dateToCheck, dateBaseline)).to.be.false;
    });
  });

  context('isAfter', () => {
    it('Should exist', () => expect(DateTimeUtil.isAfter).to.exist);

    it('Should return true when date is after', () => {
      const dateToCheck = moment('2016-12-21');
      const dateBaseline = moment('2016-12-20');
      expect(DateTimeUtil.isAfter(dateToCheck, dateBaseline)).to.be.true;
    });

    it('Should return false when date is same', () => {
      const dateToCheck = moment('2016-12-20');
      const dateBaseline = moment('2016-12-20');
      expect(DateTimeUtil.isAfter(dateToCheck, dateBaseline)).to.be.false;
    });

    it('Should return false when date is earlier', () => {
      const dateToCheck = moment('2016-12-19');
      const dateBaseline = moment('2016-12-20');
      expect(DateTimeUtil.isAfter(dateToCheck, dateBaseline)).to.be.false;
    });
  });

  context('isBefore', () => {
    it('Should exist', () => expect(DateTimeUtil.isBefore).to.exist);

    it('Should return false when date is after', () => {
      const dateToCheck = moment('2016-12-21');
      const dateBaseline = moment('2016-12-20');
      expect(DateTimeUtil.isBefore(dateToCheck, dateBaseline)).to.be.false;
    });

    it('Should return false when date is same', () => {
      const dateToCheck = moment('2016-12-20');
      const dateBaseline = moment('2016-12-20');
      expect(DateTimeUtil.isBefore(dateToCheck, dateBaseline)).to.be.false;
    });

    it('Should return true when date is earlier', () => {
      const dateToCheck = moment('2016-12-19');
      const dateBaseline = moment('2016-12-20');
      expect(DateTimeUtil.isBefore(dateToCheck, dateBaseline)).to.be.true;
    });
  });

  context('parse', () => {
    it('Should exist', () => expect(DateTimeUtil.parse).to.exist);

    it('Should return a moment object for a date string', () => {
      const date = DateTimeUtil.parse('31.12.2016');
      expect(date._isAMomentObject).to.be.true;
      expect(date.date()).to.equal(31);
      expect(date.month()).to.equal(11); // Zero indexed
      expect(date.year()).to.equal(2016);
    });

    it('Should return a moment object with corrent values when given 1.1.2016 (D.M.YYYY)', () => {
      const date = DateTimeUtil.parse('1.1.2016', 'D.M.YYYY');
      expect(date._isAMomentObject).to.be.true;
      expect(date.date()).to.equal(1);
      expect(date.month()).to.equal(0); // Zero indexed
      expect(date.year()).to.equal(2016);
    });

    it('Should return a moment object with corrent values when given 02.1.2016 (DD.M.YYYY)', () => {
      const date = DateTimeUtil.parse('02.1.2016', 'DD.M.YYYY');
      expect(date._isAMomentObject).to.be.true;
      expect(date.date()).to.equal(2);
      expect(date.month()).to.equal(0); // Zero indexed
      expect(date.year()).to.equal(2016);
    });

    it('Should return a moment object with corrent values when given 02.12.2016 (DD.MM.YYYY)', () => {
      const date = DateTimeUtil.parse('02.12.2016', 'DD.MM.YYYY');
      expect(date._isAMomentObject).to.be.true;
      expect(date.date()).to.equal(2);
      expect(date.month()).to.equal(11); // Zero indexed
      expect(date.year()).to.equal(2016);
    });
  });

  context('locale', () => {
    it('Should exist', () => expect(DateTimeUtil.locale).to.exist);

    it('Should get locale from moment', () => {
      const localeStub = sinon.stub(moment, 'locale');
      DateTimeUtil.locale();
      expect(localeStub.calledOnce).to.be.true;
    });
  });

  context('isValid', () => {
    beforeEach(() => {
      i18n.initialize();
    });

    it('Should exist', () => expect(DateTimeUtil.isValid).to.exist);

    it('Should return true for 01.01.2016 (DD.MM.YYYY)', () => {
      expect(DateTimeUtil.isValid('01.01.2016')).to.be.true;
    });

    it('Should return true for 1.1.2016 (D.M.YYYY)', () => {
      expect(DateTimeUtil.isValid('1.1.2016')).to.be.true;
    });

    it('Should return true for 03.1.2016 (DD.M.YYYY)', () => {
      expect(DateTimeUtil.isValid('03.1.2016')).to.be.true;
    });

    it('Should return true for 1.09.2016 (D.MM.YYYY)', () => {
      expect(DateTimeUtil.isValid('1.09.2016')).to.be.true;
    });

    it('Should return false for 05.05 (DD.MM)', () => {
      expect(DateTimeUtil.isValid('05.05')).to.be.false;
    });

    it('Should return false for 5.5 (D.M)', () => {
      expect(DateTimeUtil.isValid('5.5')).to.be.false;
    });

    it('Should return true for 05 (DD)', () => {
      expect(DateTimeUtil.isValid('05')).to.be.false;
    });

    it('Should return true for 5 (D)', () => {
      expect(DateTimeUtil.isValid('5')).to.be.false;
    });

    it('Should return false for 32.12.2016 (invalid day)', () => {
      expect(DateTimeUtil.isValid('32.12.2016')).to.be.false;
    });

    it('Should return false for 01.13.2016 (invalid month)', () => {
      expect(DateTimeUtil.isValid('01.13.2016')).to.be.false;
    });
  });
});

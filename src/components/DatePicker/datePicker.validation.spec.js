/* eslint no-unused-expressions: 0 */
/* eslint max-len: 0 */

import { expect } from 'chai';
import i18n from 'i18n/i18nCache';
import DateTimeUtil from 'utils/dateTime.util';
import createDateValidator from './datePicker.validation';

describe('Test dateValidation', () => {
  i18n.initialize();
  const maxDate = DateTimeUtil.parse('26.07.2017');
  const minDate = DateTimeUtil.parse('26.05.2016');

  context('validate', () => {
    it('Should exist - ice breaker', () => {
      expect(createDateValidator).to.exist;
    });

    it('Should not set errors.dueDate when date is valid and within range', () => {
      const values = {
        dueDate: '26.05.2016',
      };
      const validator = createDateValidator('dueDate', minDate, maxDate);
      const errors = validator(values);
      expect(errors.dueDate).to.be.undefined;
    });

    it('Should set errors.dueDate when date is empty', () => {
      const values = {
        dueDate: '',
      };

      const validator = createDateValidator('dueDate', minDate, maxDate);
      const errors = validator(values);
      expect(errors.dueDate).to.equal(i18n.translate(i => i.MISSING_DATE));
    });

    it('Should set errors.dueDate when date is invalid format', () => {
      const values = {
        dueDate: 'julaften',
      };

      const validator = createDateValidator('dueDate', minDate, maxDate);
      const errors = validator(values);
      expect(errors.dueDate).to.equal(i18n.translate(i => i.INVALID_DATE_FORMAT, { format:
        i18n.translate(i => i.DATE_DISPLAY_FORMAT) }));
    });

    it('Should set errors.dueDate when date is iso format', () => {
      const values = {
        dueDate: '2016-05-26',
      };

      const validator = createDateValidator('dueDate', minDate, maxDate);
      const errors = validator(values);
      expect(errors.dueDate).to.equal(i18n.translate(i => i.INVALID_DATE_FORMAT, { format:
        i18n.translate(i => i.DATE_DISPLAY_FORMAT) }));
    });

    it('Should set errors.dueDate when date is before minDate', () => {
      const values = {
        dueDate: '25.05.2016',
      };

      const validator = createDateValidator('dueDate', minDate, maxDate);
      const errors = validator(values);

      expect(errors.dueDate).to.equal(i18n.translate(i => i.INVALID_DATE_BEFORE, { date: minDate.clone().add(-1, 'd').toDate() }));
    });

    it('Should set errors.dueDate when date is after maxDate', () => {
      const values = {
        dueDate: '28.07.2017',
      };

      const validator = createDateValidator('dueDate', minDate, maxDate);
      const errors = validator(values);

      expect(errors.dueDate).to.equal(i18n.translate(i => i.INVALID_DATE_AFTER, { date: maxDate.clone().add(1, 'd').toDate() }));
    });
  });
});

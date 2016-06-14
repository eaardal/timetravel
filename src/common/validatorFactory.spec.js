import { expect } from 'chai';
import combineValidators from './validatorFactory';

describe('Test dateValidation', () => {
  const validator1 = (values) => ({ val1: values.test1 });
  const validator2 = (values) => ({ val2: values.test2 });
  const validator3 = (values) => ({ val3: values.test3 });
  const validator4 = (values) => ({ val4: values.test4 });

  context('validate', () => {
    it('Should exist - ice breaker', () => expect(combineValidators).to.exist);

    it('Should return results from two validators', () => {
      const combinedValidator = combineValidators(validator1, validator2);

      const errors = combinedValidator({ test1: '1', test2: '2', test3: '3', test4: '4' });
      expect(errors.val1).to.equal('1');
      expect(errors.val2).to.equal('2');
    });

    it('Should return results from four validators', () => {
      const combinedValidator = combineValidators(validator1, validator2, validator3, validator4);

      const errors = combinedValidator({ test1: '1', test2: '2', test3: '3', test4: '4' });
      expect(errors.val1).to.equal('1');
      expect(errors.val2).to.equal('2');
      expect(errors.val3).to.equal('3');
      expect(errors.val4).to.equal('4');
    });
  });
});

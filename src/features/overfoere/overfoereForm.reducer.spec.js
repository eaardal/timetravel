/* eslint max-len: 0 */

import { expect } from 'chai';
import sinon from 'sinon';
import deepFreeze from 'deep-freeze';
import transferFormReducer from './overfoereForm.reducer';
import { amountClicked } from './overfoere.actions';
import { formatNumberToLocale, concatKronerAndOere } from 'utils/format.util';
import i18n from 'i18n/i18nCache';
import DateTimeUtil from 'utils/dateTime.util';
import DateInterpretationUtil from 'utils/dateInterpretation.util';

const createDateTimeUtilStub = () => {
  const stub = {
    isValid: sinon.stub(DateTimeUtil, 'isValid'),
  };
  stub.restore = () => {
    stub.isValid.restore();
  };
  return stub;
};

const createDateInterpretationUtilStub = () => {
  const stub = {
    interpretTextAsDate: sinon.stub(DateInterpretationUtil, 'interpretTextAsDate'),
  };
  stub.restore = () => {
    stub.interpretTextAsDate.restore();
  };
  return stub;
};

describe('Test transferReducer', () => {
  beforeEach(() => {
    i18n.initialize();
  });

  context('Action type: AMOUNT_INCREASER_AMOUNT_CLICK_TRANSFER', () => {
    it('It should return the correct new amount when amount has not been set before', () => {
      const originalState = {
        kroner: {
          value: '',
        },
        oere: {
          value: '',
        },
        amount: {
          value: 0.0,
        },
      };
      const newState = transferFormReducer(deepFreeze(originalState), amountClicked(100));
      const expectedState = {
        kroner: {
          value: '100',
        },
        oere: {
          value: '00',
        },
        amount: {
          value: 100,
        },
      };
      expect(newState).to.deep.equal(expectedState);
    });

    it('It should return the correct new amount when amount has been set', () => {
      const originalState = {
        kroner: {
          value: '167',
        },
        oere: {
          value: '',
        },
      };
      const newState = transferFormReducer(deepFreeze(originalState), amountClicked(100));
      const expectedState = {
        kroner: {
          value: '267',
        },
        oere: {
          value: '00',
        },
        amount: {
          value: 267,
        },
      };
      expect(newState).to.deep.equal(expectedState);
    });

    it('It should return the correct new kroner and amount when amount has been set', () => {
      const originalState = {
        kroner: {
          value: '15 000',
        },
        oere: {
          value: '34',
        },
      };
      const newState = transferFormReducer(deepFreeze(originalState), amountClicked(1000));
      const expectedState = {
        kroner: {
          value: formatNumberToLocale('16000'),
        },
        oere: {
          value: '34',
        },
        amount: {
          value: 16000.34,
        },
      };
      expect(newState).to.deep.equal(expectedState);
    });

    it('It should set amount to 999 999 999 if kroner is 999 999 950 and +50 is added', () => {
      const originalState = {
        kroner: {
          value: '999 999 950',
        },
        oere: {
          value: '',
        },
      };
      const newState = transferFormReducer(deepFreeze(originalState), amountClicked(50));
      const expectedState = {
        kroner: {
          value: formatNumberToLocale('999999999'),
        },
        oere: {
          value: '00',
        },
        amount: {
          value: 999999999,
        },
      };
      expect(newState).to.deep.equal(expectedState);
    });

    it('It should set amount to 999 999 999 if kroner is 999 999 950 and +100 is added', () => {
      const originalState = {
        kroner: {
          value: '999 999 950',
        },
        oere: {
          value: '',
        },
      };
      const newState = transferFormReducer(deepFreeze(originalState), amountClicked(100));
      const expectedState = {
        kroner: {
          value: formatNumberToLocale('999999999'),
        },
        oere: {
          value: '00',
        },
        amount: {
          value: 999999999,
        },
      };
      expect(newState).to.deep.equal(expectedState);
    });

    it('It should set amount to 999 999 999 if kroner is 999 999 950 and +1000 is added', () => {
      const originalState = {
        kroner: {
          value: '999 999 950',
        },
        oere: {
          value: '',
        },
      };
      const newState = transferFormReducer(deepFreeze(originalState), amountClicked(1000));
      const expectedState = {
        kroner: {
          value: formatNumberToLocale('999999999'),
        },
        oere: {
          value: '00',
        },
        amount: {
          value: 999999999,
        },
      };
      expect(newState).to.deep.equal(expectedState);
    });
  });

  context('Action type: redux-form/CHANGE of kroner or øre', () => {
    it('It should return number in correct format for locale', () => {
      const originalState = {
        kroner: {
          value: '5 111',
        },
        oere: {
          value: '0',
        },
      };
      const action = {
        type: 'redux-form/CHANGE',
        field: 'kroner',
        value: '10 511',
        touch: false,
        form: 'transfer',
      };
      const newState = transferFormReducer(deepFreeze(originalState), action);
      const expectedState = {
        kroner: {
          value: formatNumberToLocale('10 511'),
          originalValue: action.value,
        },
        oere: {
          value: '00',
        },
        amount: {
          value: concatKronerAndOere(formatNumberToLocale('10 511'), originalState.oere.value),
        },
      };

      expect(newState.kroner).to.deep.equal(expectedState.kroner);
      expect(newState.oere).to.deep.equal(expectedState.oere);
      expect(newState.amount).to.deep.equal(expectedState.amount);
    });

    it('It should set amount to 999 999 999 if kroner is 999 999 950 and is changed to 999 999 999 999 (value is copy+pasted in)', () => {
      const originalState = {
        kroner: {
          value: '999999950',
        },
        oere: {
          value: '',
        },
      };
      const action = {
        type: 'redux-form/CHANGE',
        field: 'kroner',
        value: '999999999999',
        touch: false,
        form: 'transfer',
      };
      const newState = transferFormReducer(deepFreeze(originalState), action);
      const expectedState = {
        kroner: {
          value: 999999999,
          originalValue: action.value,
        },
        oere: {
          value: '00',
        },
        amount: {
          value: 999999999,
        },
      };
      expect(newState.kroner).to.deep.equal(expectedState.kroner);
      expect(newState.oere).to.deep.equal(expectedState.oere);
      expect(newState.amount).to.deep.equal(expectedState.amount);
    });

    it('It should set amount to 999 999 999 if kroner is 1000 and is changed to 999 999 999 999 999 (value is copy+pasted in)', () => {
      const originalState = {
        kroner: {
          value: '1 000',
        },
        oere: {
          value: '',
        },
      };
      const action = {
        type: 'redux-form/CHANGE',
        field: 'kroner',
        value: '999 999 999 999 999',
        touch: false,
        form: 'transfer',
      };
      const newState = transferFormReducer(deepFreeze(originalState), action);
      const expectedState = {
        kroner: {
          value: 999999999,
          originalValue: action.value,
        },
        oere: {
          value: '00',
        },
        amount: {
          value: 999999999,
        },
      };
      expect(newState.kroner).to.deep.equal(expectedState.kroner);
      expect(newState.oere).to.deep.equal(expectedState.oere);
      expect(newState.amount).to.deep.equal(expectedState.amount);
    });

    it('It should set øre to 00 if kroner will become not empty string and øre is blank', () => {
      const originalState = {
        kroner: {
          value: '',
        },
        oere: {
          value: '',
        },
      };
      const action = {
        type: 'redux-form/CHANGE',
        field: 'kroner',
        value: '1',
        touch: false,
        form: 'transfer',
      };
      const newState = transferFormReducer(deepFreeze(originalState), action);
      const expectedState = {
        kroner: {
          value: formatNumberToLocale('1'),
          originalValue: action.value,
        },
        oere: {
          value: '00',
        },
        amount: {
          value: 1.00,
        },
      };
      expect(newState.kroner).to.deep.equal(expectedState.kroner);
      expect(newState.oere).to.deep.equal(expectedState.oere);
      expect(newState.amount).to.deep.equal(expectedState.amount);
    });

    it('It should set øre to 00 if kroner is 0 and will be 1 and øre is blank', () => {
      const originalState = {
        kroner: {
          value: '0',
        },
        oere: {
          value: '',
        },
      };
      const action = {
        type: 'redux-form/CHANGE',
        field: 'kroner',
        value: '1',
        touch: false,
        form: 'transfer',
      };
      const newState = transferFormReducer(deepFreeze(originalState), action);
      const expectedState = {
        kroner: {
          value: formatNumberToLocale('1'),
          originalValue: action.value,
        },
        oere: {
          value: '00',
        },
        amount: {
          value: 1.00,
        },
      };
      expect(newState.kroner).to.deep.equal(expectedState.kroner);
      expect(newState.oere).to.deep.equal(expectedState.oere);
      expect(newState.amount).to.deep.equal(expectedState.amount);
    });
  });

  context('Action type: redux-form/BLUR of dueDate', () => {
    let dateTimeUtilStub;
    let dateInterpretationUtilStub;

    beforeEach(() => {
      dateTimeUtilStub = createDateTimeUtilStub();
      dateInterpretationUtilStub = createDateInterpretationUtilStub();
    });

    afterEach(() => {
      dateTimeUtilStub.restore();
      dateInterpretationUtilStub.restore();
    });

    it('It should not try to interpret text as date when action is a valid date format', () => {
      dateTimeUtilStub.isValid.returns(true);
      const originalState = {
        dueDate: {
          value: '24.05.2016',
        },
      };
      const action = {
        type: 'redux-form/BLUR',
        field: 'dueDate',
        value: '25.05.2016',
        touch: false,
        form: 'transfer',
      };
      const newState = transferFormReducer(deepFreeze(originalState), action);
      const expectedState = {
        dueDate: {
          value: '25.05.2016',
        },
      };
      expect(newState.dueDate).to.deep.equal(expectedState.dueDate);
    });

    it('It should try to interpret text as date when action value is invalid date format', () => {
      dateTimeUtilStub.isValid.returns(false);
      const originalState = {
        dueDate: {
          value: '24.05.2016',
        },
      };
      const action = {
        type: 'redux-form/CHANGE',
        field: 'dueDate',
        value: 'not valid at all!',
        touch: false,
        form: 'transfer',
      };
      const newState = transferFormReducer(deepFreeze(originalState), action);
      expect(newState.dueDate).to.deep.equal(originalState.dueDate);
    });

    it('It should return value as is when empty string', () => {
      const originalState = {
        dueDate: {
          value: '24.05.2016',
        },
      };
      const action = {
        type: 'redux-form/BLUR',
        field: 'dueDate',
        value: '',
        touch: false,
        form: 'transfer',
      };
      const newState = transferFormReducer(deepFreeze(originalState), action);
      expect(newState.dueDate).to.deep.equal(originalState.dueDate);
    });

    it('It should return value as is when null', () => {
      const originalState = {
        dueDate: {
          value: '24.05.2016',
        },
      };
      const action = {
        type: 'redux-form/BLUR',
        field: 'dueDate',
        value: null,
        touch: false,
        form: 'transfer',
      };
      const newState = transferFormReducer(deepFreeze(originalState), action);
      expect(newState.dueDate).to.deep.equal(originalState.dueDate);
    });

    it('It should return value as is when undefined', () => {
      const originalState = {
        dueDate: {
          value: '24.05.2016',
        },
      };
      const action = {
        type: 'redux-form/BLUR',
        field: 'dueDate',
        value: undefined,
        touch: false,
        form: 'transfer',
      };
      const newState = transferFormReducer(deepFreeze(originalState), action);
      expect(newState.dueDate).to.deep.equal(originalState.dueDate);
    });

    it('It should return existing dueDate when action is not for field dueDate', () => {
      const originalState = {
        dueDate: {
          value: '24.05.2016',
        },
      };
      const action = {
        type: 'redux-form/BLUR',
        field: 'foo',
        value: 'bar',
        touch: false,
        form: 'transfer',
      };
      const newState = transferFormReducer(deepFreeze(originalState), action);
      expect(newState.dueDate).to.deep.equal(originalState.dueDate);
    });
  });

  context('default action type', () => {
    it('It should return the existing state', () => {
      const originalState = {
        kroner: {
          value: '500',
        },
      };
      const action = {
        type: 'NONE_EXISITNG_ACTION',
      };
      const newState = transferFormReducer(deepFreeze(originalState), action);
      const expectedState = {
        kroner: {
          value: '500',
        },
      };
      expect(newState.kroner).to.deep.equal(expectedState.kroner);
    });
  });
});

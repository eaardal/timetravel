import { expect } from 'chai';
import errorCodes from './errorCodes';
import i18n from 'i18n/i18nCache';

describe('Test errorCodes', () => {
  context('test the error messages', () => {
    beforeEach(() => {
      i18n.initialize();
    });
    it('should return the correct message for the code', () => {
      Object.getOwnPropertyNames(errorCodes).forEach((error) => {
        expect(errorCodes[error].getMessage()).to.equal(i18n.translate(i => i[error]));
      });
    });
  });
});

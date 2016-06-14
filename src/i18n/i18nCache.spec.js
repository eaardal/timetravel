/* eslint no-unused-expressions: 0 */

import { expect } from 'chai';
import i18n from './i18nCache';

describe('Test I18nCache', () => {
  context('getLocale', () => {
    it('Should exist', () => {
      expect(i18n.getLocale).to.exist;
    });
  });
});

/* eslint no-unused-expressions: 0 */
/* eslint max-len: 0 */

import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import AccountPicker from 'components/AccountPicker/AccountPicker.jsx';
import i18n from 'i18n/i18nCache';

const accountPickerProps = {
  accounts: [],
  selectedAccount: undefined,
  isFetchingAccounts: false,
  accountListVisible: false,
  hasFocus: false,
  onBlurAccounts: () => {},
  onSelectAccount: () => {},
  onDropdownClick: () => {},
  onFocusAccounts: () => {},
  onKeyHandling: () => {},
  defaultChoiceMessage: undefined,
  label: 'test account',
  id: 'test-account',
  fields: {
    error: undefined,
  },
};

describe('Test AccountPicker', () => {
  beforeEach(() => {
    i18n.initialize();
  });

  context('Kredittkort konto', () => {
    it('should show info box', () => {
      const props = Object.assign({}, accountPickerProps, {
        selectedAccount: {
          accountNumber: '36333282342',
          accountNumberGuid: 'RmxleGlrcmVkaXR0',
          availableAmount: 19.91,
          accountName: 'Flexikreditt',
          kontotype: 'kredittkort',
        },
      });
      const wrapper = shallow(
        <AccountPicker {...props} />
      );

      expect(wrapper.contains('AlertBox')).to.be.false;

      const alertBox = wrapper.find('AlertBox');
      expect(alertBox.children()).to.have.length(2);
      expect(alertBox.childAt(0).text()).to.equal(i18n.translate(i => i.OVERFOERE_FROM_KREDITTKORT_TITLE));
      expect(alertBox.childAt(1).text()).to.equal(i18n.translate(i => i.OVERFOERE_FROM_KREDITTKORT_TEXT));
    });

    it('should show info box for kontotype=Kredittkort (first letter uppercase)', () => {
      const props = Object.assign({}, accountPickerProps, {
        selectedAccount: {
          accountNumber: '36333282342',
          accountNumberGuid: 'RmxleGlrcmVkaXR0',
          availableAmount: 19.91,
          accountName: 'Flexikreditt',
          kontotype: 'Kredittkort',
        },
      });
      const wrapper = shallow(
        <AccountPicker {...props} />
      );

      expect(wrapper.contains('AlertBox')).to.be.false;

      const alertBox = wrapper.find('AlertBox');
      expect(alertBox.children()).to.have.length(2);
      expect(alertBox.childAt(0).text()).to.equal(i18n.translate(i => i.OVERFOERE_FROM_KREDITTKORT_TITLE));
      expect(alertBox.childAt(1).text()).to.equal(i18n.translate(i => i.OVERFOERE_FROM_KREDITTKORT_TEXT));
    });

    it('should not show info box when konto has no kontotype property', () => {
      const props = Object.assign({}, accountPickerProps, {
        selectedAccount: {
          accountNumber: '36333282342',
          accountNumberGuid: 'RmxleGlrcmVkaXR0',
          availableAmount: 19.91,
          accountName: 'Flexikreditt',
        },
      });
      const wrapper = shallow(
        <AccountPicker {...props} />
      );
      expect(wrapper.contains('AlertBox')).to.be.false;
    });

    it('should not show info box when konto has kontotype not equal to kredittkort', () => {
      const props = Object.assign({}, accountPickerProps, {
        selectedAccount: {
          accountNumber: '36333282342',
          accountNumberGuid: 'RmxleGlrcmVkaXR0',
          availableAmount: 19.91,
          accountName: 'Flexikreditt',
          kontotype: 'not kredittkort',
        },
      });
      const wrapper = shallow(
        <AccountPicker {...props} />
      );
      expect(wrapper.contains('AlertBox')).to.be.false;
    });
  });
});

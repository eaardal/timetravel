import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import SignoutLink from './UtloggingLink';
import i18n from 'i18n/i18nCache';

describe('SignoutLink spec', () => {
  let signoutLinkElement;

  beforeEach(() => {
    i18n.initialize();
    signoutLinkElement = shallow(<SignoutLink />);
  });

  it('Should contain expected elements', () => {
    expect(signoutLinkElement.type()).to.equal('a');
    expect(signoutLinkElement.text()).to.equal('Logg ut');
    expect(signoutLinkElement.props().href).to.equal('#');
    expect(signoutLinkElement.props().onClick).to.be.a('function');
  });
});

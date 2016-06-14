import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import AmountIncreaser from './AmountIncreaser.jsx';
import AmountIncreaserItem from './AmountIncreaserItem.jsx';

describe('Test AmountIncreaser', () => {
  context('AmountIncreaser should render correctly', () => {
    it('should have the correct amount of AmountIncreaserItems', () => {
      const amounts = [1, 2, 3];
      const wrapper = shallow(
        <AmountIncreaser amounts = { amounts } />
      );
      expect(wrapper.find('AmountIncreaserItem')).to.have.length(3);
    });

    it('should have the correct amount displayed in the buttons', () => {
      const wrapper = shallow(
        <AmountIncreaserItem amount = { 500 } />
      );
      expect(wrapper.find('button').text()).to.contain('500');
    });

    it('should call function with amount when clicked', () => {
      const amount = 500;
      const addAmountFunction = (newAmount) => expect(newAmount).to.equal(amount);
      const wrapper = shallow(
        <AmountIncreaserItem amount = { amount } onAmountClick= {addAmountFunction} />
      );
      wrapper.find('button').simulate('click', { preventDefault: () => true });
    });
  });
});

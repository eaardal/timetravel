import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import { replaceLocalhost } from './config.util';

const os = require('os');

describe('Test replaceLocalhost helper function in config.js', () => {
  it('Should not change the input object to replaceLocalhost', () => {
    const input = {
      transferFrom: 'http://localhost/bank/api/betaling/accounts/transferfrom',
      transferTo: 'http://localhost/bank/api/betaling/accounts/transferto',
    };

    replaceLocalhost(deepFreeze(input));

    expect(input).to.deep.equal(input);
  });

  it('Return correct correct values for non-nested object', () => {
    const input = {
      transferFrom: 'http://localhost/bank/api/betaling/accounts/transferfrom',
      transferTo: 'http://localhost/bank/api/betaling/accounts/transferto',
    };

    const result = replaceLocalhost(deepFreeze(input));

    const expected = {
      transferFrom: `http://${os.hostname()}/bank/api/betaling/accounts/transferfrom`,
      transferTo: `http://${os.hostname()}/bank/api/betaling/accounts/transferto`,
    };

    expect(result).to.deep.equal(expected);
  });

  it('Return correct correct values for nested object', () => {
    const input = {
      apiEndpoints: {
        transferFrom: 'http://localhost/bank/api/betaling/accounts/transferfrom',
        transferTo: 'http://localhost/bank/api/betaling/accounts/transferto',
      },
      test: 'test',
    };

    const result = replaceLocalhost(deepFreeze(input));

    const expected = {
      apiEndpoints: {
        transferFrom: `http://${os.hostname()}/bank/api/betaling/accounts/transferfrom`,
        transferTo: `http://${os.hostname()}/bank/api/betaling/accounts/transferto`,
      },
      test: 'test',
    };

    expect(result).to.deep.equal(expected);
  });
});

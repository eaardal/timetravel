/* eslint no-unused-expressions: 0 */
/* eslint max-len: 0 */

import { expect } from 'chai';
import accountPickerReducer from './accountPicker.reducer';
import {
  toggleAccountList,
  requestAccountList,
  receiveAccountList,
  disableAccountItem,
  onBlurAccountPicker,
  onFocusAccountPicker,
  onClickSelectAccountItem,
  onKeypressedAccountPicker,
} from './accountPicker.actions';
import {
  onClickOutside,
} from 'components/ClickOutsideHandler/clickOutsideHandler.actions';
import deepFreeze from 'deep-freeze';

describe('accountPickerReducer', () => {
  describe('requestAccountList action', () => {
    it('should set accountPicker isFetching to be true', () => {
      const originalState = {
        accountPicker: {
          isFetchingAccounts: false,
        },
      };
      const newState
        = accountPickerReducer(deepFreeze(originalState), requestAccountList('accountPicker'));
      expect(newState.accountPicker.isFetchingAccounts).to.be.true;
    });
  });

  describe('receiveAccountList action', () => {
    it('should set accountPicker accounts to action payload', () => {
      const originalState = {
        accountPicker: {
          accounts: [],
        },
      };
      const receivedAccounts = [
        {
          name: 'Sparekonto', accountNumber: '3646.46.5622',
        }, {
          name: 'Brukskonto', accountNumber: '3646.46.5698',
        },
      ];
      const newState = accountPickerReducer(
        deepFreeze(originalState),
        receiveAccountList('accountPicker', receivedAccounts)
      );
      expect(newState.accountPicker.accounts).to.deep.equal(receivedAccounts);
    });

    it('should sort kontotype=kredittkort to be last in accounts list', () => {
      const originalState = {
        accountPicker: {
          accounts: [],
        },
      };
      const receivedAccounts = [
        {
          name: 'Brukskonto1', accountNumber: '3646.46.5622', kontotype: 'kredittkort',
        }, {
          name: 'Brukskonto2', accountNumber: '3646.46.5698',
        }, {
          name: 'Brukskonto3', accountNumber: '3646.46.5699', kontotype: 'kredittkort',
        }, {
          name: 'Brukskonto4', accountNumber: '3646.46.5700',
        }, {
          name: 'Brukskonto5', accountNumber: '3646.46.5701', kontotype: 'kredittkort',
        },
      ];
      const expectedSortedAccounts = [
        {
          name: 'Brukskonto2', accountNumber: '3646.46.5698',
        }, {
          name: 'Brukskonto4', accountNumber: '3646.46.5700',
        }, {
          name: 'Brukskonto1', accountNumber: '3646.46.5622', kontotype: 'kredittkort',
        }, {
          name: 'Brukskonto3', accountNumber: '3646.46.5699', kontotype: 'kredittkort',
        }, {
          name: 'Brukskonto5', accountNumber: '3646.46.5701', kontotype: 'kredittkort',
        },
      ];
      const newState = accountPickerReducer(
        deepFreeze(originalState),
        receiveAccountList('accountPicker', receivedAccounts)
      );
      expect(newState.accountPicker.accounts).to.deep.equal(expectedSortedAccounts);
    });

    it('should be case insensitive and handle kontotype=kredittkort and kontotype=Kredittkort', () => {
      const originalState = {
        accountPicker: {
          accounts: [],
        },
      };
      const receivedAccounts = [
        {
          name: 'Brukskonto1', accountNumber: '3646.46.5622', kontotype: 'Kredittkort',
        }, {
          name: 'Brukskonto2', accountNumber: '3646.46.5698',
        }, {
          name: 'Brukskonto3', accountNumber: '3646.46.5699', kontotype: 'Kredittkort',
        }, {
          name: 'Brukskonto4', accountNumber: '3646.46.5700',
        }, {
          name: 'Brukskonto5', accountNumber: '3646.46.5701', kontotype: 'kredittkort',
        },
      ];
      const expectedSortedAccounts = [
        {
          name: 'Brukskonto2', accountNumber: '3646.46.5698',
        }, {
          name: 'Brukskonto4', accountNumber: '3646.46.5700',
        }, {
          name: 'Brukskonto1', accountNumber: '3646.46.5622', kontotype: 'Kredittkort',
        }, {
          name: 'Brukskonto3', accountNumber: '3646.46.5699', kontotype: 'Kredittkort',
        }, {
          name: 'Brukskonto5', accountNumber: '3646.46.5701', kontotype: 'kredittkort',
        },
      ];
      const newState = accountPickerReducer(
        deepFreeze(originalState),
        receiveAccountList('accountPicker', receivedAccounts)
      );
      expect(newState.accountPicker.accounts).to.deep.equal(expectedSortedAccounts);
    });

    it('should change accountPicker isFetching from true to false', () => {
      const originalState = {
        accountPicker: {
          isFetchingAccounts: true,
        },
      };
      const receivedAccounts = [];
      const newState = accountPickerReducer(
        deepFreeze(originalState),
        receiveAccountList('accountPicker', receivedAccounts)
      );

      expect(newState.accountPicker.isFetchingAccounts).to.be.false;
    });
  });

  describe('toggleAccountList action', () => {
    context('when selectedAccount is not null', () => {
      const accounts = [
        { name: 'Sparekonto', accountNumber: '3646.46.5622' },
        { name: 'Brukskonto', accountNumber: '3646.46.5698' },
      ];
      const originalState = {
        accountPicker: {
          selectedAccount: accounts[1],
          accountListVisible: false,
          accounts,
        },
      };
      it('should toggle accountPicker accountListVisible'
      , () => {
        const newState = accountPickerReducer(
          deepFreeze(originalState),
          toggleAccountList('accountPicker')
        );

        expect(newState.accountPicker.accountListVisible)
          .to.equal(!originalState.accountPicker.accountListVisible);
      });

      it('should set isMarkedInList to true for selectedAccount', () => {
        const newState = accountPickerReducer(
          deepFreeze(originalState),
          toggleAccountList('accountPicker')
        );
        const expectedAccounts = [
          { name: 'Sparekonto', accountNumber: '3646.46.5622',
            wasMarkedInList: false, isMarkedInList: false },
          { name: 'Brukskonto', accountNumber: '3646.46.5698',
            wasMarkedInList: false, isMarkedInList: true },
        ];
        expect(newState.accountPicker.accounts).to.deep.equal(expectedAccounts);
      });
    });

    context('when selectedAccount is null', () => {
      const accounts = [
        { name: 'Sparekonto', accountNumber: '3646.46.5622' },
        { name: 'Brukskonto', accountNumber: '3646.46.5698' },
      ];
      const originalState = {
        accountPicker: {
          selectedAccount: null,
          accountListVisible: false,
          accounts,
        },
      };

      it('should set isMarkedInList to false for all accounts', () => {
        const newState = accountPickerReducer(
          deepFreeze(originalState),
          toggleAccountList('accountPicker')
        );
        const expectedAccounts = [
          { name: 'Sparekonto', accountNumber: '3646.46.5622',
            wasMarkedInList: false, isMarkedInList: false },
          { name: 'Brukskonto', accountNumber: '3646.46.5698',
            wasMarkedInList: false, isMarkedInList: false },
        ];
        expect(newState.accountPicker.accounts).to.deep.equal(expectedAccounts);
      });
    });
  });

  describe('onBlurAccountPicker action', () => {
    it('should set accountPicker hasFocus'
    , () => {
      const originalState = {
        accountPicker: {
          accountListVisible: true,
          hasFocus: true,
          accounts: [],
        },
      };
      const newState = accountPickerReducer(
        deepFreeze(originalState),
        onBlurAccountPicker('accountPicker')
      );

      expect(newState.accountPicker.accountListVisible).to.be.true;
      expect(newState.accountPicker.hasFocus).to.be.false;
    });
  });

  describe('onFocusAccountPicker action', () => {
    it('should set accountPicker hasFocus to true', () => {
      const originalState = {
        accountPicker: {
          hasFocus: false,
          accounts: [],
        },
      };
      const newState = accountPickerReducer(
        deepFreeze(originalState),
        onFocusAccountPicker('accountPicker')
      );

      expect(newState.accountPicker.hasFocus).to.be.true;
    });
  });

  describe('onClickSelectAccountItem action', () => {
    context('selectedAccount is BSU', () => {
      const accounts = [
        { name: 'Sparekonto', accountNumber: '3646.46.5622',
          wasMarkedInList: false, isMarkedInList: false },
        { name: 'BSU', accountNumber: '3646.46.5622',
          wasMarkedInList: false, isMarkedInList: false },
        { name: 'Brukskonto', accountNumber: '3646.46.5698', isDisabled: true,
          wasMarkedInList: false, isMarkedInList: false },
      ];
      const originalState = {
        accountPicker: {
          selectedAccount: accounts[1],
          accountListVisible: true,
          accounts,
        },
      };
      it('should set selectedAccount to newAccount Sparekonto if its not disabled', () => {
        const newAccount = { name: 'Sparekonto',
          accountNumber: '3646.46.5622', isMarkedInList: false };

        const newState = accountPickerReducer(deepFreeze(originalState),
          onClickSelectAccountItem('accountPicker', newAccount));

        expect(newState.accountPicker.selectedAccount).to.deep.equal(newAccount);
      });

      it('should set isMarkedInList to true for newAccount Sparekonto if its not disabled'
      , () => {
        const newAccount = { name: 'Sparekonto',
          accountNumber: '3646.46.5622', isMarkedInList: false };

        const newState = accountPickerReducer(deepFreeze(originalState),
          onClickSelectAccountItem('accountPicker', newAccount));

        expect(newState.accountPicker.selectedAccount).to.deep.equal(newAccount);
      });

      it('should not change state Sparekonto is disabled', () => {
        const newAccount = { name: 'Sparekonto', accountNumber: '3646.46.5622', isDisabled: true };

        const newState = accountPickerReducer(deepFreeze(originalState),
          onClickSelectAccountItem('accountPicker', newAccount));

        expect(newState).to.deep.equal(originalState);
      });
    });
  });

  describe('onKeypressedAccountPicker action', () => {
    describe('toggle accountlist is triggered', () => {
      const toggleKeyEvents = [
        { keyCode: 13 },
        { keyCode: 32 },
        { altKey: true, keyCode: 38 },
        { altKey: true, keyCode: 40 },
      ];
      toggleKeyEvents.forEach((keyEvent) => {
        context('when selectedAccount is not null', () => {
          const accounts = [
            { name: 'Brukskonto', accountNumber: '3646.46.5611',
              wasMarkedInList: false, isDisabled: false },
            { name: 'BSU', accountNumber: '3646.46.5622',
              wasMarkedInList: false, isDisabled: false },
          ];
          const originalState = {
            accountPicker: {
              selectedAccount: accounts[1],
              accountListVisible: true,
              accounts,
            },
          };

          it(`should toggle accountListVisible
            if key pressed is ${keyEvent.keyCode}`
          , () => {
            const newState = accountPickerReducer(
              deepFreeze(originalState),
              onKeypressedAccountPicker('accountPicker', keyEvent)
            );

            expect(newState.accountPicker.accountListVisible)
              .to.equal(!originalState.accountPicker.accountListVisible);
          });

          it(`should set isMarkedInList to true for the selected account
            if key pressed is ${keyEvent.keyCode}`
          , () => {
            const newState = accountPickerReducer(
              deepFreeze(originalState),
              onKeypressedAccountPicker('accountPicker', keyEvent)
            );

            const expectedAccounts = [
              {
                name: 'Brukskonto', accountNumber: '3646.46.5611', isDisabled: false,
                wasMarkedInList: false, isMarkedInList: false,
              },
              {
                name: 'BSU', accountNumber: '3646.46.5622', isDisabled: false,
                wasMarkedInList: false, isMarkedInList: true,
              },
            ];
            expect(newState.accountPicker.accounts).to.deep.equal(expectedAccounts);
          });
        });

        context('when selectedAccount is null', () => {
          it(`should not set isMarkedInList to true for any account if key pressed
            is ${keyEvent.keyCode}`
          , () => {
            const accounts = [
              { name: 'Brukskonto', accountNumber: '.5611',
                wasMarkedInList: false, isDisabled: false },
              { name: 'BSU', accountNumber: '.5622',
                wasMarkedInList: false, isDisabled: false },
            ];
            const originalState = {
              accountPicker: {
                selectedAccount: null,
                accountListVisible: true,
                accounts,
              },
            };

            const newState = accountPickerReducer(
              deepFreeze(originalState),
              onKeypressedAccountPicker('accountPicker', keyEvent)
            );
            const expectedAccounts = [
              {
                name: 'Brukskonto', accountNumber: '.5611', isDisabled: false,
                wasMarkedInList: false, isMarkedInList: false,
              },
              {
                name: 'BSU', accountNumber: '.5622', isDisabled: false,
                wasMarkedInList: false, isMarkedInList: false,
              },
            ];

            expect(newState.accountPicker.accounts).to.deep.equal(expectedAccounts);
          });
        });
      });
    });

    describe('escape accountlist is triggered', () => {
      const toggleKeyEvents = [
        { keyCode: 27 }, // ESCAPE
        { keyCode: 9 },  // TAB
      ];
      toggleKeyEvents.forEach((keyEvent) => {
        context('when accountListVisible', () => {
          const accounts = [
            { name: 'Brukskonto', accountNumber: '3646.46.5611',
              wasMarkedInList: false, isDisabled: false },
            { name: 'BSU', accountNumber: '3646.46.5622',
              wasMarkedInList: false, isDisabled: false },
          ];
          const originalState = {
            accountPicker: {
              selectedAccount: accounts[1],
              accountListVisible: true,
              accounts,
            },
          };

          it(`should close accountListVisible
            if key pressed is ${keyEvent.keyCode}`
          , () => {
            const newState = accountPickerReducer(
              deepFreeze(originalState),
              onKeypressedAccountPicker('accountPicker', keyEvent)
            );

            expect(newState.accountPicker.accountListVisible)
              .to.equal(!originalState.accountPicker.accountListVisible);
          });
        });
        context('when accountListVisible is false', () => {
          it(`should not accountListVisible if key pressed
            is ${keyEvent.keyCode}`
          , () => {
            const originalState = {
              accountPicker: {
                selectedAccount: null,
                accountListVisible: false,
                accounts: [],
              },
            };

            const newState = accountPickerReducer(
              deepFreeze(originalState),
              onKeypressedAccountPicker('accountPicker', keyEvent)
            );

            expect(newState.accountPicker.accountListVisible)
              .to.deep.equal(originalState.accountPicker.accountListVisible);
          });
        });
      });
    });

    describe('select previous element is triggered', () => {
      const selectPreviousKeyEvents = [{ keyCode: 37 }, { keyCode: 38 }];
      selectPreviousKeyEvents.forEach((keyEvent) => {
        context('when selectedAccount is Sparekonto', () => {
          it(`should set selectedAccount to the previous if key pressed is ${keyEvent.keyCode}`
          , () => {
            const accounts = [
              { name: 'Brukskonto', accountNumber: '3646.46.5611', wasMarkedInList: false },
              { name: 'BSU', accountNumber: '3646.46.5622', wasMarkedInList: false },
              { name: 'Sparekonto', accountNumber: '3646.46.5633', wasMarkedInList: false },
              { name: 'Driftskonto', accountNumber: '3646.46.5644', wasMarkedInList: false },
            ];
            const selectedIndex = 2;
            const originalState = {
              accountPicker: {
                selectedAccount: accounts[selectedIndex],
                accounts,
              },
            };

            const newState = accountPickerReducer(
              deepFreeze(originalState),
              onKeypressedAccountPicker('accountPicker', keyEvent)
            );
            const expectedSelectedAccount = accounts[1];

            expect(newState.accountPicker.selectedAccount).to.deep.equal(expectedSelectedAccount);
          });
        });

        context('when selectedAccount is the first item', () => {
          it(`should not change selectedAccount if key pressed is ${keyEvent.keyCode}`, () => {
            const accounts = [
              { name: 'Brukskonto', accountNumber: '3646.46.5611' },
              { name: 'BSU', accountNumber: '3646.46.5622' },
              { name: 'Sparekonto', accountNumber: '3646.46.5633' },
              { name: 'Driftskonto', accountNumber: '3646.46.5644' },
            ];
            const originalState = {
              accountPicker: {
                selectedAccount: accounts[0],
                accounts,
              },
            };

            const newState = accountPickerReducer(
              deepFreeze(originalState),
              onKeypressedAccountPicker('accountPicker', keyEvent)
            );

            const expectedSelectedAccount = accounts[0];
            expect(newState.accountPicker.selectedAccount).to.deep.equal(expectedSelectedAccount);
          });
        });

        context(`when selectedAccount is the second item and disabledAccount
          is the the first item`
        , () => {
          it(`should not change selectedAccount if key pressed is ${keyEvent.keyCode}`
          , () => {
            const accounts = [
              { name: 'Brukskonto', accountNumber: '3646.46.5611', isDisabled: true },
              { name: 'BSU', accountNumber: '3646.46.5622' },
              { name: 'Sparekonto', accountNumber: '3646.46.5633' },
              { name: 'Driftskonto', accountNumber: '3646.46.5644' },
            ];
            const originalState = {
              accountPicker: {
                selectedAccount: accounts[1],
                accounts,
              },
            };

            const newState = accountPickerReducer(
              deepFreeze(originalState),
              onKeypressedAccountPicker('accountPicker', keyEvent)
            );

            const expectedSelectedAccount = accounts[1];
            expect(newState.accountPicker.selectedAccount).to.deep.equal(expectedSelectedAccount);
          });
        });

        context('when no account is selected', () => {
          it(`should return the state unchanged if key pressed is ${keyEvent.keyCode}`, () => {
            const accounts = [
              { name: 'Brukskonto', accountNumber: '3646.46.5611', wasMarkedInList: false },
              { name: 'BSU', accountNumber: '3646.46.5622', wasMarkedInList: false },
              { name: 'Sparekonto', accountNumber: '3646.46.5633', wasMarkedInList: false },
              { name: 'Driftskonto', accountNumber: '3646.46.5644', wasMarkedInList: false },
            ];
            const originalState = {
              accountPicker: {
                accounts,
              },
            };

            const newState = accountPickerReducer(
              deepFreeze(originalState),
              onKeypressedAccountPicker('accountPicker', keyEvent)
            );

            expect(newState.accountPicker.selectedAccount).to.not.exist;
          });
        });

        context('when new account is selected', () => {
          it(`should mark the new account in list if key pressed is ${keyEvent.keyCode}`
          , () => {
            const accounts = [
              { name: 'Brukskonto', accountNumber: '3646.46.5611', wasMarkedInList: false },
              { name: 'BSU', accountNumber: '3646.46.5622', wasMarkedInList: false },
              { name: 'Sparekonto', accountNumber: '3646.46.5633', wasMarkedInList: false },
              { name: 'Driftskonto', accountNumber: '3646.46.5644', wasMarkedInList: false },
            ];
            const originalState = {
              accountPicker: {
                selectedAccount: accounts[1],
                accounts,
              },
            };
            const expectedAccounts = [
              { name: 'Brukskonto', accountNumber: '3646.46.5611',
                wasMarkedInList: false, isMarkedInList: true },
              { name: 'BSU', accountNumber: '3646.46.5622',
                wasMarkedInList: false, isMarkedInList: false },
              { name: 'Sparekonto', accountNumber: '3646.46.5633',
                wasMarkedInList: false, isMarkedInList: false },
              { name: 'Driftskonto', accountNumber: '3646.46.5644',
                wasMarkedInList: false, isMarkedInList: false },
            ];

            const newState = accountPickerReducer(
              deepFreeze(originalState),
              onKeypressedAccountPicker('accountPicker', keyEvent)
            );

            expect(newState.accountPicker.accounts).to.deep.equal(expectedAccounts);
          });
        });
      });
    });

    describe('when search for account item is triggered', () => {
      context('when selected account is Brukskonto and Sparekonto is disabled', () => {
        const accounts = [
          { name: 'Vestavinn funskj', accountNumber: '.5600',
            isDisabled: false, wasMarkedInList: false },
          { name: 'Brukskonto', accountNumber: '.5611',
            isDisabled: false, wasMarkedInList: false },
          { name: 'BSU', accountNumber: '.5622',
            isDisabled: false, wasMarkedInList: false },
          { name: 'Sparekonto', accountNumber: '.5633',
            isDisabled: true, wasMarkedInList: false },
          { name: 'Driftskonto', accountNumber: '.5644',
            isDisabled: false, wasMarkedInList: false },
          { name: 'Skattetrekkskonto', accountNumber: '.5655',
            isDisabled: false, wasMarkedInList: false },
        ];
        const originalState = {
          accountPicker: {
            selectedAccount: accounts[1],
            accounts,
          },
        };

        it('should set selected account to to BSU if key pressed is b', () => {
          const newState = accountPickerReducer(deepFreeze(originalState),
            onKeypressedAccountPicker('accountPicker', { keyCode: 66 }));

          expect(newState.accountPicker.selectedAccount).to.deep.equal(accounts[2]);
        });

        it('should set selected account to to Vestavinn if key pressed is v', () => {
          const newState = accountPickerReducer(deepFreeze(originalState),
           onKeypressedAccountPicker('accountPicker', { keyCode: 86 }));

          expect(newState.accountPicker.selectedAccount).to.deep.equal(accounts[0]);
        });

        it('should only set isMarkedInList to true for Vestavinn if key pressed is v', () => {
          const newState = accountPickerReducer(
            deepFreeze(originalState),
            onKeypressedAccountPicker('accountPicker', { keyCode: 86 })
          );
          const expectedAccounts = [
            {
              name: 'Vestavinn funskj', accountNumber: '.5600', isDisabled: false,
              isMarkedInList: true, wasMarkedInList: false,
            },
            {
              name: 'Brukskonto', accountNumber: '.5611', isDisabled: false,
              isMarkedInList: false, wasMarkedInList: false,
            },
            {
              name: 'BSU', accountNumber: '.5622', isDisabled: false,
              isMarkedInList: false, wasMarkedInList: false,
            },
            {
              name: 'Sparekonto', accountNumber: '.5633', isDisabled: true,
              isMarkedInList: false, wasMarkedInList: false,
            },
            {
              name: 'Driftskonto', accountNumber: '.5644', isDisabled: false,
              isMarkedInList: false, wasMarkedInList: false,
            },
            {
              name: 'Skattetrekkskonto', accountNumber: '.5655', isDisabled: false,
              isMarkedInList: false, wasMarkedInList: false,
            },
          ];
          expect(newState.accountPicker.accounts).to.deep.equal(expectedAccounts);
        });

        it(
          `should skip disabled Sparekonto and set selected to Skattetrekkskonto
          if key pressed is s`
          , () => {
          const newState = accountPickerReducer(
            deepFreeze(originalState),
            onKeypressedAccountPicker('accountPicker', { keyCode: 83 })
          );
          expect(newState.accountPicker.selectedAccount).to.deep.equal(accounts[5]);
        });

        it('should not change the selected if key pressed x has no match', () => {
          const newState = accountPickerReducer(
            deepFreeze(originalState),
            onKeypressedAccountPicker('accountPicker', { keyCode: 88 })
          );

          expect(newState.accountPicker.selectedAccount).to.deep.equal(accounts[1]);
        });
      });

      context('when selectedAccount is null', () => {
        const accounts = [
          { name: 'Vestavinn funskj', accountNumber: '.5600',
            isDisabled: false, wasMarkedInList: false },
          { name: 'Brukskonto', accountNumber: '.5611',
            isDisabled: false, wasMarkedInList: false },
          { name: 'BSU', accountNumber: '.5622',
            isDisabled: false, wasMarkedInList: false },
          { name: 'Sparekonto', accountNumber: '.5633',
            isDisabled: true, wasMarkedInList: false },
          { name: 'Driftskonto', accountNumber: '.5644',
            isDisabled: false, wasMarkedInList: false },
          { name: 'Skattetrekkskonto', accountNumber: '.5655',
            isDisabled: false, wasMarkedInList: false },
        ];
        const originalState = {
          accountPicker: {
            selectedAccount: null,
            accounts,
          },
        };

        it('should set selected account to to Brukskonto if key pressed is b', () => {
          const newState = accountPickerReducer(
            deepFreeze(originalState),
            onKeypressedAccountPicker('accountPicker', { keyCode: 66 })
          );

          expect(newState.accountPicker.selectedAccount).to.deep.equal(accounts[1]);
        });
      });
    });

    describe('select previous element is triggered', () => {
      const nextKeyEvents = [{ keyCode: 39 }, { keyCode: 40 }];
      nextKeyEvents.forEach((keyEvent) => {
        context('when selectedAccount is BSU', () => {
          it(`should set selectedAccount to the next item when key pressed is ${keyEvent.keyCode}`
          , () => {
            const accounts = [
              { name: 'Brukskonto', accountNumber: '.5611',
                wasMarkedInList: false, isDisabled: false },
              { name: 'BSU', accountNumber: '.5622',
                wasMarkedInList: false, isDisabled: false },
              { name: 'Sparekonto', accountNumber: '.5633',
                wasMarkedInList: false, isDisabled: false },
              { name: 'Driftskonto', accountNumber: '.5644',
                wasMarkedInList: false, isDisabled: false },
            ];
            const originalState = {
              accountPicker: {
                selectedAccount: accounts[1],
                accountListVisible: true,
                accounts,
              },
            };

            const newState = accountPickerReducer(
              deepFreeze(originalState),
              onKeypressedAccountPicker('accountPicker', keyEvent)
            );
            const expectedAccounts = [
              {
                name: 'Brukskonto', accountNumber: '.5611', isDisabled: false,
                wasMarkedInList: false, isMarkedInList: false,
              },
              {
                name: 'BSU', accountNumber: '.5622', isDisabled: false,
                wasMarkedInList: false, isMarkedInList: false,
              },
              {
                name: 'Sparekonto', accountNumber: '.5633', isDisabled: false,
                wasMarkedInList: false, isMarkedInList: true,
              },
              {
                name: 'Driftskonto', accountNumber: '.5644', isDisabled: false,
                wasMarkedInList: false, isMarkedInList: false,
              },
            ];
            const expectedState = {
              accountPicker: {
                selectedAccount: accounts[2],
                accountListVisible: true,
                accounts: expectedAccounts,
              },
            };

            expect(newState).to.deep.equal(expectedState);
          });
        });
      });
    });

    context('when selectedAccount is BSU and the next is disabled', () => {
      it('should skip the disabledAccount', () => {
        const accounts = [
          { name: 'Brukskonto', accountNumber: '.5611',
            wasMarkedInList: false, isDisabled: false },
          { name: 'BSU', accountNumber: '.5622',
            wasMarkedInList: false, isDisabled: false },
          { name: 'Sparekonto', accountNumber: '.5633',
            wasMarkedInList: false, isDisabled: true },
          { name: 'Driftskonto', accountNumber: '.5644',
            wasMarkedInList: false, isDisabled: false },
        ];
        const originalState = {
          accountPicker: {
            selectedAccount: accounts[1],
            accountListVisible: true,
            accounts,
          },
        };

        const newState = accountPickerReducer(
          deepFreeze(originalState),
          onKeypressedAccountPicker('accountPicker', { keyCode: 39 })
        );
        const expectedAccounts = [
          { name: 'Brukskonto', accountNumber: '.5611', isDisabled: false,
            wasMarkedInList: false, isMarkedInList: false },
          { name: 'BSU', accountNumber: '.5622', isDisabled: false,
            wasMarkedInList: false, isMarkedInList: false },
          { name: 'Sparekonto', accountNumber: '.5633', isDisabled: true,
            wasMarkedInList: false, isMarkedInList: false },
          { name: 'Driftskonto', accountNumber: '.5644', isDisabled: false,
            wasMarkedInList: false, isMarkedInList: true },
        ];
        const expectedState = {
          accountPicker: {
            selectedAccount: accounts[3],
            accountListVisible: true,
            accounts: expectedAccounts,
          },
        };

        expect(newState).to.deep.equal(expectedState);
      });
    });

    context('when selectedAccount is the last item', () => {
      it('should not change selectedAccount', () => {
        const accounts = [
          { name: 'Brukskonto', accountNumber: '.5611',
            wasMarkedInList: false, isDisabled: false },
          { name: 'BSU', accountNumber: '.5622',
            wasMarkedInList: false, isDisabled: false },
          { name: 'Sparekonto', accountNumber: '.5633',
            wasMarkedInList: false, isDisabled: false },
          { name: 'Driftskonto', accountNumber: '.5644',
            wasMarkedInList: false, isDisabled: false },
        ];
        const selectedIndex = accounts.length - 1;
        const originalState = {
          accountPicker: {
            selectedAccount: accounts[selectedIndex],
            accountListVisible: true,
            accounts,
          },
        };

        const newState = accountPickerReducer(
          deepFreeze(originalState),
          onKeypressedAccountPicker('accountPicker', { keyCode: 39 })
        );
        const expectedAccounts = [
          { name: 'Brukskonto', accountNumber: '.5611', isDisabled: false,
            wasMarkedInList: false, isMarkedInList: false },
          { name: 'BSU', accountNumber: '.5622', isDisabled: false,
            wasMarkedInList: false, isMarkedInList: false },
          { name: 'Sparekonto', accountNumber: '.5633', isDisabled: false,
            wasMarkedInList: false, isMarkedInList: false },
          { name: 'Driftskonto', accountNumber: '.5644', isDisabled: false,
            wasMarkedInList: false, isMarkedInList: true },
        ];
        const expectedState = {
          accountPicker: {
            selectedAccount: accounts[selectedIndex],
            accountListVisible: true,
            accounts: expectedAccounts,
          },
        };

        expect(newState).to.deep.equal(expectedState);
      });
    });

    context('when no account is selected', () => {
      it('first element is selected', () => {
        const accounts = [
          { name: 'Brukskonto', accountNumber: '.5611',
            wasMarkedInList: false, isDisabled: false },
          { name: 'BSU', accountNumber: '.5622',
            wasMarkedInList: false, isDisabled: false },
          { name: 'Sparekonto', accountNumber: '.5633',
            wasMarkedInList: false, isDisabled: false },
          { name: 'Driftskonto', accountNumber: '.5644',
            wasMarkedInList: false, isDisabled: false },
        ];
        const selectedIndex = 0;
        const originalState = {
          accountPicker: {
            accountListVisible: true,
            accounts,
          },
        };

        const newState = accountPickerReducer(
          deepFreeze(originalState),
          onKeypressedAccountPicker('accountPicker', { keyCode: 39 })
        );
        const expectedAccounts = [
          { name: 'Brukskonto', accountNumber: '.5611', isDisabled: false,
            wasMarkedInList: false, isMarkedInList: true },
          { name: 'BSU', accountNumber: '.5622', isDisabled: false,
            wasMarkedInList: false, isMarkedInList: false },
          { name: 'Sparekonto', accountNumber: '.5633', isDisabled: false,
            wasMarkedInList: false, isMarkedInList: false },
          { name: 'Driftskonto', accountNumber: '.5644', isDisabled: false,
            wasMarkedInList: false, isMarkedInList: false },
        ];
        const expectedState = {
          accountPicker: {
            selectedAccount: accounts[selectedIndex],
            accountListVisible: true,
            accounts: expectedAccounts,
          },
        };
        expect(newState).to.deep.equal(expectedState);
      });
    });
  });

  describe('disableAccountItem action', () => {
    it('should set disabled accounts isDisabled to true', () => {
      const disabledAccount = {
        name: 'Brukskonto', accountNumber: '3646.46.5698',
        availableAmount: 412, wasMarkedInList: false,
      };

      const originalState = {
        accountPicker: {
          accounts: [disabledAccount],
        },
      };
      const newState = accountPickerReducer(
        deepFreeze(originalState),
        disableAccountItem('accountPicker', disabledAccount.accountNumber)
      );
      const expectedState = {
        accountPicker: {
          selectedAccount: undefined,
          accounts: [{
            ...disabledAccount, isDisabled: true,
            isMarkedInList: false, wasMarkedInList: false,
          }],
        },
      };
      expect(newState).to.deep.equal(expectedState);
    });
    it('should set selectedAccount to null if selected gets disabled', () => {
      const disabledAccount = {
        name: 'Brukskonto', accountNumber: '3646.46.5698',
        availableAmount: 412, wasMarkedInList: false, isMarkedInList: true,
      };
      const untouchedAccount = {
        name: 'Brukskonto2', accountNumber: '3646.46.5699',
        availableAmount: 412, wasMarkedInList: false, isMarkedInList: false,
      };

      const originalState = {
        accountPicker: {
          selectedAccount: disabledAccount,
          accounts: [disabledAccount, untouchedAccount],
        },
      };
      const newState = accountPickerReducer(
        deepFreeze(originalState),
        disableAccountItem('accountPicker', disabledAccount.accountNumber)
      );
      const expectedState = {
        accountPicker: {
          selectedAccount: null,
          accounts: [{ ...disabledAccount, isDisabled: true,
            isMarkedInList: false, wasMarkedInList: true,
          }, { ...untouchedAccount, isDisabled: false }],
        },
      };
      expect(newState).to.deep.equal(expectedState);
    });
  });

  describe('onClickOutside action', () => {
    const originalState = {
      accountPicker: {
        accountListVisible: true,
        accounts: [],
      },
    };
    it('should set accountListVisible to false id containerId equals accountPickerName', () => {
      const newState = accountPickerReducer(
        deepFreeze(originalState),
        onClickOutside(['accountPicker'])
      );
      expect(newState.accountPicker.accountListVisible)
        .to.deep.equal(false);
    });
  });
});

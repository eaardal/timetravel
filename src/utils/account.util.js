
export const hasEnoughAccountsForTransfer = (fromAccounts, toAccounts) => {
  if (fromAccounts.length <= 0 || toAccounts.length <= 0) {
    return false;
  } else if (fromAccounts.length === 1 && toAccounts.length === 1) {
    if (fromAccounts[0].accountNumber === toAccounts[0].accountNumber) {
      return false;
    }
    return true;
  }
  return true;
};

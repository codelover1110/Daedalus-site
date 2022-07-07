import { selectedAccountConstants } from "../_constants/selectedAccounts.constants";

export const selectAccount = (account) => {
  return {
    type: selectedAccountConstants.SET_SELECTED_ACCOUNT,
    payload: account,
  };
};

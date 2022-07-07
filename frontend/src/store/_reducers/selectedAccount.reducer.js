import { selectedAccountConstants } from "../_constants/selectedAccounts.constants";

export const selectAccountReducer = (selectedAccount = null, action) => {
  if (action.type === selectedAccountConstants.SET_SELECTED_ACCOUNT) {
    return action.payload;
  }

  return selectedAccount;
};

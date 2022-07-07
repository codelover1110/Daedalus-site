import { combineReducers } from "redux";

import { authenticationReducer } from "./authentication.reducer";
import { registrationReducer } from "./registration.reducer";
import { alertReducer } from "./alert.reducer";
import { strategyReducer } from "./startegy.reducer";
import { selectAccountReducer } from "./selectedAccount.reducer";

const rootReducer = combineReducers({
  authenticationReducer,
  registrationReducer,
  alertReducer,
  strategyReducer,
  selectAccountReducer,
});

export default rootReducer;

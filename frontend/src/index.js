import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import firebase from "firebase/app";
import { createBrowserHistory } from "history";
import App from "./App";
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import { PersistGate } from "redux-persist/integration/react";
import * as serviceWorker from "./serviceWorker";

import "./assets/scss/style.scss";
import "./App.css";

import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authenticationReducer } from "./store/_reducers/authentication.reducer";
import { registrationReducer } from "./store/_reducers/registration.reducer";
import { alertReducer } from "./store/_reducers/alert.reducer";
import { strategyReducer } from "./store/_reducers/startegy.reducer";
import { selectAccountReducer } from "./store/_reducers/selectedAccount.reducer";
import { userConstants } from "./store/_constants";

const cors = require("cors")({
  origin: "*",
  credentials: true,
  methods: "GET",
});

const history = createBrowserHistory();

const appReducer = combineReducers({
  authentication: authenticationReducer,
  registration: registrationReducer,
  alert: alertReducer,
  strategy: strategyReducer,
  account: selectAccountReducer,
});

const rootReducer = (state, action) => {
  if (action.type === userConstants.LOGOUT) {
    localStorage.removeItem("persist:root");
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

const persistConfig = {
    key: "root",
    storage,
  },
  persistedReducer = persistReducer(persistConfig, rootReducer),
  composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose,
  store = createStore(
    persistedReducer,
    composeEnhancer(applyMiddleware(thunk))
  ),
  persistor = persistStore(store);

const app = (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* </Router> */}
    </PersistGate>
  </Provider>
);
ReactDOM.render(app, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

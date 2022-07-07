import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
// Layouts
import LayoutDefault from "./components/layouts/LayoutDefault";
// Views
import Home from "./containers/views/Home/Home";
import Connect from "./containers/views/Connect/Connect";
import Privacy from "./containers/views/Privacy/Privacy";
import Settings from "./containers/views/Settings/Settings";
import Upgrade from "./containers/views/Upgrade/Upgrade";
import Terms from "./containers/views/Terms/Terms";
import Dashboard from "./components/Dashboard/Dashboard";
import Landing from "./containers/views/Landing/Landing";
import SubscriptionSuccess from "./containers/views/Subscription/Success";
import SubscriptionCanceled from "./containers/views/Subscription/Canceled";
import Login from "./containers/views/Login/Login";
import Signup from "./containers/views/Signup/Signup";
import MyPortfolio from "./containers/views/MyPortfolio/MyPortfolio";
import MyStrategies from "./containers/views/MyStrategies/MyStrategies";
import TemplateStrategies from "./containers/views/TemplateStrategies/TemplateStrategies";
import CreateStrategy from "./containers/views/CreateStrategy/CreateStrategy";
import Backtest from "./containers/views/Backtest/Backtest";

import "react-notifications/lib/notifications.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Admin from "./components/admin.js";
import AuthProvider from "./contexts/auth_ctx";
import RequireAuth from "./components/guard/require_auth";
import {connect, useSelector} from "react-redux";
import {hasConnectedAccounts, isLoggedIn} from "./store/_selectors/user.selectors";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from '@stripe/react-stripe-js';
import {config} from "./config";
import EmailVerify from "./containers/views/EmailVerify/EmailVerify";
const stripePromise = loadStripe(config.stripe_publishable_key);

function App() {
  const hasAccounts  = useSelector((state)=>hasConnectedAccounts(state))
  const loggedIn  = useSelector((state)=>isLoggedIn(state))
  const getUnProtectedRouteElem = (component) => {
    if(loggedIn){
      if(hasAccounts){
        return <Navigate to="/home" />
      }
      return <Navigate to="/Connect" />
    }
    return component;
  }

  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route element={<LayoutDefault />}>
            <Route
              exact
              path="/"
              element={getUnProtectedRouteElem(<Login />)}
            />
            <Route
              exact
              path="/login"
              element={getUnProtectedRouteElem(<Login />)}
            />
            <Route
              exact
              path="/signup"
              element={getUnProtectedRouteElem(<Signup />)}
            />
            <Route
              exact
              path="/EmailVerify"
              element={
                <RequireAuth>
                  <EmailVerify />
                </RequireAuth>
              }
            />
            <Route
              exact
              path="/Home"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              exact
              path="/CreateStrategy"
              element={
                <RequireAuth>
                  <CreateStrategy />
                </RequireAuth>
              }
            />
            <Route
              exact
              path="/Admin"
              element={
                <RequireAuth>
                  <Admin />
                </RequireAuth>
              }
            />
            <Route
              path="/Connect"
              exact
              element={
                <RequireAuth>
                  <Connect />
                </RequireAuth>
              }
            />
            <Route
              path="/Upgrade"
              exact
              element={
                <RequireAuth>
                  <Upgrade />
                </RequireAuth>
              }
            />
            <Route
              exact
              path="/Dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/MyPortfolio"
              exact
              element={
                <RequireAuth>
                  <MyPortfolio />
                </RequireAuth>
              }
            />
          </Route>
          <Route>
            <Route
              path="/Privacy"
              exact
              element={
                <RequireAuth>
                  <Privacy />
                </RequireAuth>
              }
            />
            <Route
              path="/Terms"
              exact
              element={
                <RequireAuth>
                  <Terms/>
                </RequireAuth>
              }
            />
            <Route
              path="/MyStrategies"
              exact
              element={
                <RequireAuth>
                  <MyStrategies />
                </RequireAuth>
              }
            />
            <Route
              path="/TemplateStrategies"
              exact
              element={
                <RequireAuth>
                  <TemplateStrategies />
                </RequireAuth>
              }
            />
            <Route
              path="/SubscriptionSuccess"
              exact
              element={
                <RequireAuth>
                  <SubscriptionSuccess />
                </RequireAuth>
              }
            />
            <Route
              path="/SubscriptionCanceled"
              exact
              element={
                <RequireAuth>
                  <SubscriptionCanceled />
                </RequireAuth>
              }
            />
            <Route
              path="/Settings"
              exact
              element={
                <RequireAuth>
                  <Settings />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </Elements>
    </AuthProvider>
  );
}

const mapStateToProps = (state) => {
  return { isUserLoggedIn: state.authentication.loggedIn };
};
export default connect(mapStateToProps, null)(App);

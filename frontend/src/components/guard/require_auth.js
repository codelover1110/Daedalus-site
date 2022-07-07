import React from "react";

import {useAuth} from "../../contexts/auth_ctx";
import {useLocation, Navigate} from "react-router-dom";
import Loader from "../elements/Loader";
import {useSelector} from "react-redux";
import {hasConnectedAccounts} from "../../store/_selectors/user.selectors";
// just to protect routes like /Dashboard
function RequireAuth({children}) {
  const {currentUser, loading} = useAuth();
  const hasAccounts  = useSelector((state)=>hasConnectedAccounts(state))
  const location = useLocation();
  if (loading) return <Loader />
  if (currentUser) {
    if(!currentUser.emailVerified && location.pathname.indexOf('/EmailVerify')===-1){
      return <Navigate to="/EmailVerify" />
    }
    if(!hasAccounts && location.pathname.indexOf('/Connect')===-1  && location.pathname.indexOf('/EmailVerify')){
      return <Navigate to="/Connect" />
    }
    return children
  }
  return <Navigate to="/login" replace state={{path: location.pathname}}/>;
}

export default RequireAuth;

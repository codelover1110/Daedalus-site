import { userConstants } from "../_constants";
import { userService } from "../../_services";
import { alertActions } from "./";
import { history } from "../_helpers";
import { NotificationManager } from "react-notifications";

export const userActions = {
  login,
  logout,
  register,
  loginSuccess,
};

function loginSuccess(user) {
  return {
    type: userConstants.LOGIN_SUCCESS,
    user,
  };
}

function login(username, password, propshistory) {
  return (dispatch) => {
    dispatch(request({ username }));

    userService.login(username, password).then(
      (user) => {
        dispatch(success(user));
        propshistory.replace("/Home");
      },
      (error) => {
        NotificationManager.error(error.message);
        dispatch(failure(error.message));
        dispatch(alertActions.error(error.message));
      }
    );
  };

  function request(user) {
    return { type: userConstants.LOGIN_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }
}

function logout() {
  return { type: userConstants.LOGOUT };
}

function register(user) {
  return (dispatch) => {
    dispatch(request());
    console.log("firebase persistence", user);
    return userService.register(user).then(
      (user) => {
        NotificationManager.success("Registration successful");
        dispatch(success(user));
        return user;
      },
      (error) => {
        console.log("firebase persistence error", error);
        NotificationManager.error(error.message);
        dispatch(failure(error.message));
        dispatch(alertActions.error(error.message));
      }
    );
  };

  function request() {
    return { type: userConstants.LOGIN_REQUEST };
  }
  function success(user) {
    return { type: userConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }
}

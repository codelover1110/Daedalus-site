import React, { useState } from "react";
import classNames from "classnames";
import { NotificationManager } from "react-notifications";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SectionHeader from "./partials/SectionHeader";
import Input from "../elements/Input";
import Button from "../elements/Button";
import Checkbox from "../elements/Checkbox";
import { useAuth } from "../../contexts/auth_ctx";
import { formatFireError } from "../../firebase";
import { connect } from "react-redux";
import { userActions } from "../../store/_actions";

function LoginForm({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  loginSuccess
}) {
  /** authentification helpers (hook) */
  const { login } = useAuth();

  /** used for internal button state  */
  const [loading, setLoading] = useState(false);

  /** router hook for navigation */
  const navigate = useNavigate();
  const { state } = useLocation();

  const outerClasses = classNames(
    "signin section",
    topOuterDivider && "has-top-divider",
    bottomOuterDivider && "has-bottom-divider",
    hasBgColor && "has-bg-color",
    invertColor && "invert-color",
    className
  );

  const innerClasses = classNames(
    "signin-inner section-inner",
    topDivider && "has-top-divider",
    bottomDivider && "has-bottom-divider"
  );

  const sectionHeader = {
    title: "Welcome back to Daedalus Beta",
  };

  // handle login via firebase
  async function onLogin(e) {
    e.preventDefault();
    setLoading(true);
    let formData = new FormData(e.target);
    try {
      const loginResponse = await login(formData.get("email"), formData.get("password"));
      console.log(loginResponse, 'loginResponse')
      loginSuccess(loginResponse)
      setLoading(false);
      navigate(state ? state.path : "/Home");
    } catch (error) {
      setLoading(false);
      NotificationManager.error(formatFireError(error.code));
    }
  }

  return (
    <section className={outerClasses}>
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader
            tag="h1"
            data={sectionHeader}
            className="center-content"
          />
          <div className="tiles-wrap">
            <div className="tiles-item">
              <div className="tiles-item-inner">
                <form onSubmit={onLogin}>
                  <fieldset>
                    <div className="mb-5">
                      <Input
                        type="email"
                        label="Email"
                        placeholder="Email"
                        labelHidden
                        name="email"
                       
                        required
                      />
                    </div>
                    <div className="mb-5">
                      <Input
                        type="password"
                        label="Password"
                        placeholder="Password"
                        name="password"
                        
                        labelHidden
                        required
                      />
                    </div>

                    <div className="mt-5 mb-5">
                      <Button disabled={loading} color="primary" wide>
                        Sign in
                      </Button>
                    </div>
                    <div className="signin-footer mb-32">
                      <Checkbox>Remember me</Checkbox>
                      <Link
                        to="/recover-password/"
                        className="func-link text-xs"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </fieldset>
                </form>
                <div className="signin-bottom has-top-divider">
                  <div className="pt-5 text-xs center-content text-color-low">
                    Don't have an account?{" "}
                    <Link to="/signup/" className="func-link">
                      Sign up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const actionCreators = {
  loginSuccess: userActions.loginSuccess,
};

export default connect(null, actionCreators)(LoginForm);

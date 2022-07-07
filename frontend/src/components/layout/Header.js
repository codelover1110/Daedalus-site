import React, { useState, useRef } from "react";

import classNames from "classnames";
import { Link, useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { FaCog } from "react-icons/fa";
import Logo from "./partials/Logo";

import Logger from "../../helpers/logger";
import { useAuth } from "../../contexts/auth_ctx";
import { formatFireError } from "../../firebase";
import { connect } from "react-redux";
import { userActions } from "../../store/_actions";

function Header({
  triggerLogoutAction,
  active = false,
  navPosition = "",
  hideNav = false,
  hideSignin = false,
  bottomOuterDivider = false,
  bottomDivider = false,
}) {
  /** user authentification  */
  const { currentUser, loading, logout } = useAuth();
  /** mbile menu activation */
  const [menuActive, setMenuActive] = useState(active);

  /** router hook for navigation */
  const navigate = useNavigate();

  /** Dom references  */
  const nav = useRef(null);
  const hamburger = useRef(null);

  /**
   * close the menu
   *
   * @param {*} event
   */
  function handleMenu(event) {
    if (menuActive) closeMenu();
    else openMenu();
  }

  /**
   * open the mobile menu
   *
   * @param {*} event
   */
  function openMenu(event) {
    document.body.classList.add("off-nav-is-active");
    if (nav.current != null) {
      nav.current.style.maxHeight = nav.current.scrollHeight + "px";
      setMenuActive(true);
    }
  }

  function closeMenu() {
    document.body.classList.remove("off-nav-is-active");
    if (nav.current != null) {
      nav.current.style.maxHeight = null;
      setMenuActive(false);
    }
  }
  async function onLogout() {
    Logger.info("onLogout", "[HEADER]");
    try {
      await logout();
      triggerLogoutAction();
    } catch (error) {
      NotificationManager.error(formatFireError(error.code));
    }
  }

  function renderPublicHeader() {
    return (
      <React.Fragment>
        <button
          ref={hamburger}
          className="header-nav-toggle"
          onClick={handleMenu}
        >
          <span className="screen-reader">Menu</span>
          <span className="hamburger">
            <span className="hamburger-inner"></span>
          </span>
        </button>

        <nav ref={nav} className={classNames("header-nav", "is-active")}>
          <div className="header-nav-inner">
            <ul
              className={classNames(
                "list-reset text-xxs",
                navPosition && `header-nav-${navPosition}`
              )}
            >
              <li>
                <Link
                  to="/login/"
                  onClick={closeMenu}
                  style={{ color: "white" }}
                >
                  Login
                </Link>
              </li>
            </ul>
            <ul className="list-reset header-nav-right">
              <li>
                <Link
                  to="/signup/"
                  className="button button-wide-mobile button-sm"
                  style={{ color: "black" }}
                  onClick={closeMenu}
                >
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </React.Fragment>
    );
  }
  function activateSettings() {
    const element = document.querySelector(".header-nav__menu");
    element.classList.toggle("is-active");
  }
  function renderAuthHeader() {
    return (
      <React.Fragment>
        <button ref={hamburger} className="header-nav-toggle">
          <span className="screen-reader">Menu</span>
          <span className="hamburger">
            <span className="hamburger-inner"></span>
          </span>
        </button>
        <nav ref={nav} className={classNames("header-nav", "is-active")}>
          <div className="header-nav-inner position-relative">
            <ul
              className={classNames(
                "list-reset text-xxs",
                navPosition && `header-nav-${navPosition}`
              )}
            >
              <li className="text-gray-500">
                {currentUser?.displayName}
              </li>
              <li>
                <button
                  href="#"
                  className="pl-5 text-gray-500"
                  onClick={activateSettings}
                >
                  <FaCog />
                </button>
                <div className="header-nav__menu position-absolute z-10 right-0 top-100 mt-1 bg-surface-light rounded-md">
                  <ul className="header-nav__menu__custom position-relative bg-transparent list-none divide-y divide-gray-700">
                    <li className="mb-0 px-4 py-2">
                      <Link
                        to="/Settings"
                        className="text-xs text-capitalize p-0 text-gray-500 hover:text-gray-700"
                      >
                        Settings
                      </Link>
                    </li>
                    <li className="mb-0 px-3 py-2">
                      <span
                        onClick={onLogout}
                        className="text-xs text-capitalize p-0 text-gray-500 cursor-pointer hover:text-gray-700"
                      >
                        Logout
                      </span>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </React.Fragment>
    );
  }

  return (
    <header>
      <div className="container">
        <div
          className={classNames(
            "site-header-inner",
            bottomDivider && "has-bottom-divider"
          )}
        >
          <Logo />
          {currentUser && !loading && renderAuthHeader()}
          {!currentUser && renderPublicHeader()}
        </div>
      </div>
    </header>
  );
}

const actionCreators = {
  triggerLogoutAction: userActions.logout,
};

export default connect(null, actionCreators)(Header);

// class Example extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       authentication: { loggedIn: false, user: null },
//       isActive: false
//     }
//   }

//   nav = React.createRef();
//   hamburger = React.createRef();

//   componentDidMount() {
//     console.log(this.props);
//     this.componentWillReceiveProps(this.props)
//     this.props.active && this.openMenu();
//     document.addEventListener('keydown', this.keyPress);
//     document.addEventListener('click', this.clickOutside);
//   }

//   componentWillReceiveProps(props) {
//     const authentication = { loggedIn: false, user: null }
//     this.setState({ authentication: props.authentication.loggedIn ? props.authentication : authentication })
//   }

//   componentWillUnmount() {
//     document.removeEventListener('keydown', this.keyPress);
//     document.addEventListener('click', this.clickOutside);
//     this.closeMenu();
//   }

//   openMenu = () => {
//     document.body.classList.add('off-nav-is-active');
//     this.nav.current.style.maxHeight = this.nav.current.scrollHeight + 'px';
//     this.setState({ isActive: true });
//   }

//   closeMenu = () => {
//     document.body.classList.remove('off-nav-is-active');
//     this.nav.current && (this.nav.current.style.maxHeight = null);
//     this.setState({ isActive: false });
//   }

//   keyPress = (e) => {
//     this.state.isActive && e.keyCode === 27 && this.closeMenu();
//   }

//   clickOutside = (e) => {
//     if (!this.nav.current) return
//     if (!this.state.isActive || this.nav.current.contains(e.target) || e.target === this.hamburger.current) return;
//     this.closeMenu();
//   }

//   render() {

//     const { authentication } = this.state;
//     const {
//       className,
//       active,
//       navPosition,
//       hideNav,
//       hideSignin,
//       bottomOuterDivider,
//       bottomDivider,
//       ...props
//     } = this.props;

//     console.log(this.props);
//     const classes = classNames('site-header', bottomOuterDivider && 'has-bottom-divider', className);
//     console.log(authentication);

// }

// Header.propTypes = propTypes;
// Header.defaultProps = defaultProps;

// const actionCreators = {
//   logout: userActions.logout,
// };

// const mapStatetoProps = (state) => {
//   return { authentication: state.authentication }
// };
// export default connect(mapStatetoProps, actionCreators)(Header);

import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Logo from "./partials/Logo";
import FooterNav from "./partials/FooterNav";
import FooterSocial from "./partials/FooterSocial";

function Footer(props) {
  const [topOuterDivider, settopOuterDivider] = useState(
    props.topOuterDivider || false
  );
  const [topDivider, settopDivider] = useState(props.topDivider || false);

  const classes = classNames(
    "site-footer center-content-mobile",
    topOuterDivider && "has-top-divider",
    props.className
  );

  return (
    <footer {...props} className={classes}>
      <div className="container">
        <div
          className={classNames(
            "site-footer-inner",
            topDivider && "has-top-divider"
          )}
        >
          <div className="footer-top space-between text-xxs">
            <Logo />
            <div className="footer-bottom space-between text-xxs invert-order-desktop pt-0">
              <FooterNav />
              <div className="footer-copyright text-lg">
                &copy;{" "}
                {`${new Date().getFullYear()} Daedalus, all rights
                reserved`}
              </div>
            </div>
            <FooterSocial />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

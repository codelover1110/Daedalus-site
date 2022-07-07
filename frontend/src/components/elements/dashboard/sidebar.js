/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaHome,
  FaChartPie,
  FaSignOutAlt,
  FaGlassWhiskey,
} from "react-icons/fa";
import { useAuth } from "../../../contexts/auth_ctx";
import { formatFireError } from "../../../firebase";
import { API } from "../../../config";
import { connect } from "react-redux";
import { userActions } from "../../../store/_actions";

function SideBar({ triggerLogoutAction }) {
  const { currentUser, logout } = useAuth();
  const [path, setPath] = useState("");
  const [marketStatus, setMarketStatus] = useState(false);
  /** router hook for navigation */
  const navigate = useNavigate();
  const location = useLocation();

  const _fetchMarketStatus = async () => {
    const { data } = await axios(
      `${API.url}/is-the-market-open?apikey=${API.key}`
    );
    if (data.isTheStockMarketOpen) {
      setMarketStatus(true);
    }
  };

  useEffect(() => {
    setPath(location.pathname);
  });

  async function onLogout() {
    try {
      await logout();
      triggerLogoutAction();
    } catch (error) {
      NotificationManager.error(formatFireError(error.code));
    }
  }

  useEffect(() => {
    if (currentUser != null) {
      _fetchMarketStatus();
    }
  }, [currentUser]);

  return (
    <aside className="dashboard__sidebar flex-col w-20 h-screen bg-surface-light">
      <div className="dashboard__sidebar__header px-4 py-8">
        <div className="dashboard__sidebar__header__circle flex justify-center items-center rounded-full bg-surface">
          <Link to="/">
            <FaChartLine className={`${marketStatus ? "text-blue" : ""}`} />
          </Link>
        </div>
      </div>
      <ul className="dashboard__sidebar__menu mt-20">
        <li
          className={`${
            path === "/Home" ? "bg-surface" : "bg-surface-light"
          }  hover:bg-surface`}
        >
          <Link to="/Home" className="px-4 py-8">
            <FaHome className={`${path === "/Home" ? "text-blue" : ""}`} />
          </Link>
        </li>
        <li
          className={`${
            path === "/Dashboard" ? "bg-surface" : "bg-surface-light"
          }  hover:bg-surface`}
        >
          <Link to="/Dashboard" className="px-4 py-8">
            <FaGlassWhiskey
              className={`${path === "/Home" ? "text-blue" : ""}`}
            />
          </Link>
        </li>
        <li    className={`${
            path === "/MyPortfolio" ? "bg-surface" : "bg-surface-light"
          }  hover:bg-surface`}>
          <Link to="/MyPortfolio" className="px-4 py-8">
            <FaChartPie />
          </Link>
        </li>
        <li className="bg-surface-light hover:bg-surface">
          <Link to="/" onClick={onLogout} className="px-4 py-8">
            <FaSignOutAlt />
          </Link>
        </li>
      </ul>
      {/* <h5 className="panel__status" id="panel__status" ref={status}>
                {" "}
            </h5> */}
    </aside>
  );
}

const actionCreators = {
  triggerLogoutAction: userActions.logout,
};

export default connect(null, actionCreators)(SideBar);

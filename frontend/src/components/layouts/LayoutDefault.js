import React from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { Outlet } from 'react-router-dom'
import { NotificationContainer } from "react-notifications";

const LayoutDefault = () => (
  <React.Fragment>
    <Header navPosition="right" className="reveal-from-top" />
    <NotificationContainer />
    <main className="site-content">
      {/* {<Outlet />} */}
      <Outlet />
    </main>
    <Footer />
  </React.Fragment>
);

export default LayoutDefault;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const HomeContainer = () => {

  return (
    <div className="home-container">
      <Header />
      <div className="main-content">
        <Sidebar  />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HomeContainer;

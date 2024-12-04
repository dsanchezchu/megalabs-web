import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/DashboardPageSidebar';
import ChatbotButton from '../ChatbotButton/ChatbotButton';
import './DashboardStyle.css';
import {useInactivityTimeout} from "../../services/InactivityService";

const DashboardLayout = () => {

    useInactivityTimeout();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-grow p-6 bg-gray-100 overflow-hidden">
        <div className="content-area">
          <Outlet />
        </div>
        <ChatbotButton />
      </div>
    </div>
  );
};

export default DashboardLayout;
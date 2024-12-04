// src/layouts/DashboardLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/DashboardPageSidebar';
import ChatbotButton from '../ChatbotButton/ChatbotButton';
import './DashboardStyle.css'

const DashboardLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-grow p-6 bg-gray-100">
                <Outlet />
                <ChatbotButton />
            </div>
        </div>
    );
};

export default DashboardLayout;
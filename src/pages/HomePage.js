import React from 'react';
import Header from '../components/Header/HomePageHeader';
import Sidebar from '../components/Sidebar/HomePageSidebar';
import Main from '../components/Main/HomePageMain';
import Footer from '../components/Footer/HomePageFooter';

const HomePage = () => {
    return (
        <div className="flex">
            <Header/>
            <div className="flex h-screen">
                <Sidebar/>
                <div className="flex flex-col flex-grow">
                    <Main>
                        <h2 className="text-2xl font-bold mb-6">Welcome to Megalabs Dashboard</h2>
                        <p>This is the main content of the homepage.</p>
                    </Main>
                </div>
            </div>
            </div>
            );
            };

            export default HomePage;
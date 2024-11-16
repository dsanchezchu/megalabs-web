import React from 'react';
import HomePageMain from '../components/Main/HomePageMain';
import Footer from '../components/Footer/PageFooter';

const HomePage = () => {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-grow">
                <div className="flex flex-grow justify-center items-center">
                    <HomePageMain className="w-full h-full" />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;

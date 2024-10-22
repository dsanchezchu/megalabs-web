import React from 'react';

const HomePageMain = ({ children }) => {
    return (
        <main className="flex-grow p-6 bg-gray-100">
            {children}
        </main>
    );
};

export default HomePageMain;

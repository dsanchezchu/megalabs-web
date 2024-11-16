import React from 'react';
import Footer from '../components/Footer/PageFooter';
import ReportsPageMain from '../components/Main/ReportsPageMain';

const AuditReportPage = () => {
    return (
        <div className="flex">
            <div className="flex-1">
                <main className="p-4">
                    <ReportsPageMain />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default AuditReportPage;

import React from 'react';
import Footer from '../components/Footer/PageFooter';
import AuditReport from '../components/Main/AuditReport';

const AuditReportPage = () => {
    return (
        <div className="flex">
            <div className="flex-1">
                <main className="p-4">
                    <AuditReport />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default AuditReportPage;

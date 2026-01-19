import React, { useState } from 'react';
import LiveFeed from './LiveFeed';
import AlertInbox from './AlertInbox';
import Explainability from './Explainability';
import PatternView from './PatternView';
import AutoMLPanel from './AutoMLPanel';
import { useTransactionStream } from '../hooks/useTransactionStream';
import './Dashboard.css';

const Dashboard = ({ theme }) => {
    const { transactions, alerts, stats, isConnected } = useTransactionStream();
    const [selectedAlertId, setSelectedAlertId] = useState(null);

    // Find the full alert object based on ID
    const selectedAlert = alerts.find(a => a.id === selectedAlertId);

    return (
        <div className="dashboard-grid">
            <div className="grid-area-feed">
                <LiveFeed transactions={transactions} isConnected={isConnected} />
            </div>
            <div className="grid-area-alerts">
                <AlertInbox
                    alerts={alerts}
                    onSelectAlert={(a) => setSelectedAlertId(a.id)}
                    selectedAlertId={selectedAlertId}
                />
            </div>
            <div className="grid-area-explain">
                <Explainability selectedTransaction={selectedAlert} />
            </div>
            <div className="grid-area-patterns">
                <PatternView />
            </div>
            <div className="grid-area-automl">
                <AutoMLPanel />
            </div>
        </div>
    );
};

export default Dashboard;

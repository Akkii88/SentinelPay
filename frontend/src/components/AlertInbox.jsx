import React from 'react';
import './AlertInbox.css';

const AlertInbox = ({ alerts, onSelectAlert, selectedAlertId }) => {
    return (
        <div className="card dashboard-card alert-inbox-card">
            <div className="card-header-compact">
                <h2>Fraud Alert Inbox</h2>
                <span className="badge-count">{alerts.length}</span>
            </div>

            <div className="alert-list">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={`alert-item ${selectedAlertId === alert.id ? 'selected' : ''}`}
                        onClick={() => onSelectAlert(alert)}
                    >
                        <div className="alert-header">
                            <span className={`status-badge status-${alert.status.toLowerCase()}`}>
                                {alert.status}
                            </span>
                            <span className="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="alert-body">
                            <div className="alert-amount">${alert.amount.toFixed(2)}</div>
                            <div className="alert-merchant">{alert.merchant}</div>
                        </div>
                        <div className="alert-scenario">
                            {alert.scenario}
                        </div>
                    </div>
                ))}
                {alerts.length === 0 && (
                    <div className="empty-alerts">All Clear. No open alerts.</div>
                )}
            </div>
        </div>
    );
};

export default AlertInbox;

import React from 'react';
import './LiveFeed.css';

const LiveFeed = ({ transactions, isConnected }) => {
    return (
        <div className="card dashboard-card live-feed-card">
            <div className="card-header">
                <h2>Live Transaction Feed</h2>
                <div className="live-indicator">
                    <span className={`status-dot ${isConnected ? 'active' : ''}`}></span>
                    {isConnected ? 'LIVE STREAM' : 'CONNECTING...'}
                </div>
            </div>

            <div className="table-container">
                <table className="txn-table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Risk Score</th>
                            <th>Time</th>
                            <th>Card Number</th>
                            <th>Amount</th>
                            <th>Merchant</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((txn) => (
                            <tr key={txn.id} className={`txn-row status-${txn.status.toLowerCase()}`}>
                                <td>
                                    <span className={`status-badge status-${txn.status.toLowerCase()}`}>
                                        {txn.status}
                                    </span>
                                </td>
                                <td className="risk-cell">
                                    <div className="risk-bar-container">
                                        <div
                                            className="risk-bar"
                                            style={{
                                                width: `${txn.risk_score}%`,
                                                backgroundColor: txn.risk_score > 80 ? 'var(--status-blocked)' : txn.risk_score > 40 ? 'var(--status-flagged)' : 'var(--status-approved)'
                                            }}
                                        />
                                    </div>
                                    <span className="risk-value">{txn.risk_score}</span>
                                </td>
                                <td className="mono">{new Date(txn.timestamp).toLocaleTimeString()}</td>
                                <td className="mono">{txn.card_number}</td>
                                <td className="amount">${txn.amount.toFixed(2)}</td>
                                <td>{txn.merchant}</td>
                                <td className="location">{txn.location}</td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan="7" className="empty-state">Waiting for transactions...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LiveFeed;

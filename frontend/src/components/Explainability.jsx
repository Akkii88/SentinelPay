import React from 'react';
import './Panels.css';

const Explainability = ({ selectedTransaction }) => {
    if (!selectedTransaction) {
        return (
            <div className="card dashboard-card explain-card empty">
                <div className="empty-content">
                    <div className="icon-placeholder">🔍</div>
                    <h3>Select an Alert</h3>
                    <p>Choose a flagged transaction from the inbox to see the AI decision logic.</p>
                </div>
            </div>
        );
    }

    // Mock contributors based on the scenario
    const contributors = [
        { name: 'Location Distance', value: 88, color: 'var(--status-blocked)' },
        { name: 'Transaction Amount', value: selectedTransaction.amount > 1000 ? 75 : 40, color: selectedTransaction.amount > 1000 ? 'var(--status-flagged)' : 'var(--status-approved)' },
        { name: 'Time of Day', value: 30, color: 'var(--status-approved)' },
        { name: 'Device Fingerprint', value: 15, color: 'var(--status-approved)' },
    ].sort((a, b) => b.value - a.value);

    return (
        <div className="card dashboard-card explain-card">
            <h2>Transaction Explainability</h2>

            <div className="explain-content">
                <div className="explain-header">
                    <div className="score-ring-container">
                        <svg viewBox="0 0 36 36" className="circular-chart">
                            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="circle"
                                strokeDasharray={`${selectedTransaction.risk_score}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                stroke={selectedTransaction.risk_score > 80 ? 'var(--status-blocked)' : 'var(--status-flagged)'}
                            />
                        </svg>
                        <div className="score-text">
                            <span className="sc-val">{selectedTransaction.risk_score}</span>
                            <span className="sc-label">RISK</span>
                        </div>
                    </div>

                    <div className="decision-box">
                        <span className="decision-label">MODEL DECISION</span>
                        <h3 className={`decision-val status-${selectedTransaction.status.toLowerCase()}`}>
                            {selectedTransaction.status.toUpperCase()}
                        </h3>
                    </div>
                </div>

                <div className="feature-list">
                    <h4>Top Risk Contributors</h4>
                    {contributors.map((c, i) => (
                        <div key={i} className="feature-row">
                            <span className="fname">{c.name}</span>
                            <div className="fbar-container">
                                <div className="fbar" style={{ width: `${c.value}%`, background: c.color }}></div>
                            </div>
                            <span className="fval">{c.value}%</span>
                        </div>
                    ))}
                </div>

                <div className="nlp-explanation">
                    <h4>AI Reasoning</h4>
                    <p>
                        {selectedTransaction.explanation}
                        The model detected an anomaly in <strong>{selectedTransaction.scenario}</strong> pattern compared to the user's 30-day history.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Explainability;

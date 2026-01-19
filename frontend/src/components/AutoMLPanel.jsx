import React, { useEffect, useState } from 'react';
import './Panels.css';

const AutoMLPanel = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/automl')
            .then(res => res.json())
            .then(setData)
            .catch(err => console.error(err));
    }, []);

    if (!data) return <div className="card dashboard-card"><h2>AutoML Governance</h2><p>Loading...</p></div>;

    return (
        <div className="card dashboard-card automl-card">
            <div className="automl-header">
                <h2>AutoML Governance</h2>
                <span className={`status-badge ${data.status === 'Healthy' ? 'status-approved' : 'status-blocked'}`}>{data.status}</span>
            </div>

            <div className="automl-grid">
                <div className="metric-box">
                    <label>Active Model</label>
                    <div className="val">{data.current_model}</div>
                </div>
                <div className="metric-box">
                    <label>Accuracy</label>
                    <div className="val highlighted">{data.accuracy}%</div>
                </div>
                <div className="metric-box">
                    <label>Drift Status</label>
                    <div className="val">{data.drift_detected ? 'DRIFT DETECTED' : 'Stable'}</div>
                </div>
                <div className="metric-box">
                    <label>Next Retrain</label>
                    <div className="val text-sm">{new Date(data.next_training).toLocaleTimeString()}</div>
                </div>
            </div>

            <div className="mini-timeline">
                <div className="timeline-track">
                    <div className="track-fill" style={{ width: '60%' }}></div>
                </div>
                <span className="timeline-label">Training Cycle Progress</span>
            </div>
        </div>
    );
};

export default AutoMLPanel;

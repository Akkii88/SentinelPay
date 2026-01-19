import React from 'react';
import './Panels.css';

const PatternView = () => {
    // Static mock data for visualization
    const patternData = [20, 45, 30, 80, 55, 90, 40, 60, 35, 25, 45, 30];

    return (
        <div className="card dashboard-card pattern-card">
            <h2>Pattern Intelligence</h2>

            <div className="pattern-content">
                <div className="chart-section">
                    <div className="chart-header">
                        <span>Spending Rhythm (Last 12h)</span>
                        <span className="trend-badge">High Velocity</span>
                    </div>
                    <div className="sparkline-container">
                        {/* Simple SVG Line Chart */}
                        <svg viewBox="0 0 300 60" className="sparkline">
                            <path
                                d={`M0,60 ${patternData.map((d, i) => `L${(i * 25) + 10},${60 - (d * 0.6)}`).join(' ')}`}
                                fill="none"
                                stroke="var(--accent-primary)"
                                strokeWidth="2"
                            />
                            <path
                                d={`M0,60 ${patternData.map((d, i) => `L${(i * 25) + 10},${60 - (d * 0.6)}`).join(' ')} L300,60 Z`}
                                fill="url(#gradient-chart)"
                                opacity="0.2"
                                stroke="none"
                            />
                            <defs>
                                <linearGradient id="gradient-chart" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="var(--accent-primary)" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                <div className="geo-pattern">
                    <h4>Geospatial Novelty</h4>
                    <div className="geo-grid">
                        <div className="geo-item">
                            <span className="label">Home Region</span>
                            <div className="progress"><div style={{ width: '90%' }}></div></div>
                        </div>
                        <div className="geo-item warning">
                            <span className="label">Current (Simulated)</span>
                            <div className="progress"><div style={{ width: '10%' }}></div></div>
                            <span className="flag">NEW</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatternView;

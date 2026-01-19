import React from 'react';
import './Header.css';

const Header = ({ theme, toggleTheme }) => {
    return (
        <header className="app-header">
            <div className="header-brand">
                <div className="logo-icon">🛡️</div>
                <h1>SentinelPay <span className="brand-subtitle">Fraud Ops</span></h1>
            </div>

            <div className="header-actions">
                <div className="system-status">
                    <span className="status-dot"></span>
                    System Operational
                </div>

                <button
                    className="theme-toggle-btn"
                    onClick={toggleTheme}
                    aria-label="Toggle Theme"
                >
                    {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>

                <div className="user-profile">
                    <div className="avatar">AD</div>
                </div>
            </div>
        </header>
    );
};

export default Header;

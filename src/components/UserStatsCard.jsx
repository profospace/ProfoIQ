import React from 'react';

const UserStatsCard = ({ totalUsers, userTrend }) => {
    return (
        <div className="user-stats-card">
            <div className="stats-header">
                <h3>Total Users</h3>
                <div className={`trend-indicator ${userTrend > 0 ? 'positive' : 'negative'}`}>
                    {userTrend > 0 ? '▲' : '▼'} {Math.abs(userTrend)}%
                </div>
            </div>
            <div className="stats-body">
                <h1>{totalUsers}</h1>
            </div>
            <div className="stats-footer">
                <span className="footer-text">Last Updated: {new Date().toLocaleDateString()}</span>
            </div>
        </div>
    );
};

export default UserStatsCard;

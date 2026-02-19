import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

const RecruiterDashboard = () => {
    return (
        <div className="dashboard-container page-transition">
            <h1 className="dashboard-title">Recruiter Dashboard</h1>
            <div className="dashboard-grid">
                <div className="section-card card-interactive">
                    <h2 className="section-title">Create New Job</h2>
                    <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Post a new job opening to find candidates.</p>
                    <Link to="/create-job" className="btn btn-primary">Go to Job Creation</Link>
                </div>
                <div className="section-card card-interactive">
                    <h2 className="section-title">Matching Dashboard</h2>
                    <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>View job matches and rank candidates.</p>
                    <Link to="/matching" className="btn btn-success" style={{ backgroundColor: 'var(--success-color)', color: 'white' }}>View Matches</Link>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;

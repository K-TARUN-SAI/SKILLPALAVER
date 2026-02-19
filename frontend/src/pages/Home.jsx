import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container app-container text-center" style={{ padding: '2.5rem' }}>
            <h1 className="text-4xl font-bold mb-6" style={{ color: 'var(--accent-color)' }}>HireGenius AI</h1>
            <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>Automate your hiring process with AI-powered resume screening, matching, and ranking.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <Link to="/upload" className="card block hover-transform">
                    <h3 className="text-xl font-bold mb-2">Upload Resumes</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Parse PDFs and extract data automatically.</p>
                </Link>
                <Link to="/create-job" className="card block hover-transform">
                    <h3 className="text-xl font-bold mb-2">Create Job</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Define job requirements and skills.</p>
                </Link>
                <Link to="/dashboard" className="card block hover-transform">
                    <h3 className="text-xl font-bold mb-2">Matching Dashboard</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Match candidates and view rankings.</p>
                </Link>
                <Link to="/quiz" className="card block hover-transform">
                    <h3 className="text-xl font-bold mb-2">Take Quiz</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Assess candidate knowledge.</p>
                </Link>
            </div>
        </div>
    );
};

export default Home;

import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

const MatchingDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs');
            setJobs(response.data);
        } catch (error) {
            console.error("Error fetching jobs", error);
        }
    };

    const fetchRankings = async (jobId) => {
        setSelectedJob(jobId);
        try {
            const response = await api.get(`/ranking/${jobId}`);
            setRankings(response.data);
        } catch (error) {
            console.error("Error fetching rankings", error);
        }
    };

    const handleMatch = async (jobId) => {
        setLoading(true);
        try {
            await api.post(`/match/${jobId}`);
            alert("Matching process completed!");
            fetchRankings(jobId);
        } catch (error) {
            console.error("Matching failed", error);
            alert("Matching process failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendQuiz = async (jobId, candidateId) => {
        try {
            await api.post(`/notify-candidate/${jobId}/${candidateId}`);
            alert(`Quiz link sent to candidate ${candidateId}!`);
        } catch (error) {
            console.error("Failed to send email", error);
            alert("Failed to send quiz link.");
        }
    };

    return (
        <div className="dashboard-container page-transition">
            <h2 className="dashboard-title">Matching Dashboard</h2>

            <div className="dashboard-grid">
                <div className="section-card">
                    <h3 className="section-title">Available Jobs</h3>
                    <ul className="job-list">
                        {jobs.map(job => (
                            <li key={job.id} className="job-list-item">
                                <div>
                                    <span style={{ fontWeight: 600 }}>{job.title}</span>
                                </div>
                                <div className="job-actions">
                                    <button
                                        onClick={() => handleMatch(job.id)}
                                        className="btn btn-primary btn-sm"
                                        disabled={loading}
                                    >
                                        Match Candidates
                                    </button>
                                    <button
                                        onClick={() => fetchRankings(job.id)}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        View Rankings
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="section-card">
                    <h3 className="section-title">Rankings {selectedJob && `for Job ID: ${selectedJob}`}</h3>
                    {rankings.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>Select a job and click "View Rankings" to see results.</p>
                    ) : (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Candidate</th>
                                        <th>Match Score</th>
                                        <th>Final Score</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rankings.map((r) => (
                                        <tr key={r.candidate_id}>
                                            <td>{r.rank}</td>
                                            <td>{r.candidate_name}</td>
                                            <td>{r.match_score.toFixed(2)}</td>
                                            <td style={{ fontWeight: 'bold' }}>{r.final_score.toFixed(2)}</td>
                                            <td>
                                                {r.quiz_score > 0 ? (
                                                    <span className="badge badge-success">Quiz Completed ({r.quiz_score.toFixed(0)}%)</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleSendQuiz(selectedJob, r.candidate_id)}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        Send Quiz
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchingDashboard;

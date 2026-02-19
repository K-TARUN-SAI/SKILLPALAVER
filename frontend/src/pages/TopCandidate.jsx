import React, { useState } from 'react';
import api from '../api/axios';

const TopCandidate = () => {
    const [jobId, setJobId] = useState('');
    const [candidate, setCandidate] = useState(null);
    const [error, setError] = useState('');

    const fetchTopCandidate = async () => {
        try {
            const response = await api.get(`/top-candidate/${jobId}`);
            setCandidate(response.data);
            setError('');
        } catch (err) {
            console.error(err);
            setError('No candidate found or invalid Job ID.');
            setCandidate(null);
        }
    };

    return (
        <div className="container app-container">
            <h2 className="text-2xl font-bold mb-4">Top Candidate</h2>
            <div className="flex gap-md mb-6">
                <input
                    type="number"
                    placeholder="Enter Job ID"
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                    className="input"
                    style={{ marginBottom: 0, width: 'auto' }}
                />
                <button
                    onClick={fetchTopCandidate}
                    className="btn btn-primary"
                >
                    Find Top Candidate
                </button>
            </div>

            {error && <p className="text-danger">{error}</p>}

            {candidate && (
                <div className="card border-l-4" style={{ borderLeftColor: 'var(--accent-color)' }}>
                    <h3 className="text-2xl font-bold mb-2">{candidate.candidate_name}</h3>
                    <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <p className="text-secondary">Match Score</p>
                            <p className="text-xl font-semibold">{candidate.match_score.toFixed(1)}</p>
                        </div>
                        <div>
                            <p className="text-secondary">Quiz Score</p>
                            <p className="text-xl font-semibold">{candidate.quiz_score.toFixed(1)}</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                        <p className="text-secondary">Final Score</p>
                        <p className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>{candidate.final_score.toFixed(1)}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopCandidate;

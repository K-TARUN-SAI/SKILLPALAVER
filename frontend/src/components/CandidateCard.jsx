import React from 'react';
import '../styles/candidate-card.css';

const CandidateCard = () => {
    const candidates = [
        { id: 1, name: 'A. Patel', role: 'Senior React Dev', score: 92 },
        { id: 2, name: 'S. Kim', role: 'Frontend Engineer', score: 88 },
        { id: 3, name: 'J. Rivera', role: 'Full Stack Dev', score: 84 },
    ];

    return (
        <div className="ranking-card">
            <div className="ranking-header">
                <div>
                    <h3>Top Matches</h3>
                    <p className="ranking-subtitle">Real-time candidate scoring</p>
                </div>
                <div className="status-badge">Live</div>
            </div>

            <div className="candidate-list">
                {candidates.map((candidate, index) => (
                    <div key={candidate.id} className="candidate-item">
                        <div className="rank-circle">{index + 1}</div>
                        <div className="candidate-info">
                            <h4>{candidate.name}</h4>
                            <p>{candidate.role}</p>
                        </div>
                        <div className="candidate-score">
                            <span className="score-label">Fit</span>
                            <span className="score-value">{candidate.score}%</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Visual elements */}
            <div className="card-decoration"></div>
        </div>
    );
};

export default CandidateCard;

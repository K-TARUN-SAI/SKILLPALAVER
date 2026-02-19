import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Quiz = () => {
    const { jobId: paramJobId } = useParams();
    const [searchParams] = useSearchParams();
    const paramCandidateId = searchParams.get('candidate_id');
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [jobId, setJobId] = useState(paramJobId || '');
    const [candidateId, setCandidateId] = useState(paramCandidateId || '');
    const [quizStarted, setQuizStarted] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [finalScore, setFinalScore] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (paramJobId && paramCandidateId) {
            setJobId(paramJobId);
            setCandidateId(paramCandidateId);
            startQuiz(paramJobId);
        }
    }, [paramJobId, paramCandidateId]);

    const startQuiz = async (id = jobId) => {
        if (!user) {
            alert("You must be logged in to take the quiz.");
            navigate('/login');
            return;
        }
        setLoading(true);
        try {
            const response = await api.get(`/quiz/${id}`);
            let quizData = response.data;

            // Handle different potential response formats
            if (typeof quizData === 'string') {
                try {
                    quizData = JSON.parse(quizData);
                } catch (e) {
                    console.error("Failed to parse quiz data string", e);
                    quizData = [];
                }
            }

            if (!Array.isArray(quizData)) {
                // Check if it's wrapped in an object like { questions: [...] }
                if (quizData.questions && Array.isArray(quizData.questions)) {
                    quizData = quizData.questions;
                } else {
                    console.error("Quiz data is not an array:", quizData);
                    quizData = [];
                }
            }

            setQuestions(quizData);
            setQuizStarted(true);
        } catch (error) {
            console.error("Failed to start quiz", error);
            alert("Quiz not found or failed to load. Make sure the Job ID is correct and a quiz has been generated for it.");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionIndex, option) => {
        setAnswers({ ...answers, [questionIndex]: option });
    };

    const submitQuiz = async () => {
        if (!user) {
            alert("Session expired. Please login again.");
            navigate('/login');
            return;
        }

        setLoading(true);
        const answerList = questions.map((_, index) => answers[index] || "");

        try {
            const response = await api.post('/submit-quiz', {
                job_id: parseInt(jobId),
                candidate_id: parseInt(candidateId),
                answers: answerList
            });
            setScore(response.data.score);
            setFinalScore(response.data.score); // Assuming response.data.final_score was the intent but backend helper uses score
            // Wait, backend logic:
            // final_score = scoring.calculate_final_score(match_score, score)
            // It returns {"score": score, "final_score": final_score}
            if (response.data.final_score !== undefined) {
                setFinalScore(response.data.final_score);
            }
        } catch (error) {
            console.error("Failed to submit quiz", error);
            if (error.response && error.response.status === 401) {
                alert("You are not authorized. Please login again.");
                logout();
                navigate('/login');
            } else {
                alert("Failed to submit quiz. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container app-container">
            <h2 className="text-2xl font-bold mb-4 text-center">Candidate Quiz</h2>

            {!quizStarted && !loading && (
                <div className="card max-w-md mx-auto">
                    {!paramJobId && (
                        <>
                            <div className="mb-4">
                                <label className="label">Job ID</label>
                                <input
                                    type="number"
                                    value={jobId}
                                    onChange={(e) => setJobId(e.target.value)}
                                    className="input"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="label">Candidate ID</label>
                                <input
                                    type="number"
                                    value={candidateId}
                                    onChange={(e) => setCandidateId(e.target.value)}
                                    className="input"
                                />
                            </div>
                            <button
                                onClick={() => startQuiz()}
                                disabled={loading || !jobId || !candidateId}
                                className="btn btn-primary w-full"
                            >
                                Start Quiz
                            </button>
                        </>
                    )}
                    {paramJobId && (
                        <div className="text-center">
                            <p>Loading Quiz...</p>
                        </div>
                    )}
                </div>
            )}

            {quizStarted && !score && (
                <div className="card">
                    {questions.map((q, index) => (
                        <div key={index} className="mb-6">
                            <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
                            <div className="space-y-2">
                                {q.options.map((opt, i) => (
                                    <label key={i} className="block flex items-center" style={{ marginBottom: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={opt}
                                            onChange={() => handleAnswerChange(index, opt)}
                                            style={{ marginRight: '0.5rem' }}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={submitQuiz}
                        disabled={loading}
                        className="btn btn-applied"
                    >
                        {loading ? 'Submitting...' : 'Submit Answers'}
                    </button>
                </div>
            )}

            {score !== null && (
                <div className="card text-center">
                    <h3 className="text-2xl font-bold" style={{ color: 'var(--secondary-color)' }}>Quiz Completed!</h3>
                    <p className="text-xl mt-4">Your Score: <span className="font-bold">{score.toFixed(1)}%</span></p>
                    {finalScore !== null && <p className="text-xl">Final Weighted Score: <span className="font-bold">{finalScore.toFixed(1)}</span></p>}
                    <button onClick={() => navigate('/dashboard')} className="btn btn-primary mt-6">
                        Return to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;

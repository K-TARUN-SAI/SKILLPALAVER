import { Link, useNavigate } from 'react-router-dom';
import CandidateCard from '../components/CandidateCard';
import { useAuth } from '../context/AuthContext';
import '../styles/landing.css';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleStart = () => {
        if (user) {
            if (user.role === 'recruiter') {
                navigate('/recruiter-dashboard');
            } else if (user.role === 'candidate') {
                navigate('/candidate-dashboard');
            }
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="landing-page page-transition">
            <div className="container landing-content">
                <div className="landing-text">
                    <div className="badge-new">
                        <span className="badge-dot"></span>
                        v2.0 Now Available
                    </div>

                    <h1 className="hero-title">
                        HireGenius AI matches<br />
                        <span className="text-gradient">talent to opportunity</span><br />
                        with precision.
                    </h1>

                    <p className="hero-description">
                        Move beyond simple keyword matching. HireGenius AI uses advanced contextual analysis to understand
                        the <strong>depth of skills</strong> and project experience, giving you a ranked shortlist of candidates
                        who truly fit the role.
                    </p>

                    <div className="hero-actions">
                        <button onClick={handleStart} className="btn btn-primary btn-lg">
                            {user ? 'Go to Dashboard' : 'Start Matching Free'}
                        </button>
                        <Link to="/" className="btn btn-secondary btn-lg">View Demo</Link>
                    </div>

                    <div className="trust-badges">
                        <span>Trusted by hiring teams at innovative startups</span>
                    </div>
                </div>

                <div className="landing-visual">
                    <div className="visual-glow"></div>
                    <CandidateCard />
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

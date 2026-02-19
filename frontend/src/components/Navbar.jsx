import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="nav-logo">
                    <div className="logo-icon">
                        {/* Diamond shape for SkillParveer */}
                        <div className="logo-diamond"></div>
                    </div>
                    HireGenius AI
                </Link>
                <div className="nav-links">
                    {!user ? (
                        <>
                            <Link to="/" className="nav-link">Product</Link>
                            <Link to="/" className="nav-link">Solutions</Link>
                            <Link to="/" className="nav-link">Pricing</Link>
                            <Link to="/login" className="btn btn-secondary btn-login">Log In</Link>
                        </>
                    ) : (
                        <>
                            {user.role === 'recruiter' && (
                                <>
                                    <Link to="/recruiter-dashboard" className="nav-link">Dashboard</Link>
                                    <Link to="/create-job" className="nav-link">Create Job</Link>
                                    <Link to="/matching" className="nav-link">Matching</Link>
                                </>
                            )}
                            {user.role === 'candidate' && (
                                <>
                                    <Link to="/candidate-dashboard" className="nav-link">Dashboard</Link>
                                </>
                            )}
                            <button onClick={handleLogout} className="btn btn-danger btn-sm">Log Out</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'candidate'
    });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                const response = await api.post('/auth/login', {
                    username: formData.email,
                    password: formData.password
                }, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });

                login(response.data.access_token, response.data.role, response.data.user_id);
                navigate(response.data.role === 'recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard');
            } else {
                const response = await api.post('/auth/register', {
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    role: formData.role
                });
                login(response.data.access_token, response.data.role, response.data.user_id);
                navigate(response.data.role === 'recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred');
        }
    };

    return (
        <div className="auth-container page-transition">
            <div className="auth-card">
                <h2 className="auth-title">{isLogin ? 'Login' : 'Register'}</h2>
                {error && <p className="auth-error">{error}</p>}
                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label className="label">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input"
                                required={!isLogin}
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label className="label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <label className="label">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="candidate">Job Seeker</option>
                                <option value="recruiter">Recruiter</option>
                            </select>
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary btn-block">
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>
                <div className="auth-footer">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="auth-switch-btn"
                    >
                        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;

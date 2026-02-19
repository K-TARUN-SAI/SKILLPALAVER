import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/dashboard.css';

const JobCreation = () => {
    const [jobData, setJobData] = useState({
        title: '',
        description: '',
        requirements: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/create-job', jobData);
            alert('Job created successfully!');
            navigate('/recruiter-dashboard');
        } catch (error) {
            console.error("Error creating job", error);
            alert("Failed to create job.");
        }
    };

    return (
        <div className="dashboard-container page-transition">
            <h1 className="dashboard-title">Create New Job</h1>
            <div className="section-card" style={{ maxWidth: '800px' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Job Title</label>
                        <input
                            type="text"
                            name="title"
                            value={jobData.title}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Description</label>
                        <textarea
                            name="description"
                            value={jobData.description}
                            onChange={handleChange}
                            className="input"
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Requirements</label>
                        <textarea
                            name="requirements"
                            value={jobData.requirements}
                            onChange={handleChange}
                            className="input"
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Post Job
                    </button>
                </form>
            </div>
        </div>
    );
};

export default JobCreation;

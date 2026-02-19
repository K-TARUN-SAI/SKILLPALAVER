import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import DragDropUpload from '../components/DragDropUpload';
import '../styles/dashboard.css';

const CandidateDashboard = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs/candidate-view');
            setJobs(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch jobs", err);
            setError("Failed to load jobs. Please try again later.");
            setLoading(false);
        }
    };

    const openApplyModal = (jobId) => {
        setSelectedJobId(jobId);
        setResumeFile(null);
        setShowModal(true);
    };

    const closeApplyModal = () => {
        setShowModal(false);
        setSelectedJobId(null);
        setResumeFile(null);
    };

    const handleUploadSuccess = (data) => {
        alert("Resume uploaded successfully!");
        // Optionally refresh jobs to update match scores if they depend on the resume
        fetchJobs();
    };

    const handleApplySubmit = async () => {
        if (!resumeFile) {
            alert("Please upload a resume to apply.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('file', resumeFile);

        try {
            await api.post(`/apply/${selectedJobId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Application submitted successfully!');
            // Update local state to show Applied
            setJobs(jobs.map(job =>
                job.id === selectedJobId ? { ...job, has_applied: true } : job
            ));
            closeApplyModal();
        } catch (error) {
            console.error("Application failed", error);
            alert(error.response?.data?.detail || "Failed to apply");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="dashboard-container page-transition">
            <h1 className="dashboard-title">Candidate Dashboard</h1>

            {/* Resume Upload Section - Optional Global Update */}
            <div style={{ marginBottom: '2rem' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Update your default profile resume here, or upload a specific one when applying below.
                </p>
                <DragDropUpload onUploadSuccess={handleUploadSuccess} />
            </div>

            <div className="section-card">
                <h2 className="section-title">Recommended Jobs</h2>
                <div className="job-list">
                    {loading ? (
                        <p style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading jobs...</p>
                    ) : error ? (
                        <p className="error-text" style={{ padding: '1rem', textAlign: 'center' }}>{error}</p>
                    ) : jobs.length === 0 ? (
                        <p style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No jobs found.</p>
                    ) : (
                        jobs.map(job => (
                            <div key={job.id} className="job-list-item">
                                <div>
                                    <h3 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{job.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{job.company || 'Company Confidential'}</p>
                                </div>
                                <div className="job-actions">
                                    {job.match_score !== undefined && (
                                        <span className="btn btn-secondary btn-sm" style={{ color: 'var(--accent-color)', background: 'rgba(6,182,212,0.1)', border: 'none' }}>
                                            {job.match_score}% Match
                                        </span>
                                    )}
                                    {job.has_applied ? (
                                        <button className="btn btn-applied btn-sm" disabled>Applied ✓</button>
                                    ) : (
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => openApplyModal(job.id)}
                                        >
                                            Apply
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Apply Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Apply for Job</h3>
                        <p>Upload your resume for this application.</p>

                        <DragDropUpload
                            onFileSelect={(file) => setResumeFile(file)}
                            hideUploadButton={true}
                        />

                        <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                className="btn btn-text error-text"
                                onClick={closeApplyModal}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleApplySubmit}
                                disabled={isSubmitting || !resumeFile}
                            >
                                {isSubmitting ? 'Applying...' : 'Submit Application'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CandidateDashboard;

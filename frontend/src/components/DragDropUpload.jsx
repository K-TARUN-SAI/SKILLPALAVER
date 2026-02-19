import React, { useState, useRef } from 'react';
import api from '../api/axios';
import '../styles/dashboard.css';

const DragDropUpload = ({ onUploadSuccess, onFileSelect, hideUploadButton = false }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };



    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/upload-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (onUploadSuccess) onUploadSuccess(response.data);
            setFile(null); // Reset after success
        } catch (err) {
            console.error("Upload failed", err);
            setError('Failed to upload. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const validateAndSetFile = (selectedFile) => {
        if (selectedFile.type !== 'application/pdf') {
            setError('Please upload a PDF file.');
            return;
        }
        setFile(selectedFile);
        setError('');
        if (onFileSelect) {
            onFileSelect(selectedFile);
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    return (
        <div className="section-card">
            <h3 className="section-title">Upload Resume</h3>
            <div
                className={`drag-drop-zone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="file-input-hidden"
                    accept=".pdf"
                    onChange={handleChange}
                />

                {!file ? (
                    <div className="drag-placeholder">
                        <div className="upload-icon">📄</div>
                        <p>Drag & Drop your PDF resume here</p>
                        <span className="divider-text">or</span>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={onButtonClick}>
                            Browse Files
                        </button>
                    </div>
                ) : (
                    <div className="file-preview">
                        <div className="file-info">
                            <span className="file-icon">📎</span>
                            <span className="file-name">{file.name}</span>
                        </div>
                        <div className="file-actions">
                            {!hideUploadButton && (
                                <button
                                    onClick={handleUpload}
                                    className="btn btn-primary"
                                    disabled={uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Upload Now'}
                                </button>
                            )}
                            <button
                                onClick={() => setFile(null)}
                                className="btn btn-text text-danger"
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {error && <p className="error-text mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default DragDropUpload;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Auth from './pages/Auth';
import JobCreation from './pages/JobCreation';
import MatchingDashboard from './pages/MatchingDashboard';
import Quiz from './pages/Quiz';
import TopCandidate from './pages/TopCandidate';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />

            {/* Root shows Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Recruiter Routes */}
            <Route
              path="/recruiter-dashboard"
              element={
                <PrivateRoute roles={['recruiter']}>
                  <RecruiterDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-job"
              element={
                <PrivateRoute roles={['recruiter']}>
                  <JobCreation />
                </PrivateRoute>
              }
            />
            <Route
              path="/matching"
              element={
                <PrivateRoute roles={['recruiter']}>
                  <MatchingDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/top-candidate/:jobId"
              element={
                <PrivateRoute roles={['recruiter']}>
                  <TopCandidate />
                </PrivateRoute>
              }
            />

            {/* Candidate Routes */}
            <Route
              path="/candidate-dashboard"
              element={
                <PrivateRoute roles={['candidate']}>
                  <CandidateDashboard />
                </PrivateRoute>
              }
            />

            {/* Shared/Special Routes */}
            {/* Quiz might be accessed with token or via unique link - for now keeping it protected generally or we need a public wrapper if accessing via email link without login */}
            <Route path="/quiz/:jobId" element={<Quiz />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider >
  );
}

export default App;

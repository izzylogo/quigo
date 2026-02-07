import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import SchoolPortal from './pages/SchoolPortal';
import StudentPortal from './pages/StudentPortal';
import IndividualPortal from './pages/IndividualPortal';
import { useAuthPopup } from './components/AuthPopup';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('quigo_token');
  if (!token || token === 'undefined' || token === 'null') {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const { AuthPopupComponent } = useAuthPopup();

  return (
    <>
      <AuthPopupComponent />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* School Portal */}
        <Route path="/school" element={<ProtectedRoute><Navigate to="/school/classrooms" /></ProtectedRoute>} />
        <Route path="/school/classrooms" element={<ProtectedRoute><SchoolPortal tab="classrooms" /></ProtectedRoute>} />
        <Route path="/school/students" element={<ProtectedRoute><SchoolPortal tab="students" /></ProtectedRoute>} />
        <Route path="/school/analytics" element={<ProtectedRoute><SchoolPortal tab="analytics" /></ProtectedRoute>} />
        <Route path="/school/settings" element={<ProtectedRoute><SchoolPortal tab="settings" /></ProtectedRoute>} />

        {/* Student Portal */}
        <Route path="/student" element={<ProtectedRoute><Navigate to="/student/assessments" /></ProtectedRoute>} />
        <Route path="/student/assessments" element={<ProtectedRoute><StudentPortal tab="assessments" /></ProtectedRoute>} />
        <Route path="/student/history" element={<ProtectedRoute><StudentPortal tab="history" /></ProtectedRoute>} />
        <Route path="/student/analysis" element={<ProtectedRoute><StudentPortal tab="analysis" /></ProtectedRoute>} />
        <Route path="/student/settings" element={<ProtectedRoute><StudentPortal tab="settings" /></ProtectedRoute>} />

        {/* Individual Portal */}
        <Route path="/individual" element={<ProtectedRoute><Navigate to="/individual/dashboard" /></ProtectedRoute>} />
        <Route path="/individual/dashboard" element={<ProtectedRoute><IndividualPortal tab="dashboard" /></ProtectedRoute>} />
        <Route path="/individual/generate" element={<ProtectedRoute><IndividualPortal tab="generate" /></ProtectedRoute>} />
        <Route path="/individual/history" element={<ProtectedRoute><IndividualPortal tab="history" /></ProtectedRoute>} />
        <Route path="/individual/settings" element={<ProtectedRoute><IndividualPortal tab="settings" /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;

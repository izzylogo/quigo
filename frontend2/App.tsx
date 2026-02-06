import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import SchoolPortal from './pages/SchoolPortal';
import StudentPortal from './pages/StudentPortal';
import IndividualPortal from './pages/IndividualPortal';
import { useAuthPopup } from './components/AuthPopup';

const App: React.FC = () => {
  const { AuthPopupComponent } = useAuthPopup();

  return (
    <>
      <AuthPopupComponent />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* School Portal */}
        <Route path="/school" element={<Navigate to="/school/classrooms" />} />
        <Route path="/school/classrooms" element={<SchoolPortal tab="classrooms" />} />
        <Route path="/school/students" element={<SchoolPortal tab="students" />} />
        <Route path="/school/analytics" element={<SchoolPortal tab="analytics" />} />
        <Route path="/school/settings" element={<SchoolPortal tab="settings" />} />

        {/* Student Portal */}
        <Route path="/student" element={<Navigate to="/student/assessments" />} />
        <Route path="/student/assessments" element={<StudentPortal tab="assessments" />} />
        <Route path="/student/history" element={<StudentPortal tab="history" />} />
        <Route path="/student/analysis" element={<StudentPortal tab="analysis" />} />
        <Route path="/student/settings" element={<StudentPortal tab="settings" />} />

        {/* Individual Portal */}
        <Route path="/individual" element={<Navigate to="/individual/dashboard" />} />
        <Route path="/individual/dashboard" element={<IndividualPortal tab="dashboard" />} />
        <Route path="/individual/generate" element={<IndividualPortal tab="generate" />} />
        <Route path="/individual/history" element={<IndividualPortal tab="history" />} />
        <Route path="/individual/settings" element={<IndividualPortal tab="settings" />} />
      </Routes>
    </>
  );
};

export default App;

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import Loading from './components/Loading';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './pages/DashboardLayout';

// Shared Pages
import TriagePage from './pages/TriagePage';
import RecordsPage from './pages/RecordsPage';
import ProfilePage from './pages/ProfilePage';

// Doctor-Specific Pages
import DoctorTriageReview from './pages/DoctorTriageReview';
import PatientsPage from './pages/PatientsPage';

// Role-Based Wrapper Components
import RoleDashboard from './pages/RoleDashboard';
import RoleAppointments from './pages/RoleAppointments';
import RoleTriagePage from './pages/RoleTriagePage';

function App() {
  const { user, initAuth, loading } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />

        {/* Protected Routes - Role-Based Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RoleDashboard />} />
          <Route path="triage" element={<TriagePage />} />
          <Route path="appointments" element={<RoleAppointments />} />
          <Route path="records" element={<RecordsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
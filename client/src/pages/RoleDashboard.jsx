import React from 'react';
import useAuthStore from '../store/authStore';
import Dashboard from './Dashboard';
import DoctorDashboard from './DoctorDashboard';

const RoleDashboard = () => {
  const { user } = useAuthStore();

  if (user?.role === 'doctor') {
    return <DoctorDashboard />;
  }

  // Default to patient dashboard
  return <Dashboard />;
};

export default RoleDashboard;
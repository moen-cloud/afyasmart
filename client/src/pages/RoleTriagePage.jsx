import React from 'react';
import useAuthStore from '../store/authStore';
import TriagePage from './TriagePage';
import DoctorTriageReview from './DoctorTriageReview';

const RoleTriagePage = () => {
  const { user } = useAuthStore();

  if (user?.role === 'doctor') {
    return <DoctorTriageReview />;
  }

  // Default to patient triage (health check)
  return <TriagePage />;
};

export default RoleTriagePage;
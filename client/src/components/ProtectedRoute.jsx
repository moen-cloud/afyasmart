import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified and user's role is not in the list
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === 'patient') {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === 'doctor') {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    // Fallback
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'user' | 'employer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredUserType }) => {
  const location = useLocation();
  const { isAuthenticated, userType } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    // Redirect to login while saving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    // Redirect to jobs page if user type doesn't match required type
    return <Navigate to="/jobs" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 
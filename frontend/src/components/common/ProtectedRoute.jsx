import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('userData');

      if (!token || !userData) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Verify token with backend
      const response = await fetch('http://localhost:3500/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const user = JSON.parse(userData);
        setIsAuthenticated(true);
        setUserRole(user.userRole);
      } else {
        // Token is invalid, clear storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userData');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-red-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'Admin':
        return <Navigate to="/admindash" replace />;
      case 'Trainer':
        return <Navigate to="/trainerdash" replace />;
      case 'Member':
        return <Navigate to="/userdash" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 
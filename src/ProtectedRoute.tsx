// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const loggedIn = window.localStorage.getItem("loggedIn");

  return loggedIn ? element : <Navigate to="/shop/login" />;
};

export default ProtectedRoute;

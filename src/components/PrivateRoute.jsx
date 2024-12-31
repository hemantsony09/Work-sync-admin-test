import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute component to restrict access to authenticated users.
 * @param {Object} props - Component props.
 * @param {React.Component} props.element - The component to render if the user is authenticated.
 * @returns {React.Component} - The element if authenticated, otherwise a redirect to login.
 */
const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  // If token or email is missing, redirect to login
  return token && email ? element : <Navigate to="/admin/login" />;
};

export default PrivateRoute;

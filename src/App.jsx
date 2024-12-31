import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar'; 
import EmployeeDetails from './pages/EmployeeDetail';
import SubAdminDetails from './pages/SubAdminDetail';
import Ticket from './pages/Ticket';
import Task from './pages/Task';
import Meeting from './pages/Meeting';
import Login from './pages/Login';
import LeavePage from './pages/EmployeeDetails/LeavePage';
import Register from './pages/Register';
import AttendancePage from './pages/EmployeeDetails/AttendancePage';
import TaskPage from './pages/EmployeeDetails/TaskPage';
import SubAdminAttendance from './pages/SubAdminDetails/SubAdminAttendance';
import SubAdminLeave from './pages/SubAdminDetails/SubAdminLeave';
import AnnouncementForm from './pages/AnnouncementForm';
import LeaveRequest from './pages/LeaveRequest';
import NotFound from './pages/NotFound'; 

// PrivateRoute component for protecting routes
const PrivateRoute = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem('token')); // Use your authentication logic
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

// ErrorBoundary to catch runtime errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Main AppContent component
const AppContent = () => {
  const location = useLocation();

  // Paths where the sidebar should not be displayed
  const noSidebarPaths = ['/admin/login', '/admin/register'];
  const showSidebar = !noSidebarPaths.includes(location.pathname);

  console.log('Rendering AppContent with path:', location.pathname);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      {showSidebar && (
        <Box
          sx={{
            width: '250px',
            position: 'fixed',
            height: '100vh',
            backgroundColor: '#0D1B2A',
            color: '#fff',
          }}
        >
          <Sidebar />
        </Box>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: showSidebar ? '250px' : '0',
          height: '100vh',
          overflowY: 'auto',
          backgroundColor: '#f5f5f5',
          padding: 2,
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<Register />} />

          {/* Private Routes */}
          <Route
            path="/admin/employee-details"
            element={<PrivateRoute><EmployeeDetails /></PrivateRoute>}
          />
          <Route
            path="/admin/employee/:id/leave"
            element={<PrivateRoute><LeavePage /></PrivateRoute>}
          />
          <Route
            path="/admin/employee/:id/task"
            element={<PrivateRoute><TaskPage /></PrivateRoute>}
          />
          <Route
            path="/admin/employee/:id/attendance"
            element={<PrivateRoute><AttendancePage /></PrivateRoute>}
          />
          <Route
            path="/admin/subadmin-details"
            element={<PrivateRoute><SubAdminDetails /></PrivateRoute>}
          />
          <Route
            path="/subadmin/:id/leave"
            element={<PrivateRoute><SubAdminLeave /></PrivateRoute>}
          />
          <Route
            path="/subadmin/:email/attendance"
            element={<PrivateRoute><SubAdminAttendance /></PrivateRoute>}
          />
          <Route
            path="/admin/meetings"
            element={<PrivateRoute><Meeting /></PrivateRoute>}
          />
          <Route
            path="/admin/tasks"
            element={<PrivateRoute><Task /></PrivateRoute>}
          />
          <Route
            path="/admin/tickets"
            element={<PrivateRoute><Ticket /></PrivateRoute>}
          />
          <Route
            path="/admin/announcement"
            element={<PrivateRoute><AnnouncementForm /></PrivateRoute>}
          />
          <Route
            path="/admin/leave-request"
            element={<PrivateRoute><LeaveRequest /></PrivateRoute>}
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  );
};

// Main App component
const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Router>
  );
};

export default App;

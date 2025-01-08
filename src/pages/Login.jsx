import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Modal,
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/login',
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);

        setSuccess('Login successful! Redirecting...');
        setOpenSuccessSnackbar(true);

        setTimeout(() => {
          window.location.href = '/admin/employee-details';
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Login failed. Please try again.'
      );
      setOpenErrorSnackbar(true);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(
        'https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/forgot-password',
        {
          email: resetEmail,
        }
      );

      if (response.status === 200) {
        setSuccess('Password reset link sent to your email!');
        setOpenSuccessSnackbar(true);
        setIsForgotPasswordOpen(false);
      }
    } catch (err) {
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Failed to send reset link. Please try again.'
      );
      setOpenErrorSnackbar(true);
    }
  };

  const handleCloseErrorSnackbar = () => {
    setOpenErrorSnackbar(false);
  };

  const handleCloseSuccessSnackbar = () => {
    setOpenSuccessSnackbar(false);
  };

  const handleOpenForgotPassword = () => {
    navigate('/admin/login/forgot'); // Redirect to /admin/login/forgot
  };

  const handleCloseForgotPassword = () => {
    setIsForgotPasswordOpen(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 400,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" color="#383574" style={{ fontWeight: 'bold' }} gutterBottom>
          Work Sync
        </Typography>
        <Typography variant="h4" gutterBottom>
          Admin Login
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Login
          </Button>
        </form>

        {/* Forgot Password Button */}
        <Button
          variant="text"
          color="primary"
          onClick={handleOpenForgotPassword} // This will now redirect to /admin/login/forgot
          sx={{ marginTop: 2 }}
        >
          Forgot Password?
        </Button>
      </Paper>

      {/* Forgot Password Modal */}
      <Modal
        open={isForgotPasswordOpen}
        onClose={handleCloseForgotPassword}
        aria-labelledby="forgot-password-modal"
        aria-describedby="forgot-password-description"
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: 400,
            margin: 'auto',
            marginTop: '10%',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Reset Password
          </Typography>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={handleForgotPassword}
          >
            Send Reset Link
          </Button>
        </Paper>
      </Modal>

      {/* Error Snackbar */}
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseErrorSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSuccessSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSuccessSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;

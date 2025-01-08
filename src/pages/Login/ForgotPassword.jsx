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
} from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false); // Tracks whether OTP is sent or not

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        'https://your-api-url.com/forgot-password',
        { email }
      );

      if (response.status === 200) {
        setSuccess('OTP sent to your email!');
        setOpenSuccessSnackbar(true);
        setIsOtpSent(true); // OTP is sent, show the OTP input and password reset form
      }
    } catch (err) {
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Failed to send OTP. Please try again.'
      );
      setOpenErrorSnackbar(true);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(
        'https://your-api-url.com/reset-password',
        { email, otp, newPassword }
      );

      if (response.status === 200) {
        setSuccess('Password successfully reset!');
        setOpenSuccessSnackbar(true);
        setTimeout(() => {
          window.location.href = '/login'; // Redirect to login page
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Failed to reset password. Please try again.'
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
          Work Sync - Forgot Password
        </Typography>

        {/* Conditional Rendering based on isOtpSent */}
        {!isOtpSent ? (
          // Email Input - If OTP is not sent yet
          <div>
            <Typography variant="h6" gutterBottom>
              Enter your email to receive an OTP
            </Typography>
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
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
              onClick={handleSendOtp}
            >
              Send OTP
            </Button>
          </div>
        ) : (
          // OTP and New Password Input - If OTP is sent
          <div>
            <Typography variant="h6" gutterBottom>
              Enter the OTP sent to your email
            </Typography>
            <TextField
              label="OTP"
              type="text"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
              Enter your new password
            </Typography>
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
          </div>
        )}
      </Paper>

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

export default ForgotPassword;

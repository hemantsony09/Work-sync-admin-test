import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Paper, Snackbar, Alert } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);

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

      // Handle successful login
      if (response.status === 200) {
        const { token } = response.data;

        // Store token and email in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);

        // Show success snackbar
        setSuccess('Login successful! Redirecting...');
        setOpenSuccessSnackbar(true);

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = '/admin/employee-details'; // Replace with your redirect path
        }, 2000);
      }
    } catch (err) {
      // Handle errors
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Login failed. Please try again.'
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
        <Typography variant="h4" color='#383574' style={{fontWeight:'bold'}} gutterBottom>
        Work Sync 
        </Typography>
        <Typography variant="h4" gutterBottom>
         Admin Login
        </Typography>

        <form onSubmit={handleLogin}>
          {/* Email Input */}
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
          {/* Password Input */}
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
          {/* Login Button */}
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

export default Login;

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Import Add icon

function CreateSubadminDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!email || !role) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      // Replace with your actual API endpoint and request
      const response = await fetch(
        'https://your-api-endpoint/admin/createSubadmin',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
          body: JSON.stringify({ email, role }),
        }
      );

      if (response.ok) {
        setSuccess('Subadmin created successfully');
        setEmail('');
        setRole('');
        handleClose();
      } else {
        setError('Failed to create subadmin');
      }
    } catch (error) {
      console.error('Error creating subadmin:', error);
      setError('An error occurred while creating subadmin');
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setError('');
    setSuccess('');
  };

  return (
    <Box>
      {/* Add Subadmin Button with "+" Icon */}
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={handleOpen}
        startIcon={<AddIcon />} // Add the "+" icon here
      >
        Add Subadmin
      </Button>

      {/* Dialog for Creating Subadmin */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle >Create Subadmin</DialogTitle>
        <DialogContent>
          {/* Email Input */}
          <FormControl fullWidth sx={{ marginBottom: 3, marginTop: 1 }}>
            <TextField 
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </FormControl>

          {/* Role Selector */}
          <FormControl fullWidth sx={{ marginBottom: 3 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Role"
            >
              <MenuItem value="SUBADMIN">Subadmin</MenuItem>
              <MenuItem value="EMPLOYEE">Employee</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{padding:3}}>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={loading}
            variant="contained"
          >
            {loading ? 'Processing...' : 'Approve Access'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={!!error}
        onClose={handleSnackbarClose}
        message={error}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <Snackbar
        open={!!success}
        onClose={handleSnackbarClose}
        message={success}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}

export default CreateSubadminDialog;

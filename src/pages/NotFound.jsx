import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
        padding: 3,
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#0D1B2A' }}>
        404 - Page Not Found
      </Typography>
      <Typography variant="h6" sx={{ marginTop: 2, color: '#555' }}>
        Sorry, the page you are looking for doesn't exist.
      </Typography>
      <Button
        component={Link}
        to="/admin/employee-details"
        sx={{
          marginTop: 3,
          backgroundColor: '#0D1B2A',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#2d3b48',
          },
        }}
      >
        Go to Employee Details
      </Button>
    </Box>
  );
};

export default NotFound;

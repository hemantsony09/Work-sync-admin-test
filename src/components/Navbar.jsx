import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = () => {
  return (  
    <AppBar  position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Work Sync Admin Panel
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  Button,
} from '@mui/material';

const LeavePage = () => {
  const { state } = useLocation(); // Fetching the employee data passed from the previous page
  const { employee } = state || {};

  const [leaveData, setLeaveData] = useState([]);
  const [filteredLeaveType, setFilteredLeaveType] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        
      setLoading(true);
      setSnackbarOpen(true);
        const adminEmail = localStorage.getItem('email');
        const token = localStorage.getItem('token');

        if (!adminEmail || !token) {
          console.error('Admin email or token missing from local storage.');
          return;
        }

        if (!employee?.email) {
          console.error('Employee email is missing.');
          return;
        }

        const response = await axios.get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/leaves/${employee.email}?adminEmail=${adminEmail}`,
          {
            headers: { Authorization: token },
          }
        );

        setLeaveData(response.data);
        setFilteredData(response.data); // Initialize filtered data with the API response
      } catch (error) {
        console.error('Error fetching leave data:', error);
      } finally {
        setLoading(false);
        setSnackbarOpen(false);
      }
    };

    if (employee) fetchLeaveData();
  }, [employee]);

  // Filter data dynamically when filters or employee data changes
  useEffect(() => {
    if (leaveData.length > 0) {
      let filtered = leaveData;

      if (filteredLeaveType) {
        filtered = filtered.filter((leave) => leave.leaveType === filteredLeaveType);
      }

      if (searchDate) {
        filtered = filtered.filter(
          (leave) =>
            leave.startDate <= searchDate &&
            (leave.endDate ? leave.endDate >= searchDate : true) // Handle open-ended leaves
        );
      }

      setFilteredData(filtered);
    }
  }, [leaveData, filteredLeaveType, searchDate]);

  // Reset filters
  const handleReset = () => {
    setFilteredLeaveType('');
    setSearchDate('');
    setFilteredData(leaveData); // Reset to original data
  };

  if (!employee) {
    return (
      <Typography variant="h6" color="error" align="center">
        Employee not found
      </Typography>
    );
  }
  const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
    if(loading){
      return(
        <>
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          Loading
        </Alert>
      </Snackbar>
        </>
      )
    }
  

  return (
    <div className="p-6">
      <div className="flex gap-4 items-center justify-between">
        <div>
          <Typography variant="h4" gutterBottom>
            {employee.name}'s Leave Details
          </Typography>
        </div>

        {/* Filters */}
        <div className="flex gap-4 py-5">
          {/* Leave Type Dropdown */}
          <Select
            value={filteredLeaveType}
            onChange={(e) => setFilteredLeaveType(e.target.value)}
            displayEmpty
            variant="outlined"
            sx={{ width: '250px' }}
          >
            <MenuItem value="">All Leave Types</MenuItem>
            <MenuItem value="Sick">Sick Leave</MenuItem>
            <MenuItem value="Casual">Casual Leave</MenuItem>
            <MenuItem value="Annual">Annual Leave</MenuItem>
          </Select>

          {/* Search by Date */}
          <TextField
            label="Search by Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            variant="outlined"
            sx={{ width: '250px' }}
          />

          {/* Reset Button */}
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      {/* Leave Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Leave ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No leave records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>{leave.id}</TableCell>
                    <TableCell>{leave.name}</TableCell>
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>{leave.reason}</TableCell>
                    <TableCell>{leave.startDate}</TableCell>
                    <TableCell>{leave.endDate || 'N/A'}</TableCell>
                    <TableCell>{leave.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default LeavePage;

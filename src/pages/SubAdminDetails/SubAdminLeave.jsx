import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Select,
  
  Snackbar,
  Alert,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SubAdminLeave = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email'); // Employee email from query parameter
  // const email = 'luffy@gmail.com' // Employee email from query parameter

  const [leaveRequests, setLeaveRequests] = useState([]);

  const [error, setError] = useState(null);

  const [filteredLeaveType, setFilteredLeaveType] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        
      setLoading(true);
      setSnackbarOpen(true);
        const token = localStorage.getItem('token');
        const adminEmail = localStorage.getItem('email');

        if (!email || !adminEmail || !token) {
          setError('Missing required parameters or authentication.');
         
          return;
        }

        const response = await axios.get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/leaves/${email}`,
          {
            headers: {
              Authorization: token,
            },
            params: {
              adminEmail: adminEmail,
            },
          }
        );

        setLeaveRequests(response.data || []);
      } catch (err) {
        console.error('Error fetching leave requests:', err);
        setError('Failed to fetch leave requests. Please try again later.');
      }  finally {
        setLoading(false);
        setSnackbarOpen(false);
      }
    };

    fetchLeaveRequests();
  }, [email]);

  const handleReset = () => {
    setFilteredLeaveType('');
    setSearchDate('');
  };

  const filteredRequests = leaveRequests.filter((request) => {
    return (
      (filteredLeaveType === '' || request.leaveType === filteredLeaveType) &&
      (searchDate === '' || request.startDate === searchDate)
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const currentPageData = filteredRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
      <div className="flex justify-between items-center">
        <Typography variant="h4" gutterBottom>
          Leave Requests for {email || 'Unknown Sub Admin'}
        </Typography>

        {/* Filters */}
        <div className="flex gap-4 py-5">
          <Select
            value={filteredLeaveType}
            onChange={(e) => setFilteredLeaveType(e.target.value)}
            displayEmpty
            variant="outlined"
            sx={{ width: '250px' }}
          >
            <MenuItem value="">All Leave Types</MenuItem>
            <MenuItem value="Sick">Sick Leave</MenuItem>
            <MenuItem value="Paternity">Paternity Leave</MenuItem>
          </Select>

          <TextField
            label="Search by Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            variant="outlined"
            sx={{ width: '250px' }}
          />

          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#f0f0f0' }}>
                  <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Leave Type</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Start Date</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>End Date</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentPageData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No leave requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentPageData.map((request,index) => (
                    <TableRow key={request.id}>
                      <TableCell>{index+1}</TableCell>
                      <TableCell>{request.name}</TableCell>
                      <TableCell>{request.leaveType}</TableCell>
                      <TableCell>{request.startDate}</TableCell>
                      <TableCell>{request.endDate || 'N/A'}</TableCell>
                      <TableCell>{request.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredRequests.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
          />
        </Paper>
      )}
    </div>
  );
};

export default SubAdminLeave;

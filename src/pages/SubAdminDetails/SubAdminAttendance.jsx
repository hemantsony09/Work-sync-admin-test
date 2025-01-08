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
  TextField,
  Snackbar,
  Alert,
  Button,
  Box,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SubAdminAttendance = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email'); // Get employee email from query parameter
  const adminEmail = localStorage.getItem('email'); // Get admin email from localStorage
  const token = localStorage.getItem('token'); // Get token from localStorage

  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [selectedDate, setSelectedDate] = useState(''); // Date filter state

  useEffect(() => {
    
    const fetchAttendance = async () => {
      if (!email || !adminEmail || !token) {
        setError('Missing required parameters or authentication.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setSnackbarOpen(true);
        const response = await axios.get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/attendance/${email}`,
          {
            headers: {
              Authorization: token,
            },
            params: {
              adminEmail,
            },
          }
        );

        setAttendanceData(response.data || []);
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        setError('Failed to fetch attendance data. Please try again later.');
      }  finally {
        setLoading(false);
        setSnackbarOpen(false);
      }
    };

    fetchAttendance();
  }, [email, adminEmail, token]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Reset the date filter
  const handleReset = () => {
    setSelectedDate('');
  };

  // Filter attendance by date if a date is selected
  const filteredAttendance = selectedDate
    ? attendanceData.filter((record) => record.date === selectedDate)
    : attendanceData;

  // Paginate filtered data
  const currentPageData = filteredAttendance.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Format date and time for display
  const formatDate = (date) => new Date(date).toLocaleDateString();
  const formatTime = (time) => (time ? new Date(time).toLocaleTimeString() : 'N/A');

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
      <div className="flex justify-between items-center py-4">
        <Typography variant="h4" gutterBottom>
          Attendance for {email || 'Unknown User'}
        </Typography>

        {/* Date Filter */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Search by Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            variant="outlined"
            sx={{ width: '250px' }}
          />
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </Button>
        </Box>
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
                  <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Punch In</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Punch Out</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentPageData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No attendance records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentPageData.map((attendance, index) => (
                    <TableRow key={attendance.id || index}>
                      <TableCell>{ index + 1}</TableCell>
                      <TableCell>{attendance.name}</TableCell>
                      <TableCell>{formatDate(attendance.date)}</TableCell>
                      <TableCell>{formatTime(attendance.punchInTime)}</TableCell>
                      <TableCell>{formatTime(attendance.punchOutTime)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredAttendance.length}
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

export default SubAdminAttendance;

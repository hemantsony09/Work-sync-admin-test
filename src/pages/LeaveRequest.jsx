import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Select,
  MenuItem,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Snackbar,
} from '@mui/material';

const LeaveRequest = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const [nameFilter, setNameFilter] = useState('');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
  const fetchLeaveRequests = async () => {
    const adminEmail = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    try {
      setLoading(true);
      setSnackbarOpen(true); 
      const response = await axios.get(
        'https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/leaves/pending',
        {
          params: { adminEmail },
          headers: { Authorization: token },
        }
      );

      // Filter data where role === 'SUBADMIN'
      const subAdminData = response.data.filter((item) => item.role === 'SUBADMIN');
      setLeaveData(subAdminData);
    } catch (error) {
      setError('Failed to fetch leave requests. Please try again later.',error);
    } finally {
      setLoading(false);
      setSnackbarOpen(false);
    }
  };

  fetchLeaveRequests();
}, []);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleActionChange = async (leaveId, newStatus) => {
    const token = localStorage.getItem('token');
    const adminEmail = localStorage.getItem('email');

    try {
      await axios.patch(
        'https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/approve/leave',
        {
          adminEmail,
          leaveId,
          status: newStatus,
        },
        { headers: { Authorization: token } }
      );

      setLeaveData((prevData) =>
        prevData.map((leave) =>
          leave.id === leaveId ? { ...leave, status: newStatus } : leave
        )
      );
      alert(`Leave ${newStatus.toLowerCase()} successfully!`);
    } catch (err) {
      console.error('Error updating leave status:', err.response?.data || err.message);
      alert('Failed to update leave status. Please try again.');
    }
  };

  const filteredData = leaveData.filter(
    (leave) =>
      (!nameFilter || leave.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (!leaveTypeFilter || leave.leaveType === leaveTypeFilter) &&
      (!statusFilter || leave.status === statusFilter)
  );

  const currentPageData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" gutterBottom>
          Leave Requests
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginBottom: 2 }}>
          <TextField
            label="Filter by Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            variant="outlined"
            sx={{ width: '200px' }}
          />
          <FormControl variant="outlined" sx={{ width: '200px' }}>
            <InputLabel>Filter by Leave Type</InputLabel>
            <Select
              value={leaveTypeFilter}
              onChange={(e) => setLeaveTypeFilter(e.target.value)}
              label="Filter by Leave Type"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Sick">Sick Leave</MenuItem>
              <MenuItem value="Casual">Casual Leave</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ width: '200px' }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Filter by Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: '#f0f0f0' }}>
                <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Leave Type</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Reason</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No leave requests found.
                  </TableCell>
                </TableRow>
              ) : (
                currentPageData.map((leave,index) => (
                  <TableRow key={leave.id}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{leave.name}</TableCell>
                    <TableCell>{leave.email}</TableCell>
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>{leave.reason}</TableCell>
                    <TableCell>{leave.status}</TableCell>
                    <TableCell>
                      <FormControl>
                        <Select
                          value=""
                          onChange={(e) => handleActionChange(leave.id, e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            Select Action
                          </MenuItem>
                          <MenuItem value="APPROVED">Approve</MenuItem>
                          <MenuItem value="REJECTED">Reject</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />
    </div>
  );
};

export default LeaveRequest;

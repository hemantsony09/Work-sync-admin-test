import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  Snackbar,
  Alert,
  TablePagination,
} from '@mui/material';

const Meeting = () => {
  const [meetings, setMeetings] = useState([]); // State for meetings
  const [searchTerm, setSearchTerm] = useState(''); // State for topic filter
  const [searchDate, setSearchDate] = useState(''); // State for date filter
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  // Fetch meetings data
  useEffect(() => {
    const fetchMeetings = async () => {
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('token');

      try {
      
      setLoading(true);
      setSnackbarOpen(true);
        const response = await axios.get(
          'https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/meetings/get-all',
          {
            headers: {
              Authorization: token,
            },
            params: {
              adminEmail: email,
            },
          }
        );

        setMeetings(response.data);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setLoading(false);
        setSnackbarOpen(false);
      }
    };

    fetchMeetings();
  }, []);

  // Filter meetings based on topic and date
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesTopic = meeting.meetingTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = searchDate ? meeting.date === searchDate : true;
    return matchesTopic && matchesDate;
  });

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page is changed
  };
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
      {/* Header and Filters */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <h2 className="text-xl font-bold mb-4">Employee Meetings</h2>
        <Box display="flex" gap={2} sx={{ width: '800px', justifyContent: 'flex-end' }}>
          {/* Topic Filter */}
          <TextField
            label="Search by Topic"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: '400px' }}
          />
          {/* Date Filter */}
          <TextField
            label="Search by Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            sx={{ width: '400px' }}
          />
        </Box>
      </Box>

      {/* Meeting Table */}
      <Paper elevation={3} className="mt-4">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: '#f0f0f0' }}>
                <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell style={{width:'130px', fontWeight: 'bold' }}>Meeting Title</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Mode</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Participants</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Duration</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Time</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Link</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMeetings.length > 0 ? (
                filteredMeetings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell>{meeting.id}</TableCell>
                      <TableCell>{meeting.meetingTitle}</TableCell>
                      <TableCell>{meeting.description}</TableCell>
                      <TableCell>{meeting.meetingMode}</TableCell>
                      <TableCell>{meeting.participants.join(', ')}</TableCell>
                      <TableCell>{meeting.duration}</TableCell>
                      <TableCell>{meeting.date}</TableCell>
                      <TableCell sx={{width:'110px'}}>{new Date(meeting.scheduledTime).toLocaleTimeString()}</TableCell>
                      <TableCell>
                        <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer">
                          Join
                        </a>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    No meetings match the search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={filteredMeetings.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default Meeting;

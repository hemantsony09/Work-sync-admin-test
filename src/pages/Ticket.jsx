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
  MenuItem,
  Select,
  Snackbar,
  Alert,
  InputLabel,
  FormControl,
  Box,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material';

const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchPriority, setSearchPriority] = useState('');
  const [searchEmployee, setSearchEmployee] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState('');

  // Dialog-related state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setSnackbarOpen(true);
        const adminEmail = localStorage.getItem('email'); // Fetch from localStorage
        const token = localStorage.getItem('token'); // Fetch from localStorage
        const response = await axios.get(
          'https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/tickets/',
          {
            params: { adminEmail },
            headers: { Authorization: token },
          }
        );
        setTickets(response.data);
      } catch (err) {
        setError('Failed to fetch tickets. Please try again.');
      } finally {
        setLoading(false);
        setSnackbarOpen(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesIssue = ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = searchStatus ? ticket.status === searchStatus : true;
    const matchesPriority = searchPriority ? ticket.priority === searchPriority : true;
    const matchesEmployee = ticket.email.toLowerCase().includes(searchEmployee.toLowerCase());
    return matchesIssue && matchesStatus && matchesPriority && matchesEmployee;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleOpenDialog = (ticket) => {
    setSelectedTicket(ticket);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTicket(null);
  };

  if (loading) {
    return (
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
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <h2 className="text-xl font-bold mb-4">Employee Tickets</h2>
        <Box display="flex" gap={2} sx={{ width: '800px', justifyContent: 'flex-end' }}>
          <TextField
            label="Search by Issue"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: '400px' }}
          />
          <TextField
            label="Search by Employee"
            variant="outlined"
            value={searchEmployee}
            onChange={(e) => setSearchEmployee(e.target.value)}
            sx={{ width: '400px' }}
          />
          <FormControl variant="outlined" sx={{ width: '200px' }}>
            <InputLabel>Status</InputLabel>
            <Select value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)} label="Status">
              <MenuItem value="">All</MenuItem>
              <MenuItem value="OPEN">Open</MenuItem>
              <MenuItem value="RESOLVED">Resolved</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ width: '200px' }}>
            <InputLabel>Priority</InputLabel>
            <Select value={searchPriority} onChange={(e) => setSearchPriority(e.target.value)} label="Priority">
              <MenuItem value="">All</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Paper elevation={3} className="mt-4">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: '#f0f0f0' }}>
                <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Priority</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets.length > 0 ? (
                filteredTickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ticket,index) => (
                  <TableRow key={ticket.id} onClick={() => handleOpenDialog(ticket)} style={{ cursor: 'pointer' }}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{ticket.email}</TableCell>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>
                      {ticket.description.split(' ').slice(0, 5).join(' ')}
                      {ticket.description.split(' ').length > 5 && '...'}
                    </TableCell>  <TableCell>
                      <span style={{ fontWeight: 'bold', color: ticket.status === 'OPEN' ? 'red' : 'green' }}>
                        {ticket.status}
                      </span>
                    </TableCell>
                    <TableCell>{ticket.priority}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No tickets match the search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={filteredTickets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog for displaying ticket details */}
      {selectedTicket && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Ticket Details</DialogTitle>
          <DialogContent>
            <Box>
              <p><strong>ID:</strong> {selectedTicket.id}</p>
              <p><strong>Email:</strong> {selectedTicket.email}</p>
              <p><strong>Title:</strong> {selectedTicket.title}</p>
              <p><strong>Description:</strong> {selectedTicket.description}</p>
              <p><strong>Status:</strong> {selectedTicket.status}</p>
              <p><strong>Priority:</strong> {selectedTicket.priority}</p>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Ticket;

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
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTask, setSelectedTask] = useState(null); // For the selected task
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog state

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setSnackbarOpen(true);
        const adminEmail = localStorage.getItem('email');
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/tasks/all?adminEmail=${adminEmail}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setTasks(response.data);
      } catch (err) {
        setError('Failed to fetch tasks. Please try again.');
      } finally {
        setLoading(false);
        setSnackbarOpen(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle row click
  const handleRowClick = (task) => {
    setSelectedTask(task); // Set selected task
    setDialogOpen(true); // Open dialog
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTask(null); // Clear selected task
  };

  // Filtered tasks
  const filteredTasks = tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle page and rows per page changes
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div className="p-6">
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <h2 className="text-xl font-bold">Employee Tasks</h2>
        <Box sx={{ width: '400px' }}>
          <TextField
            label="Search by Name or Task"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: '#f0f0f0' }}>
                <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Assigned By</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Assigned To</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Deadline</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((task,index) => (
                    <TableRow key={task.id} onClick={() => handleRowClick(task)} style={{ cursor: 'pointer' }}>
                      <TableCell>{index+1}</TableCell>
                      <TableCell>{task.assignedBy}</TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>
                        {task.description.split(' ').slice(0, 5).join(' ')}
                        {task.description.split(' ').length > 5 && '...'}
                      </TableCell>
                      <TableCell>{task.deadLine}</TableCell>
                      <TableCell>{task.status}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No tasks match the search criteria.
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
        count={filteredTasks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog for Task Details */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Task Details</DialogTitle>
        <DialogContent>
          {selectedTask && (
            <>
              <Typography><strong>ID:</strong> {selectedTask.id}</Typography>
              <Typography><strong>Assigned By:</strong> {selectedTask.assignedBy}</Typography>
              <Typography><strong>Assigned To:</strong> {selectedTask.assignedTo}</Typography>
              <Typography><strong>Title:</strong> {selectedTask.title}</Typography>
              <Typography><strong>Description:</strong> {selectedTask.description}</Typography>
              <Typography><strong>Deadline:</strong> {selectedTask.deadLine}</Typography>
              <Typography><strong>Status:</strong> {selectedTask.status}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Task;

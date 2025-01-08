import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
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
  Button,
  Box,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const TaskPage = () => {
  const { state } = useLocation(); // Fetching the employee data passed from the previous page
  const { employee } = state || {};

  const [taskData, setTaskData] = useState([]);
  const [taskNameFilter, setTaskNameFilter] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10); // Fixed to 10 rows per page

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setSnackbarOpen(true);
      try {
        const adminEmail = localStorage.getItem('email');
        const token = localStorage.getItem('token');

        if (!adminEmail || !token) {
          setError('Admin email or token missing in local storage.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/tasks/givenTasks`,
          {
            params: {
              adminEmail: adminEmail,
              assignedTo: employee.email,
            },
            headers: {
              Authorization: token,
            },
          }
        );

        setTaskData(response.data || []);
        setFilteredTasks(response.data || []);
      } catch (err) {
        setError(`Failed to fetch tasks: ${err.message}`);
      } finally {
        setLoading(false);
        setSnackbarOpen(false);
      }
    };

    if (employee?.email) {
      fetchTasks();
    }
  }, [employee]);

  useEffect(() => {
    let filtered = taskData;

    if (taskNameFilter) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(taskNameFilter.toLowerCase())
      );
    }

    if (taskStatusFilter) {
      filtered = filtered.filter((task) => task.status === taskStatusFilter);
    }

    setFilteredTasks(filtered);
  }, [taskData, taskNameFilter, taskStatusFilter]);

  const handleReset = () => {
    setTaskNameFilter('');
    setTaskStatusFilter('');
    setFilteredTasks(taskData);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleRowClick = (task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTask(null);
  };

  const truncateDescription = (description) => {
    const words = description.split(' ');
    return words.length > 5 ? `${words.slice(0, 5).join(' ')}...` : description;
  };

  if (loading) {
    return (
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          Loading
        </Alert>
      </Snackbar>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Typography variant="h4" gutterBottom>
          {employee?.name}'s Task Details
        </Typography>
        <div className="flex gap-4 py-4">
          <TextField
            label="Search by Task Name"
            variant="outlined"
            value={taskNameFilter}
            onChange={(e) => setTaskNameFilter(e.target.value)}
            sx={{ flex: 1 }}
          />
          <FormControl variant="outlined" sx={{ flex: 1, minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={taskStatusFilter}
              onChange={(e) => setTaskStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            sx={{ height: '55px' }}
          >
            Reset
          </Button>
        </div>
      </div>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Assigned By</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Assigned Date</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task, index) => (
                <TableRow key={task.id} onClick={() => handleRowClick(task)} style={{ cursor: 'pointer' }}>
                  <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{truncateDescription(task.description)}</TableCell>
                  <TableCell>{new Date(task.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{task.deadLine}</TableCell>
                  <TableCell>{task.status}</TableCell>
                </TableRow>
              ))}
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
      />

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Task Details</DialogTitle>
        <DialogContent>
          {selectedTask && (
            <>
              <Typography variant="subtitle1">ID: {selectedTask.id}</Typography>
              <Typography variant="subtitle1">Assigned By: {selectedTask.name}</Typography>
              <Typography variant="subtitle1">Title: {selectedTask.title}</Typography>
              <Typography variant="subtitle1">
                Description: {truncateDescription(selectedTask.description)}
              </Typography>
              <Typography variant="subtitle1">
                Assigned Date: {new Date(selectedTask.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="subtitle1">Deadline: {selectedTask.deadLine}</Typography>
              <Typography variant="subtitle1">Status: {selectedTask.status}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskPage;

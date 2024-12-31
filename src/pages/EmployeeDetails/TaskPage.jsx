import React, { useState, useEffect } from 'react';
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
  Button,
  Box,
  
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

const TaskPage = () => {
  const { state } = useLocation(); // Fetching the employee data passed from the previous page
  const { employee } = state || {};

  const [taskData, setTaskData] = useState([]);
  const [taskNameFilter, setTaskNameFilter] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        
      setLoading(true);
      setSnackbarOpen(true); 
        const adminEmail = localStorage.getItem('email');
        const token = localStorage.getItem('token');

        if (!adminEmail || !token) {
          setError('Admin email or token missing in local storage.');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/tasks/get/email?adminEmail=${adminEmail}&email=${employee.email}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        }

        const data = await response.json();
        setTaskData(data.tasks || []);
        setFilteredTasks(data.tasks || []);
      } catch (err) {
        setError(err.message);
      }  finally {
        setLoading(false);
        setSnackbarOpen(false);
      }
    };

    if (employee?.email) {
      fetchTasks();
    }
  }, [employee]);

  // Filter tasks dynamically when filters or taskData change
  useEffect(() => {
    let filtered = taskData;

    if (taskNameFilter) {
      filtered = filtered.filter((task) =>
        task.task.toLowerCase().includes(taskNameFilter.toLowerCase())
      );
    }

    if (taskStatusFilter) {
      filtered = filtered.filter((task) => task.status === taskStatusFilter);
    }

    setFilteredTasks(filtered);
  }, [taskData, taskNameFilter, taskStatusFilter]);

  // Reset filters
  const handleReset = () => {
    setTaskNameFilter('');
    setTaskStatusFilter('');
    setFilteredTasks(taskData);
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
        <div>
          <Typography variant="h4" gutterBottom>
            {employee.name}'s Task Details
          </Typography>
        </div>
        <div className="flex gap-4 py-4">
          <TextField
            label="Search by Task Name"
            variant="outlined"
            value={taskNameFilter}
            onChange={(e) => setTaskNameFilter(e.target.value)}
            sx={{ flex: 1 }}
          />

          {/* Task Status Filter Dropdown */}
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

          {/* Reset Button */}
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

      {/* Task Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Task Description</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.id}</TableCell>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>{task.email}</TableCell>
                    <TableCell>{task.task}</TableCell>
                    <TableCell>{task.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No tasks match the filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default TaskPage;

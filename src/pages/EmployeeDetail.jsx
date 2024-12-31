import React, { useState, useEffect } from 'react';
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
  Button,
  Typography,
  Menu,
  Snackbar,
  Alert,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';

const EmployeeDetails = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAllInfoDialogOpen, setShowAllInfoDialogOpen] = useState(false);

  
  // Fetch employee data
  useEffect(() => {
    const fetchEmployees = async () => {
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('token');

      try {
      setLoading(true);
      setSnackbarOpen(true); 
        const response = await fetch(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/get-all-users?adminEmail=${encodeURIComponent(email)}`,
          {
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setEmployees(data);
        } else {
          console.error('Failed to fetch employees');
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
      finally {
        setLoading(false);
        setSnackbarOpen(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleClick = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleActionSelect = (action) => {
    if (selectedEmployee) {
      if (action === 'showAllInfo') {
        setShowAllInfoDialogOpen(true);
      } else {
        navigate(`/admin/employee/${selectedEmployee.email}/${action}`, { state: { employee: selectedEmployee } });
      }
    }
    setAnchorEl(null);
  };

 

  const handleCloseShowAllInfoDialog = () => {
    setShowAllInfoDialogOpen(false);
  };

  // Filter and paginate employees
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase())
  );

  const employeesPerPage = 10;
  const startIndex = (page - 1) * employeesPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, startIndex + employeesPerPage);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleNextPage = () => {
    if (page * employeesPerPage < filteredEmployees.length) {
      setPage(page + 1);
    }
  };

  
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
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
    <div className="p-6 overflow-auto h-screen">
      <h2 className="text-xl font-bold">Employee Details</h2>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          sx={{ width: 400 }}
        />
      </Box>
      {filteredEmployees.length === 0 ? (
        <Typography variant="h6" color="error" align="center" sx={{ mt: 2 }}>
          No data found
        </Typography>
      ) : (
        <Paper className="mt-4">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#f0f0f0' }}>
                  <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Joining Date</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.joiningDate}</TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleClick(e, employee)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={() => handleActionSelect('showAllInfo')}>Show All Info</MenuItem>
                        <MenuItem onClick={() => handleActionSelect('leave')}>Leave</MenuItem>
                        <MenuItem onClick={() => handleActionSelect('task')}>Task</MenuItem>
                        <MenuItem onClick={() => handleActionSelect('attendance')}>Attendance</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="outlined" onClick={handlePrevPage} disabled={page === 1}>
          Prev
        </Button>
        <Button
          variant="outlined"
          onClick={handleNextPage}
          disabled={page * employeesPerPage >= filteredEmployees.length}
        >
          Next
        </Button>
      </Box>


      {/* Dialog to Show All Employee Information */}
      <Dialog open={showAllInfoDialogOpen} onClose={handleCloseShowAllInfoDialog}>
  <DialogTitle>Employee Information</DialogTitle>
  <DialogContent>
    {selectedEmployee ? (
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell>{selectedEmployee.id || 'Not Available'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell>{selectedEmployee.name || 'Not Available'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell>{selectedEmployee.email || 'Not Available'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Mobile</strong></TableCell>
              <TableCell>{selectedEmployee.mobileNo || 'Not Available'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell>{selectedEmployee.role || 'Not Available'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>DOB</strong></TableCell>
              <TableCell>{selectedEmployee.dob || 'Not Available'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Current Address</strong></TableCell>
              <TableCell>{selectedEmployee.addressDetails?.currentAddress || 'Not Available'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Permanent Address</strong></TableCell>
              <TableCell>{selectedEmployee.addressDetails?.permanentAddress || 'Not Available'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Emergency Contacts</strong></TableCell>
              <TableCell>
                {selectedEmployee.emergencyContactDetails?.length > 0 ? (
                  selectedEmployee.emergencyContactDetails.map((contact, index) => (
                    <div key={index}>
                      {contact.relation}: {contact.emergencyContactName} ({contact.emergencyContactNo})
                    </div>
                  ))
                ) : (
                  'Not Available'
                )}
              </TableCell>
            </TableRow>
              <TableCell colSpan={2}>
                <strong>Leave: </strong>
              </TableCell>
            <TableRow>
              <TableCell><strong>Sick Leave</strong></TableCell>
              <TableCell>{selectedEmployee.allLeaves?.sickLeave || 0}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Casual Leave</strong></TableCell>
              <TableCell>{selectedEmployee.allLeaves?.casualLeave || 0}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Paternity Leave</strong></TableCell>
              <TableCell>{selectedEmployee.allLeaves?.paternity || 0}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Optional Leave</strong></TableCell>
              <TableCell>{selectedEmployee.allLeaves?.optionalLeave || 0}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <strong>Bank Details: </strong>
              </TableCell>
            </TableRow>
                
                  
                      <TableRow>
                        <TableCell><strong>Account Holder Name</strong></TableCell>
                        <TableCell>{selectedEmployee.bankDetails?.accountHolderName || 'Not Available'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Account Type</strong></TableCell>
                        <TableCell>{selectedEmployee.bankDetails?.accountType || 'Not Available'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Account Number</strong></TableCell>
                        <TableCell>{selectedEmployee.bankDetails?.accountNumber || 'Not Available'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>IFSC Code</strong></TableCell>
                        <TableCell>{selectedEmployee.bankDetails?.ifscCode || 'Not Available'}</TableCell>
                      </TableRow>
                    
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Typography color="error">No employee data available.</Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseShowAllInfoDialog}>Close</Button>
  </DialogActions>
</Dialog>



    </div>
  );
};

export default EmployeeDetails;

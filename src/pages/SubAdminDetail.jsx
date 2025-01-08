import { useState, useEffect } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Menu, MenuItem, Typography, TextField, Box, Snackbar, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateSubadmin from './SubAdminDetails/CreateSubadmin'

const SubAdminDetails = () => {
  const navigate = useNavigate();

  const [subAdmins, setSubAdmins] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [selectedAdminEmail, setSelectedAdminEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAllInfoDialogOpen, setShowAllInfoDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    role: '',
    joiningDate: '',
    mobileNumber: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const rowsPerPage = 10;

  useEffect(() => {
    const fetchSubAdmins = async () => {
      try {
        setLoading(true);
        setSnackbarOpen(true);
        const adminEmail = localStorage.getItem('email');
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/subAdmins?adminEmail=${adminEmail}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(response);
        const apiData = response.data?.data;
        console.log('apiData>>>>>>', apiData);
        setSubAdmins(apiData);
      } catch (error) {
        console.error('Error fetching sub-admins:', error);
      } finally {
        setLoading(false);
        setSnackbarOpen(false);
      }
    };

    fetchSubAdmins();
  }, []);

  const handleCloseShowAllInfoDialog = () => {
    setShowAllInfoDialogOpen(false);
  };

  const handleMenuOpen = (event, adminId, adminEmail, subAdmin) => {
    setAnchorEl(event.currentTarget);
    setSelectedAdminId(adminId);
    setSelectedAdminEmail(adminEmail);
    setSelectedEmployee(subAdmin);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAdminId(null);
    setSelectedAdminEmail('');
  };

  const handleMenuAction = (action) => {
    if (action === 'Leave') {
      navigate(`/subadmin/${selectedAdminId}/leave?email=${encodeURIComponent(selectedAdminEmail)}`);
    } else if (action === 'Attendance') {
      navigate(`/subadmin/${selectedAdminId}/attendance?email=${encodeURIComponent(selectedAdminEmail)}`);
    } else if (action === 'showAllInfoedit') {
      setShowAllInfoDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleApproveAccess = async (email) => {
    try {
      const token = localStorage.getItem('token');
      const adminEmail = localStorage.getItem('email');
      console.log(email)
      const response = await axios.patch(
        'https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/sub-admin-access',
        {
          adminEmail,
          email,
          approvedByAdmin: !subAdmins.find((admin) => admin.jobHistory.email === email).approvedByAdmin,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response);

      const updatedAdmins = subAdmins.map((admin) =>
        admin.jobHistory.email === email
          ? { ...admin, approvedByAdmin: !admin.approvedByAdmin }
          : admin
      );
      setSubAdmins(updatedAdmins);
    } catch (error) {
      console.error('Error approving access:', error);
    }
  };
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditSave = () => {
    const updatedAdmins = subAdmins.map((admin) =>
      admin.id === selectedAdminId
        ? {
          ...admin,
          jobHistory: {
            ...admin.jobHistory,
            name: editFormData.name,
            designation: editFormData.role,
            joiningDate: editFormData.joiningDate,
            email: editFormData.email,
          },
        }
        : admin
    );
    setSubAdmins(updatedAdmins);
    setEditDialogOpen(false);
  };

  const filteredSubAdmins = subAdmins.filter((subAdmin) =>
    subAdmin.jobHistory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subAdmin.jobHistory.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subAdmin.jobHistory.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (page - 1) * rowsPerPage;
  const paginatedSubAdmins = filteredSubAdmins.slice(startIndex, startIndex + rowsPerPage);

  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setPage((prev) => (prev * rowsPerPage < filteredSubAdmins.length ? prev + 1 : prev));


  const [warningPopupOpen, setWarningPopupOpen] = useState(false);
  const [warningPopupEmail, setWarningPopupEmail] = useState('');
  const [warningPopupStatus, setWarningPopupStatus] = useState(false);

  const handleWarningPopup = (email, status) => {
    setWarningPopupEmail(email);
    setWarningPopupStatus(status);
    setWarningPopupOpen(true);
  };

  const handleWarningPopupClose = () => {
    setWarningPopupOpen(false);
  };

  const handleWarningPopupConfirm = () => {
    handleApproveAccess(warningPopupEmail);
    setWarningPopupOpen(false);
  };


  if (loading) {
    return (
      <>
        <Snackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: '100%' }}>
            Loading
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <div className="p-6">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Sub Admin Details
        </Typography>
        <div className=' flex gap-4 items-center'>

          <CreateSubadmin />
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: '400px' }}
          />
        </div>
      </Box>
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: '#f0f0f0' }}>
                <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Joining Date</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>More</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSubAdmins.length > 0 ? (
                paginatedSubAdmins.map((subAdmin, index) => (
                  <TableRow key={subAdmin.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{subAdmin.jobHistory.name}</TableCell>
                    <TableCell>{subAdmin.jobHistory.email}</TableCell>
                    <TableCell>{subAdmin.jobHistory.designation}</TableCell>
                    <TableCell>{subAdmin.jobHistory.joiningDate}</TableCell>
                    <TableCell>
                      {subAdmin.approvedByAdmin ? (
                        <Typography color="green">Approved</Typography>
                      ) : (
                        <Typography color="red">Not Approved</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={subAdmin.approvedByAdmin ? 'secondary' : 'primary'}
                        onClick={() => {
                          console.log('Button clicked!');
                          console.log('subAdmin.id:', subAdmin.jobHistory.email);
                          handleWarningPopup(subAdmin.jobHistory.email, subAdmin.approvedByAdmin);
                        }}
                      >
                        {subAdmin.approvedByAdmin ? 'Deactivate' : 'Activate'}
                      </Button>
                    </TableCell><TableCell>
                      <IconButton
                        aria-controls="action-menu"
                        aria-haspopup="true"
                        onClick={(event) =>
                          handleMenuOpen(event, subAdmin.id, subAdmin.jobHistory.email, subAdmin)
                        }
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="action-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={() => handleMenuAction('Leave')}>Leave</MenuItem>
                        <MenuItem onClick={() => handleMenuAction('Attendance')}>
                          Attendance
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuAction('showAllInfoedit')}>Show All Info</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No sub-admins available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Button variant="outlined" onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </Button>
        <Typography variant="body1" align="center">
          Page {page} of {Math.ceil(filteredSubAdmins.length / rowsPerPage)}
        </Typography>
        <Button
          variant="outlined"
          onClick={handleNextPage}
          disabled={page * rowsPerPage >= filteredSubAdmins.length}
        >
          Next
        </Button>
      </Box>

     {/* Show all info dialog */}
    <Dialog open={showAllInfoDialogOpen} onClose={handleCloseShowAllInfoDialog}>
      <DialogTitle>Sub Admin Details</DialogTitle>
      <DialogContent>
        {selectedEmployee ? (
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>{selectedEmployee.jobHistory.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>{selectedEmployee.jobHistory.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>{selectedEmployee.jobHistory.designation}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Joining Date</TableCell>
                  <TableCell>{selectedEmployee.jobHistory.joiningDate}</TableCell>
                </TableRow>
                {/* Add any other details you want to display */}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="h6">No details available.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseShowAllInfoDialog} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog open={warningPopupOpen} onClose={handleWarningPopupClose}>
      <DialogTitle>Warning</DialogTitle>
      <DialogContent>
        {warningPopupStatus ? (
          <Typography variant="body1">Are you sure you want to give access {warningPopupEmail}?</Typography>
        ) : (
          <Typography variant="body1">Are you sure you want to remove access {warningPopupEmail}?</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleWarningPopupClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleWarningPopupConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
    </div>
  );
};
export default SubAdminDetails;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [page, setPage] = useState(1);
  const [hasRenderError, setHasRenderError] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const itemsPerPage = 10;

  const adminEmail = localStorage.getItem('email');
  const token = localStorage.getItem('token');

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/all-notification?adminEmail=${adminEmail}`,
        {
          headers: { Authorization: token },
        }
      );
      setAnnouncements(response?.data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError('Failed to fetch announcements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!title || !message || !recipient) {
      setError('Please fill all fields');
      return;
    }

    const requestData = {
      id: new Date().getTime().toString(),
      title,
      message,
      createdAt: new Date().toISOString(),
      recipientType: recipient,
      recipientId: 'recipient-id-placeholder',
      read: false,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        'https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/createNotification',
        requestData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          params: { adminEmail },
        }
      );

      if (response.status === 200) {
        alert('Announcement created successfully');
        setAnnouncements([requestData, ...announcements]);
        setTitle('');
        setMessage('');
        setRecipient('');
      } else {
        setError('Failed to create announcement');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      setError('An error occurred while creating the announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLastAnnouncement = () => {
    if (announcements.length > 0) {
      const lastAnnouncement = announcements[0];
      setTitle(lastAnnouncement.title);
      setMessage(lastAnnouncement.message);
      setRecipient(lastAnnouncement.recipientType);
    }
  };

  const handleViewDetails = (announcement) => {
    setSelectedAnnouncement(announcement);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = () => {
    setError('');
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    try {
      fetchAnnouncements();
    } catch (error) {
      console.error('Error during rendering:', error);
      setHasRenderError(true);
    }
  }, []);

  const paginatedAnnouncements = announcements.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (hasRenderError) {
    return (
      <Typography variant="h6" color="error" textAlign="center">
        An error occurred during rendering. Please try again later.
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Snackbar
        open={!!error}
        onClose={handleCloseSnackbar}
        message={error}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <div className='flex justify-between items-center p-5'>

        <Typography variant="h5" gutterBottom>
          Create Announcement
        </Typography>
        <Button variant="contained" color="primary" onClick={handleCopyLastAnnouncement}>
          Copy Last Announcement
        </Button>
      </div>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        sx={{ marginBottom: 2 }}
      />
      <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
        <InputLabel>Recipient</InputLabel>
        <Select value={recipient} onChange={(e) => setRecipient(e.target.value)}>
          <MenuItem value="USER">Employee</MenuItem>
          <MenuItem value="SUBADMIN">Sub-Admin</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleCreateAnnouncement}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Create Announcement'}
      </Button>

      <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }}>
        Announcements
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : announcements?.length === 0 ? (
        <Typography>No Announcements Available</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Recipient Type</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAnnouncements?.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell className=' cursor-default'>{index+1}</TableCell>
                    <TableCell className=' cursor-default'>{item?.title}</TableCell>
                    <TableCell className=' cursor-default'>{item?.message.substring(0, 50)}...</TableCell>
                    <TableCell className=' cursor-default'>{item?.recipientType}</TableCell>
                    <TableCell className="cursor-default">
                      {(() => {
                        const date = new Date(item?.createdAt);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        const time = date.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        });
                        return `${day}-${month}-${year} ${time}`;
                      })()}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleViewDetails(item)}>View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={Math.ceil(announcements?.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            sx={{ marginTop: 2 }}
          />
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Announcement Details</DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" sx={{ wordWrap: 'break-word' }}>
            Title: {selectedAnnouncement?.title}
          </Typography>
          <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
            Message: {selectedAnnouncement?.message}
          </Typography>
          <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
            Recipient Type: {selectedAnnouncement?.recipientType}
          </Typography>
          <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
            Date & Time: {(() => {
                        const date = new Date(selectedAnnouncement?.createdAt);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        const time = date.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        });
                        return `${day}-${month}-${year} ${time}`;
                      })()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default AnnouncementManager;
import React, { useState } from 'react';
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
  CardActions,
} from '@mui/material';

const AnnouncementForm = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleMessageChange = (e) => setMessage(e.target.value);
  const handleRecipientChange = (e) => setRecipient(e.target.value);

  const handleSubmit = async () => {
    if (!title || !message || !recipient) {
      alert('Please fill all fields');
      return;
    }

    const adminEmail = localStorage.getItem('email');
    const token = localStorage.getItem('token');

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
        alert('Failed to create announcement');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('An error occurred while creating the announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Create Announcement
      </Typography>

      {/* Title Input */}
      <TextField
        label="Title"
        value={title}
        onChange={handleTitleChange}
        fullWidth
        variant="outlined"
        sx={{
          marginBottom: 2,
          backgroundColor: '#f9f9f9',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        }}
      />

      {/* Announcement Message Input */}
      <TextField
        label="Announcement Message"
        multiline
        rows={4}
        value={message}
        onChange={handleMessageChange}
        fullWidth
        variant="outlined"
        sx={{
          marginBottom: 2,
          backgroundColor: '#f9f9f9',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        }}
      />

      {/* Recipient Selection */}
      <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
        <InputLabel>Recipient</InputLabel>
        <Select
          value={recipient}
          onChange={handleRecipientChange}
          label="Recipient"
          sx={{
            backgroundColor: '#f9f9f9',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        >
          <MenuItem value="employee">Employee</MenuItem>
          <MenuItem value="subAdmin">Sub-Admin</MenuItem>
        </Select>
      </FormControl>

      {/* Submit Button */}
      <Box sx={{ marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{
            borderRadius: '8px',
            fontWeight: 'bold',
            padding: '12px',
            width: '200px',
            backgroundColor: '#007bff',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          }}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Announcement'}
        </Button>
      </Box>

      {/* Display All Announcements */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          All Announcements
        </Typography>
        {announcements.length > 0 ? (
          announcements.map((item, index) => (
            <Card key={index} sx={{ marginBottom: 3, borderRadius: '10px', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  Announcement {index + 1}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Title:</strong> {item.title}
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>
                  <strong>Message:</strong> {item.message}
                </Typography>
                <Typography variant="body2">
                  <strong>Recipient:</strong> {item.recipientType}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="secondary">
                  View Details
                </Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <Typography>No announcements available.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default AnnouncementForm;

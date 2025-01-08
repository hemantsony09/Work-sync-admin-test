import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  OutlinedInput,
  Chip,
} from "@mui/material";

function MeetingForm() {
  const [open, setOpen] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState("");
  const [participants, setParticipants] = useState([]);
  const [availableParticipants, setAvailableParticipants] = useState([]);
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [link, setLink] = useState("");
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const adminEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Fetch participants using Axios
  useEffect(() => {
    if (!adminEmail || !token) return;

    setLoadingParticipants(true);
    axios
      .get(
        `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/allUsers?adminEmail=${encodeURIComponent(
          adminEmail
        )}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        const approvedParticipants = response.data
          .filter((user) => user.approvedByAdmin)
          .map((user) => ({ name: user.name, email: user.email }));
        setAvailableParticipants(approvedParticipants);
        setLoadingParticipants(false);
      })
      .catch((error) => {
        console.error("Error fetching participants:", error);
        setLoadingParticipants(false);
      });
  }, [adminEmail, token]);
  
  const isMeetingInPast = () => {
    const meetingDate = new Date(`${date}T${time}`);
    const currentDate = new Date();
    return meetingDate < currentDate;
  };
  const handleSubmit = () => {
    const meetingDate = new Date(`${date}T${time}`);
    const currentDate = new Date();
    
    if (meetingDate < currentDate) {
      alert("Cannot create meeting in the past.");
      return;
    }
  
    const meetingData = {
      id: crypto.randomUUID(),
      name: adminEmail,
      email: adminEmail,
      meetingTitle,
      description,
      meetingMode: mode,
      participants: [adminEmail, ...participants.map((p) => p.email)],
      duration,
      date,
      scheduledTime: meetingDate.toISOString(),
      status: "OPEN",
      meetingLink: mode === "Online" ? link : "",
    };

    axios
    .post(
      `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/meetings?adminEmail=${encodeURIComponent(
        adminEmail
      )}`,
      meetingData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log("Meeting created successfully:", response.data);
      handleClose();
    })
    .catch((error) => {
      console.error("Error creating meeting:", error);

    });


};
  

  return (
    <Box>
      {/* Button to Open Dialog */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Meeting
      </Button>

      {/* Dialog for Creating Meeting */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create Meeting</DialogTitle>
        <DialogContent>
          <TextField
            label="Meeting Title"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Mode</InputLabel>
            <Select value={mode} onChange={(e) => setMode(e.target.value)}>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Participants</InputLabel>
            {loadingParticipants ? (
              <CircularProgress size={24} />
            ) : (
              <Select
                multiple
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                input={<OutlinedInput id="select-multiple-chip" />}
                renderValue={(selected) => (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                    }}
                  >
                    {selected.map((participant) => (
                      <Chip
                        key={participant.email}
                        label={participant.name}
                      />
                    ))}
                  </Box>
                )}
              >
                {availableParticipants.map((participant) => (
                  <MenuItem
                    key={participant.email}
                    value={participant}
                  >
                    {participant.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
          <TextField
            label="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Time"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Meeting Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
  <Button onClick={handleClose} color="secondary">
    Cancel
  </Button>
  <Button
    onClick={handleSubmit}
    color="primary"
    variant="contained"
    disabled={isMeetingInPast()}
  >
    Create Meeting
  </Button>
        </DialogContent>
        
      </Dialog>
      <DialogActions>
</DialogActions>
    </Box>
  );
}

export default MeetingForm;
 
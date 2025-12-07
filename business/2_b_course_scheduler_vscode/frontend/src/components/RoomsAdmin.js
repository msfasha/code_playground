import React, { useEffect, useState } from 'react';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Stack, Snackbar, Alert, Select, MenuItem, InputLabel, FormControl, Typography, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ROOMS_URL = 'http://localhost:8000/rooms';

function RoomsAdmin() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ room_number: '', floor_level: '', capacity: '', room_type: '' });
  const [editingNumber, setEditingNumber] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [floorFilter, setFloorFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch(ROOMS_URL);
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch rooms', severity: 'error' });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleOpenDialog = () => {
    setForm({ room_number: '', floor_level: '', capacity: '', room_type: '' });
    setEditingNumber(null);
    setOpenDialog(true);
    setError('');
  };

  const handleEdit = (room) => {
    setForm(room);
    setEditingNumber(room.room_number);
    setOpenDialog(true);
    setError('');
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setForm({ room_number: '', floor_level: '', capacity: '', room_type: '' });
    setEditingNumber(null);
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.room_number || !form.floor_level || !form.capacity || !form.room_type) {
      setError('All fields are required');
      return;
    }
    const payload = { ...form, floor_level: parseInt(form.floor_level), capacity: parseInt(form.capacity) };
    try {
      if (editingNumber) {
        const res = await fetch(`${ROOMS_URL}/${editingNumber}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Update failed');
        setSnackbar({ open: true, message: 'Room updated!', severity: 'success' });
      } else {
        const res = await fetch(ROOMS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || 'Create failed');
        }
        setSnackbar({ open: true, message: 'Room added!', severity: 'success' });
      }
      handleCloseDialog();
      fetchRooms();
    } catch (err) {
      setError(err.message);
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };
  
  const handleDelete = async (room_number) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      const res = await fetch(`${ROOMS_URL}/${room_number}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSnackbar({ open: true, message: 'Room deleted!', severity: 'success' });
      fetchRooms();
    } catch (err) {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  const floorOptions = [...new Set(rooms.map(r => r.floor_level))].sort((a, b) => a - b);
  const typeOptions = [...new Set(rooms.map(r => r.room_type))];

  const filteredRooms = rooms.filter(room => {
    const floorMatch = floorFilter ? room.floor_level === parseInt(floorFilter) : true;
    const typeMatch = typeFilter ? room.room_type === typeFilter : true;
    return floorMatch && typeMatch;
  });

  const totalCapacity = filteredRooms.reduce((acc, room) => acc + room.capacity, 0);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Rooms & Labs Admin</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Filter by Floor</InputLabel>
            <Select value={floorFilter} label="Filter by Floor" onChange={e => setFloorFilter(e.target.value)}>
              <MenuItem value=""><em>All Floors</em></MenuItem>
              {floorOptions.map(floor => <MenuItem key={floor} value={floor}>{floor}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Filter by Type</InputLabel>
            <Select value={typeFilter} label="Filter by Type" onChange={e => setTypeFilter(e.target.value)}>
              <MenuItem value=""><em>All Types</em></MenuItem>
              {typeOptions.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="h6">Total Capacity: {totalCapacity}</Typography>
        </Stack>
      </Paper>
      <Fab color="primary" aria-label="add" onClick={handleOpenDialog} sx={{ position: 'fixed', bottom: 32, right: 32 }}>
        <AddIcon />
      </Fab>
      <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><b>Room/Lab Number</b></TableCell>
              <TableCell><b>Floor Level</b></TableCell>
              <TableCell><b>Capacity</b></TableCell>
              <TableCell><b>Type</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRooms.map((room) => (
              <TableRow key={room.room_number}>
                <TableCell>{room.room_number}</TableCell>
                <TableCell>{room.floor_level}</TableCell>
                <TableCell>{room.capacity}</TableCell>
                <TableCell>{room.room_type}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(room)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(room.room_number)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingNumber ? 'Edit Room' : 'Add Room'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField name="room_number" label="Room/Lab Number" value={form.room_number} onChange={handleChange} disabled={!!editingNumber} required />
              <TextField name="floor_level" label="Floor Level" type="number" value={form.floor_level} onChange={handleChange} required />
              <TextField name="capacity" label="Seat Capacity" type="number" value={form.capacity} onChange={handleChange} required />
              <FormControl required>
                <InputLabel>Room Type</InputLabel>
                <Select name="room_type" value={form.room_type} label="Room Type" onChange={handleChange}>
                  <MenuItem value="Lab">Lab</MenuItem>
                  <MenuItem value="Classroom">Classroom</MenuItem>
                </Select>
              </FormControl>
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default RoomsAdmin; 
import React, { useEffect, useState } from 'react';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Stack, Snackbar, Alert, Select, MenuItem, InputLabel, FormControl, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const API_URL = 'http://localhost:8000/courses';
const COURSE_ROOM_TYPES = ['Compulsory', 'Elective'];
const COURSE_TYPES = ['Online', 'Hybrid', 'On-Premise'];

function CoursesAdmin({ courses, fetchCourses, departmentOptions, ...props }) {
  const [form, setForm] = useState({ course_code: '', course_title: '', course_room_type: '', course_type: 'On-Premise', level: '', department: '' });
  const [editingCode, setEditingCode] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenDialog = () => {
    setForm({ course_code: '', course_title: '', course_room_type: '', course_type: 'On-Premise', level: '', department: '' });
    setEditingCode(null);
    setOpenDialog(true);
    setError('');
  };

  const handleEdit = (course) => {
    setForm(course);
    setEditingCode(course.course_code);
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setForm({ course_code: '', course_title: '', course_room_type: '', course_type: 'On-Premise', level: '', department: '' });
    setEditingCode(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.course_code || !form.course_title || !form.course_room_type || !form.course_type || !form.level || !form.department) {
      setError('All fields are required');
      return;
    }
    try {
      if (editingCode) {
        // Update
        const res = await fetch(`${API_URL}/${editingCode}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Update failed');
        setSnackbar({ open: true, message: 'Course updated!', severity: 'success' });
      } else {
        // Create
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || 'Create failed');
        }
        setSnackbar({ open: true, message: 'Course added!', severity: 'success' });
      }
      handleCloseDialog();
      fetchCourses();
    } catch (err) {
      setError(err.message);
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  const handleDelete = async (course_code) => {
    setError('');
    if (!window.confirm('Delete this course?')) return;
    try {
      const res = await fetch(`${API_URL}/${course_code}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSnackbar({ open: true, message: 'Course deleted!', severity: 'success' });
      fetchCourses();
    } catch (err) {
      setError('Delete failed');
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filter courses by department
  const filteredCourses = departmentFilter
    ? courses.filter(c => c.department === departmentFilter)
    : courses;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 32 }}>Courses CRUD</h1>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel id="filter-department-label">Filter by Department</InputLabel>
          <Select
            labelId="filter-department-label"
            value={departmentFilter}
            label="Filter by Department"
            onChange={e => setDepartmentFilter(e.target.value)}
          >
            <MenuItem value=""><em>All Departments</em></MenuItem>
            {departmentOptions.map((dept) => (
              <MenuItem key={dept} value={dept}>{dept}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Fab color="primary" aria-label="add" onClick={handleOpenDialog} sx={{ position: 'fixed', bottom: 32, right: 32 }}>
        <AddIcon />
      </Fab>
      <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><b>Code</b></TableCell>
              <TableCell><b>Title</b></TableCell>
              <TableCell><b>Room Type</b></TableCell>
              <TableCell><b>Type</b></TableCell>
              <TableCell><b>Level</b></TableCell>
              <TableCell><b>Department</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCourses.map((c) => (
              <TableRow key={c.course_code}>
                <TableCell>{c.course_code}</TableCell>
                <TableCell>{c.course_title}</TableCell>
                <TableCell>{c.course_room_type}</TableCell>
                <TableCell>{c.course_type}</TableCell>
                <TableCell>{c.level}</TableCell>
                <TableCell>{c.department}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" size="small" onClick={() => handleEdit(c)}>Edit</Button>
                    <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(c.course_code)}>Delete</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingCode ? 'Edit Course' : 'Add Course'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                name="course_code"
                label="Course Code"
                value={form.course_code}
                onChange={handleChange}
                disabled={!!editingCode}
                required
              />
              <TextField
                name="course_title"
                label="Course Title"
                value={form.course_title}
                onChange={handleChange}
                required
              />
              <FormControl required>
                <InputLabel id="course-room-type-label">Room Type</InputLabel>
                <Select
                  labelId="course-room-type-label"
                  name="course_room_type"
                  value={form.course_room_type}
                  label="Room Type"
                  onChange={handleChange}
                >
                  {COURSE_ROOM_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl required>
                <InputLabel id="course-type-label">Course Type</InputLabel>
                <Select
                  labelId="course-type-label"
                  name="course_type"
                  value={form.course_type}
                  label="Course Type"
                  onChange={handleChange}
                >
                  {COURSE_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="level"
                label="Level"
                value={form.level}
                onChange={handleChange}
                required
                type="number"
              />
              <FormControl required>
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                  labelId="department-label"
                  name="department"
                  value={form.department}
                  label="Department"
                  onChange={handleChange}
                >
                  {departmentOptions.map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default CoursesAdmin; 
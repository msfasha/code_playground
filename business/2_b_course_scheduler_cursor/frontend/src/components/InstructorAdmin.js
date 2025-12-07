import React, { useEffect, useState } from 'react';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Stack, Snackbar, Alert, IconButton, Select, MenuItem, InputLabel, FormControl, OutlinedInput, Checkbox, ListItemText, List, ListItem, ListItemButton, ListItemIcon, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const INSTRUCTORS_URL = 'http://localhost:8000/instructors';
const COURSES_URL = 'http://localhost:8000/courses';

function InstructorAdmin({ departmentOptions }) {
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [isNew, setIsNew] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchInstructors();
    fetchCourses();
  }, []);

  const fetchInstructors = async () => {
    try {
      const res = await fetch(INSTRUCTORS_URL);
      const data = await res.json();
      setInstructors(data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch instructors', severity: 'error' });
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(COURSES_URL);
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch courses', severity: 'error' });
    }
  };

  useEffect(() => {
    if (selectedInstructor) {
      setName(selectedInstructor.name);
      if (departmentOptions.includes(selectedInstructor.department)) {
        setDepartment(selectedInstructor.department);
      } else if (departmentOptions.length > 0) {
        setDepartment(departmentOptions[0]);
      } else {
        setDepartment('');
      }
      setSelectedCourses(selectedInstructor.course_codes || []);
      setIsNew(false);
    } else {
      setName('');
      setDepartment('');
      setSelectedCourses([]);
      setIsNew(true);
    }
  }, [selectedInstructor, departmentOptions]);

  const handleCourseToggle = (course_code) => {
    setSelectedCourses((prev) => {
      const currentIndex = prev.indexOf(course_code);
      const newChecked = [...prev];

      if (currentIndex === -1) {
        newChecked.push(course_code);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      return newChecked;
    });
  };

  const handleSave = async () => {
    if (!name || !department) {
      setSnackbar({ open: true, message: 'Please enter both name and department.', severity: 'error' });
      return false;
    }
    const payload = { name, department, course_codes: selectedCourses };
    try {
      if (isNew) {
        const res = await fetch(INSTRUCTORS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || 'Create failed');
        }
        setSnackbar({ open: true, message: 'Instructor added!', severity: 'success' });
      } else {
        const res = await fetch(`${INSTRUCTORS_URL}/${selectedInstructor.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || 'Update failed');
        }
        setSnackbar({ open: true, message: 'Instructor updated!', severity: 'success' });
      }
      setSelectedInstructor(null);
      fetchInstructors();
      return true;
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this instructor?')) return;
    try {
      const res = await fetch(`${INSTRUCTORS_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Delete failed');
      }
      setSnackbar({ open: true, message: 'Instructor deleted!', severity: 'success' });
      if (selectedInstructor && selectedInstructor.id === id) setSelectedInstructor(null);
      fetchInstructors();
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  const handleEdit = (inst) => {
    setSelectedInstructor(inst);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setSelectedInstructor(null);
    setName('');
    setDepartment('');
    setSelectedCourses([]);
    setIsNew(true);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedInstructor(null);
    setName('');
    setDepartment('');
    setSelectedCourses([]);
    setIsNew(true);
  };

  const handleDialogSave = async () => {
    const success = await handleSave();
    if (success) {
      setDialogOpen(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <h2>Instructor Admin</h2>
      <Button variant="outlined" onClick={handleNew} sx={{ mb: 2 }}>New Instructor</Button>
      <TableContainer component={Paper} sx={{ maxHeight: 600, overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Department</b></TableCell>
              <TableCell sx={{ minWidth: 300 }}><b>Courses</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instructors.map((inst) => (
              <TableRow key={inst.id} selected={selectedInstructor && selectedInstructor.id === inst.id}>                
                <TableCell sx={{ verticalAlign: 'top' }}>{inst.name}</TableCell>
                <TableCell>{inst.department}</TableCell>
                <TableCell sx={{ minWidth: 300 }}>
                  {(inst.course_codes || []).map(code => {
                    const course = courses.find(c => c.course_code === code);
                    return course ? `${course.course_code} - ${course.course_title}` : code;
                  }).map((text, idx) => (
                    <span key={idx} style={{ display: 'block', whiteSpace: 'pre-line' }}>{text}</span>
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(inst)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(inst.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{isNew ? 'Add Instructor' : 'Edit Instructor'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 400 }}>
            <TextField
              label="Instructor Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              fullWidth
            />
            <FormControl fullWidth>
                <InputLabel id="department-select-label">Department</InputLabel>
                <Select
                    labelId="department-select-label"
                    value={department}
                    label="Department"
                    onChange={e => setDepartment(e.target.value)}
                >
                    {departmentOptions.map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl component="fieldset" fullWidth>
              <Typography component="legend" variant="subtitle1" sx={{ mt: 1 }}>Courses</Typography>
              <Paper sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid #ccc' }}>
                <List dense>
                  {courses.map((course) => (
                    <ListItem key={course.course_code} disablePadding>
                      <ListItemButton role={undefined} onClick={() => handleCourseToggle(course.course_code)} dense>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={selectedCourses.indexOf(course.course_code) !== -1}
                            tabIndex={-1}
                            disableRipple
                          />
                        </ListItemIcon>
                        <ListItemText primary={`${course.course_code} - ${course.course_title}`} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleDialogSave}>{isNew ? 'Add' : 'Update'}</Button>
        </DialogActions>
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

export default InstructorAdmin; 
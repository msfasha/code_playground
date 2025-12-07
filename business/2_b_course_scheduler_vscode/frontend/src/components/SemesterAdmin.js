import React, { useEffect, useState } from 'react';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Stack, Snackbar, Alert, Select, MenuItem, InputLabel, FormControl, Typography, IconButton, Checkbox, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const SEMESTERS_URL = 'http://localhost:8000/semesters';
const ROOMS_URL = 'http://localhost:8000/rooms';
const INSTRUCTORS_URL = 'http://localhost:8000/instructors';

/*
  SemesterAdmin component allows admin users to manage semesters, including creating, updating, and deleting semesters,
  as well as assigning courses, instructors, rooms, and capacities for each semester.
*/
/**
 * SemesterAdmin React component
 * @param {Array} courses - List of all courses
 * @param {Array} departmentOptions - List of department names for filtering
 */
function SemesterAdmin({ courses, departmentOptions }) {
  // State hooks for managing semesters, rooms, instructors, filters, and form fields
  const [semesters, setSemesters] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [semesterCode, setSemesterCode] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [courseAssignments, setCourseAssignments] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isNew, setIsNew] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [midExamDate, setMidExamDate] = useState('');
  const [finalExamDate, setFinalExamDate] = useState('');
  const [semesterDialogOpen, setSemesterDialogOpen] = useState(false);


  /**
   * Fetch all semesters from the backend and update state
   */
  const fetchSemesters = async () => {
    try {
      const res = await fetch(SEMESTERS_URL);
      const data = await res.json();
      setSemesters(data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch semesters', severity: 'error' });
    }
  };

  /**
   * Fetch all rooms from the backend and update state
   */
  const fetchRooms = async () => {
    try {
      const res = await fetch(ROOMS_URL);
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch rooms', severity: 'error' });
    }
  };

  /**
   * Fetch all instructors from the backend and update state
   */
  const fetchInstructors = async () => {
    try {
      const res = await fetch(INSTRUCTORS_URL);
      const data = await res.json();
      setInstructors(data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch instructors', severity: 'error' });
    }
  };

  // Update form fields and course assignments when a semester is selected or cleared
  useEffect(() => {
    if (selectedSemester) {
      setSemesterCode(selectedSemester.semester_code);
      setStartDate(selectedSemester.start_date || '');
      setEndDate(selectedSemester.end_date || '');
      setMidExamDate(selectedSemester.mid_exam_date || '');
      setFinalExamDate(selectedSemester.final_exam_date || '');
      const assignments = {};
      (selectedSemester.course_assignments || []).forEach(assignment => {
        assignments[assignment.course_code] = {
          instructor_id: assignment.instructor_id || '',
          room_number: assignment.room_number || '',
          students_capacity: assignment.students_capacity || '',
          registered_students: assignment.registered_students || ''
        };
      });
      setCourseAssignments(assignments);
      setIsNew(false);
    } else {
      setSemesterCode('');
      setCourseAssignments({});
      setStartDate('');
      setEndDate('');
      setMidExamDate('');
      setFinalExamDate('');
      setIsNew(true);
    }
  }, [selectedSemester]);

  // Fetch semesters, rooms, and instructors on mount
  useEffect(() => {
    fetchSemesters();
    fetchRooms();
    fetchInstructors();
  }, []);

  // Also fetch instructors when a semester is selected (in case of branch filtering in the future)
  useEffect(() => {
    if (selectedSemester) {
      fetchInstructors();
    }
  }, [selectedSemester]);

  // Filter courses by selected department
  const filteredCourses = departmentFilter
    ? courses.filter(c => c.department === departmentFilter)
    : courses;

  /**
   * Toggle course assignment for a given course code
   * Adds or removes the course from courseAssignments state
   */
  const handleCourseToggle = (course_code) => {
    setCourseAssignments(prev => {
      const newAssignments = { ...prev };
      if (newAssignments[course_code]) {
        delete newAssignments[course_code];
      } else {
        newAssignments[course_code] = {
          instructor_id: '',
          room_number: '',
          students_capacity: '',
          registered_students: ''
        };
      }
      return newAssignments;
    });
  };

  /**
   * Update a specific field for a course assignment
   */
  const updateCourseAssignment = (course_code, field, value) => {
    setCourseAssignments(prev => ({
      ...prev,
      [course_code]: {
        ...prev[course_code],
        [field]: value
      }
    }));
  };

  /**
   * Save or update the semester with all assignments and details
   * Handles both creation and update logic
   */
  const handleSave = async () => {
    if (!semesterCode) {
      setSnackbar({ open: true, message: 'Please enter a semester code.', severity: 'error' });
      return;
    }
    const course_assignments = Object.keys(courseAssignments).map(course_code => ({
      course_code,
      instructor_id: courseAssignments[course_code].instructor_id === '' ? null : Number(courseAssignments[course_code].instructor_id),
      room_number: courseAssignments[course_code].room_number,
      students_capacity: courseAssignments[course_code].students_capacity === '' ? null : Number(courseAssignments[course_code].students_capacity),
      registered_students: courseAssignments[course_code].registered_students === '' ? null : Number(courseAssignments[course_code].registered_students)
    }));
    const payload = {
      semester_code: semesterCode,
      course_assignments,
      start_date: startDate,
      end_date: endDate,
      mid_exam_date: midExamDate,
      final_exam_date: finalExamDate
    };
    try {
      if (isNew) {
        const res = await fetch(SEMESTERS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || 'Create failed');
        }
        setSnackbar({ open: true, message: 'Semester added!', severity: 'success' });
      } else {
        const res = await fetch(`${SEMESTERS_URL}/${semesterCode}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || 'Update failed');
        }
        setSnackbar({ open: true, message: 'Semester updated!', severity: 'success' });
      }
      setSelectedSemester(null);
      fetchSemesters();
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  /**
   * Delete the currently selected semester after confirmation
   */
  const handleDelete = async () => {
    if (!selectedSemester) return;
    if (!window.confirm('Delete this semester?')) return;
    try {
      const res = await fetch(`${SEMESTERS_URL}/${selectedSemester.semester_code}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Delete failed');
      }
      setSnackbar({ open: true, message: 'Semester deleted!', severity: 'success' });
      setSelectedSemester(null);
      fetchSemesters();
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  /**
   * Prepare form for creating a new semester
   */
  const handleNewSemester = () => {
    setSelectedSemester(null);
    setSemesterCode('');
    setCourseAssignments({});
    setIsNew(true);
    setSemesterDialogOpen(true);
  };

  /**
   * Close the snackbar notification
   */
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Logic for select all/indeterminate checkboxes for filtered courses
  const areAllFilteredSelected = filteredCourses.length > 0 && filteredCourses.every(c => courseAssignments[c.course_code]);
  const isSomeFilteredSelected = filteredCourses.some(c => courseAssignments[c.course_code]) && !areAllFilteredSelected;

  /**
   * Select or deselect all filtered courses
   */
  const handleSelectAllCourses = (event) => {
    if (event.target.checked) {
      setCourseAssignments(prev => {
        const newAssignments = { ...prev };
        filteredCourses.forEach(c => {
          if (!newAssignments[c.course_code]) {
            newAssignments[c.course_code] = {
              instructor_id: '',
              room_number: '',
              students_capacity: '',
              registered_students: ''
            };
          }
        });
        return newAssignments;
      });
    } else {
      setCourseAssignments(prev => {
        const newAssignments = { ...prev };
        filteredCourses.forEach(c => {
          delete newAssignments[c.course_code];
        });
        return newAssignments;
      });
    }
  };

  const handleOpenSemesterDialog = () => setSemesterDialogOpen(true);
  const handleCloseSemesterDialog = () => setSemesterDialogOpen(false);

  // Render the UI for semester admin, including filters, form fields, and course assignments table
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, pl: 0, pr: 0 }} disableGutters>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start" justifyContent="flex-start">
        {/* Left controls: New Semester and Select Semester */}
        <Stack spacing={2} sx={{ minWidth: 180, pl: 0 }}>
          <Button onClick={handleNewSemester} variant="outlined" fullWidth>New Semester</Button>
          <FormControl fullWidth>
            <InputLabel id="semester-list-label">Select Semester</InputLabel>
            <Select
              labelId="semester-list-label"
              value={selectedSemester ? selectedSemester.semester_code : ''}
              label="Select Semester"
              onChange={e => {
                const sem = semesters.find(s => s.semester_code === e.target.value);
                setSelectedSemester(sem || null);
              }}
            >
              <MenuItem value=""><em>New Semester</em></MenuItem>
              {semesters.map((sem) => (
                <MenuItem key={sem.semester_code} value={sem.semester_code}>{sem.semester_code}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedSemester && (
            <Button onClick={handleOpenSemesterDialog} variant="outlined" fullWidth>Edit Semester Info</Button>
          )}
          {selectedSemester && (
            <IconButton color="error" onClick={handleDelete} title="Delete Semester">
              <DeleteIcon />
            </IconButton>
          )}
        </Stack>
        {/* Main area: Department filter and courses table */}
        <Stack flex={1} spacing={2} sx={{ height: '100vh' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl sx={{ minWidth: 220, mb: 0 }} disabled={!selectedSemester}>
              <InputLabel id="filter-department-label">Filter by Department</InputLabel>
              <Select
                labelId="filter-department-label"
                value={departmentFilter}
                label="Filter by Department"
                onChange={e => setDepartmentFilter(e.target.value)}
                disabled={!selectedSemester}
              >
                <MenuItem value=""><em>All Departments</em></MenuItem>
                {departmentOptions.map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleSave} sx={{ height: 40 }} disabled={!selectedSemester}>{isNew ? 'Save Semester' : 'Update Semester'}</Button>
          </Stack>
          {/* Dialog for semester static data */}
          <Dialog open={semesterDialogOpen} onClose={handleCloseSemesterDialog}>
            <DialogTitle>{isNew ? 'New Semester Info' : 'Edit Semester Info'}</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
                <TextField
                  label="Semester Code (e.g. 20241)"
                  value={semesterCode}
                  onChange={e => setSemesterCode(e.target.value)}
                  required
                  disabled={!isNew}
                />
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Mid Exam Date"
                  type="date"
                  value={midExamDate}
                  onChange={e => setMidExamDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Final Exam Date"
                  type="date"
                  value={finalExamDate}
                  onChange={e => setFinalExamDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSemesterDialog}>Close</Button>
            </DialogActions>
          </Dialog>
          <Box sx={{ position: 'relative', flex: 1 }}>
            <TableContainer component={Paper} sx={{ flex: 1, maxHeight: 'calc(100vh - 180px)', overflowY: 'auto', opacity: selectedSemester ? 1 : 0.5, pointerEvents: selectedSemester ? 'auto' : 'none' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={isSomeFilteredSelected}
                        checked={areAllFilteredSelected}
                        onChange={handleSelectAllCourses}
                        inputProps={{ 'aria-label': 'select all courses' }}
                      />
                    </TableCell>
                    <TableCell><b>Code</b></TableCell>
                    <TableCell><b>Title</b></TableCell>
                    <TableCell><b>Type</b></TableCell>
                    <TableCell><b>Level</b></TableCell>
                    <TableCell><b>Department</b></TableCell>
                    <TableCell><b>Instructor</b></TableCell>
                    <TableCell><b>Room</b></TableCell>
                    <TableCell><b>Allocated Capacity</b></TableCell>
                    <TableCell><b>Room/Lab Capacity</b></TableCell>
                    <TableCell><b>Registered</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCourses.map((c) => {
                    const isSelected = courseAssignments[c.course_code];
                    const assignment = isSelected ? courseAssignments[c.course_code] : {};
                    // Find the selected room's capacity
                    let maxCapacity = '';
                    if (assignment.room_number) {
                      const room = rooms.find(r => r.room_number === assignment.room_number);
                      if (room) maxCapacity = room.capacity;
                    }
                    return (
                      <TableRow key={c.course_code}>
                        <TableCell>
                          <Checkbox
                            checked={!!isSelected}
                            onChange={() => handleCourseToggle(c.course_code)}
                          />
                        </TableCell>
                        <TableCell>{c.course_code}</TableCell>
                        <TableCell>{c.course_title}</TableCell>
                        <TableCell>{c.course_type}</TableCell>
                        <TableCell>{c.level}</TableCell>
                        <TableCell>{c.department}</TableCell>
                        <TableCell>
                          {isSelected && (
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <Select
                                value={assignment.instructor_id || ''}
                                onChange={(e) => updateCourseAssignment(c.course_code, 'instructor_id', e.target.value)}
                                displayEmpty
                              >
                                <MenuItem value=""><em>Select Instructor</em></MenuItem>
                                {instructors.map((inst) => (
                                  <MenuItem key={inst.id} value={inst.id}>
                                    {inst.name} ({inst.branch})
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        </TableCell>
                        <TableCell>
                          {isSelected && (
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <Select
                                value={assignment.room_number || ''}
                                onChange={(e) => updateCourseAssignment(c.course_code, 'room_number', e.target.value)}
                                displayEmpty
                              >
                                <MenuItem value=""><em>Select Room</em></MenuItem>
                                {rooms.map((room) => (
                                  <MenuItem key={room.room_number} value={room.room_number}>
                                    {room.room_number} ({room.room_type})
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        </TableCell>
                        <TableCell>
                          {isSelected && (
                            <TextField
                              size="small"
                              type="number"
                              value={assignment.students_capacity || ''}
                              onChange={(e) => updateCourseAssignment(c.course_code, 'students_capacity', e.target.value)}
                              placeholder="Allocated Capacity"
                              inputProps={{ min: 0 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {isSelected && (
                            <TextField
                              size="small"
                              value={maxCapacity}
                              InputProps={{ readOnly: true }}
                              placeholder="Room/Lab Capacity"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {isSelected && (
                            <TextField
                              size="small"
                              type="number"
                              value={assignment.registered_students || ''}
                              onChange={(e) => updateCourseAssignment(c.course_code, 'registered_students', e.target.value)}
                              placeholder="Registered"
                              inputProps={{ min: 0 }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </Stack>
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

/**
 * Export the SemesterAdmin component as default
 */
export default SemesterAdmin; 
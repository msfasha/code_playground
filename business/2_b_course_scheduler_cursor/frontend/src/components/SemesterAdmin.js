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
      return data;
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch semesters', severity: 'error' });
      return [];
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
      console.log('Selected semester data:', selectedSemester);
      console.log('Available instructors:', instructors);
      
      setSemesterCode(selectedSemester.semester_code);
      setStartDate(selectedSemester.start_date || '');
      setEndDate(selectedSemester.end_date || '');
      setMidExamDate(selectedSemester.mid_exam_date || '');
      setFinalExamDate(selectedSemester.final_exam_date || '');
      
      const assignments = {};
      (selectedSemester.course_assignments || []).forEach(assignment => {
        console.log('Course assignment:', assignment);
        assignments[assignment.course_code] = {
          instructor_id: assignment.instructor_id ? assignment.instructor_id.toString() : '',
          room_number: assignment.room_number || '',
          students_capacity: assignment.students_capacity || '',
          registered_students: assignment.registered_students || ''
        };
      });
      
      console.log('Processed assignments:', assignments);
      setCourseAssignments(assignments);
      
      // Check if this is a temporary semester (new semester creation) or a real semester from database
      const isTemporarySemester = !selectedSemester.semester_code || 
                                 selectedSemester.semester_code === '' || 
                                 !semesters.find(s => s.semester_code === selectedSemester.semester_code);
      setIsNew(isTemporarySemester);
    } else {
      setSemesterCode('');
      setCourseAssignments({});
      setStartDate('');
      setEndDate('');
      setMidExamDate('');
      setFinalExamDate('');
      setIsNew(true);
    }
  }, [selectedSemester, instructors, semesters]);

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
   * Assign default instructors to courses based on instructor table data
   * This function finds instructors who are assigned to specific courses and assigns them as defaults
   */
  const assignDefaultInstructors = () => {
    const defaultAssignments = {};
    
    // For each course, find if there's a default instructor assigned
    courses.forEach(course => {
      // Find instructors who have this course in their default course list
      const defaultInstructor = instructors.find(instructor => 
        instructor.course_codes && instructor.course_codes.includes(course.course_code)
      );
      
      if (defaultInstructor) {
        defaultAssignments[course.course_code] = {
          instructor_id: defaultInstructor.id.toString(),
          room_number: '',
          students_capacity: '',
          registered_students: ''
        };
      }
    });
    
    return defaultAssignments;
  };

  /**
   * Save or update the semester with all assignments and details
   * Handles both creation and update logic
   */
  const handleSave = async () => {
    if (!semesterCode) {
      setSnackbar({ open: true, message: 'Please enter a semester code.', severity: 'error' });
      return false;
    }
    
    // For new semesters, assign default instructors to courses that don't have instructors
    let finalCourseAssignments = { ...courseAssignments };
    if (isNew) {
      const defaultAssignments = assignDefaultInstructors();
      // Merge default assignments with existing assignments, but don't override existing ones
      Object.keys(defaultAssignments).forEach(courseCode => {
        if (!finalCourseAssignments[courseCode] || !finalCourseAssignments[courseCode].instructor_id) {
          finalCourseAssignments[courseCode] = {
            ...finalCourseAssignments[courseCode],
            instructor_id: defaultAssignments[courseCode].instructor_id
          };
        }
      });
    }
    
    // Convert course assignments to the expected format
    const course_assignments = Object.keys(finalCourseAssignments).map(course_code => {
      const assignment = finalCourseAssignments[course_code];
      let instructor_id = null;
      
      // Handle instructor_id conversion properly
      if (assignment.instructor_id && assignment.instructor_id !== '') {
        const parsed = parseInt(assignment.instructor_id, 10);
        instructor_id = isNaN(parsed) ? null : parsed;
      }
      
      return {
        course_code,
        instructor_id,
        room_number: assignment.room_number || null,
        students_capacity: assignment.students_capacity === '' ? null : Number(assignment.students_capacity),
        registered_students: assignment.registered_students === '' ? null : Number(assignment.registered_students),
        lecture_schedules: [] // Add empty lecture schedules array
      };
    });
    
    const payload = {
      semester_code: semesterCode,
      course_assignments,
      start_date: startDate || null,
      end_date: endDate || null,
      mid_exam_date: midExamDate || null,
      final_exam_date: finalExamDate || null
    };
    
    console.log('Saving semester with payload:', payload);
    
    try {
      if (isNew) {
        const res = await fetch(SEMESTERS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        
        console.log('Response status:', res.status);
        
        if (!res.ok) {
          const errData = await res.json();
          console.error('Error response:', errData);
          throw new Error(errData.detail || 'Create failed');
        }
        
        const result = await res.json();
        console.log('Success response:', result);
        setSnackbar({ open: true, message: 'Semester added!', severity: 'success' });
        
        // After successful creation, fetch semesters and select the newly created one
        const updatedSemesters = await fetchSemesters();
        // Find and select the newly created semester from the updated list
        const newSemester = updatedSemesters.find(s => s.semester_code === semesterCode);
        if (newSemester) {
          setSelectedSemester(newSemester);
        }
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
        await fetchSemesters();
      }
      return true;
    } catch (err) {
      console.error('Save error:', err);
      
      // Handle different types of errors
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setSnackbar({ open: true, message: 'Network error: Unable to connect to the server. Please check if the backend is running.', severity: 'error' });
      } else if (err.message) {
        setSnackbar({ open: true, message: err.message, severity: 'error' });
      } else {
        setSnackbar({ open: true, message: 'An unexpected error occurred while saving the semester.', severity: 'error' });
      }
      
      return false;
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

  const handleDialogSave = async () => {
    const success = await handleSave();
    if (success) {
      setSemesterDialogOpen(false);
    }
  };

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
          {selectedSemester && !isNew && (
            <Button onClick={handleOpenSemesterDialog} variant="outlined" fullWidth>Edit Semester Info</Button>
          )}
          {selectedSemester && !isNew && (
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
              <Button onClick={handleDialogSave}>Save</Button>
              <Button onClick={handleCloseSemesterDialog}>Close</Button>
            </DialogActions>
          </Dialog>
          <Box sx={{ position: 'relative', flex: 1 }}>
            <TableContainer component={Paper} sx={{ flex: 1, maxHeight: 'calc(100vh - 180px)', overflowY: 'auto', opacity: (selectedSemester || isNew) ? 1 : 0.5, pointerEvents: (selectedSemester || isNew) ? 'auto' : 'none' }}>
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
                                value={assignment.instructor_id ? assignment.instructor_id.toString() : ''}
                                onChange={(e) => updateCourseAssignment(c.course_code, 'instructor_id', e.target.value)}
                                displayEmpty
                              >
                                <MenuItem value=""><em>Select Instructor</em></MenuItem>
                                {instructors.map((inst) => (
                                  <MenuItem key={inst.id} value={inst.id.toString()}>
                                    {inst.name} ({inst.department})
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
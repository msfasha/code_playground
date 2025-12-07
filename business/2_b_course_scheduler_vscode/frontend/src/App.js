import React, { useEffect, useState } from 'react';
import {
  Box, AppBar, Tabs, Tab, Toolbar
} from '@mui/material';
import CoursesAdmin from './components/CoursesAdmin';
import SemesterAdmin from './components/SemesterAdmin';
import RoomsAdmin from './components/RoomsAdmin';
import InstructorAdmin from './components/InstructorAdmin';

const API_URL = 'http://localhost:8000/courses';

function App() {
  const [courses, setCourses] = useState([]);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  // Get unique department values from courses
  const departmentOptions = Array.from(new Set(courses.map(c => c.department))).filter(Boolean);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="inherit" indicatorColor="secondary">
            <Tab label="Courses Admin" />
            <Tab label="Rooms Admin" />
            <Tab label="Instructor Admin" />
            <Tab label="Semester Admin" />
          </Tabs>
        </Toolbar>
      </AppBar>
      {tab === 0 && (
        <CoursesAdmin
          courses={courses}
          fetchCourses={fetchCourses}
          departmentOptions={departmentOptions}
        />
      )}
      {tab === 1 && <RoomsAdmin />}
      {tab === 2 && <InstructorAdmin departmentOptions={departmentOptions} />}
      {tab === 3 && (
        <SemesterAdmin
          courses={courses}
          departmentOptions={departmentOptions}
        />
      )}
    </Box>
  );
}

export default App;

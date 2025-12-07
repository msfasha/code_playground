import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';
import { SocketProvider } from './contexts/SocketContext';
import store from './store';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/slices/authSlice';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />
          }
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

/**
 * App.js - Main React component for Raasel Chat Platform.
 * Handles authentication and main chat UI.
 * Loads user from localStorage and switches between AuthForm and MainChatUI.
 */

import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import MainChatUI from './components/MainChatUI';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleAuthSuccess = (user) => {
    setUser(user);
  };

  if (!user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return <MainChatUI user={user} />;
}

export default App; 
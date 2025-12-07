/**
 * Raasel Chat Platform - Authentication Form Component
 * 
 * React component providing comprehensive authentication interface with toggle-based design
 * for login and registration modes. Supports both user registration and login functionality.
 * 
 * Key Features:
 * - Dual authentication modes (login/register) with seamless switching
 * - User registration with username, email, password validation
 * - Login with email and password
 * - Real-time form validation and loading state management
 * - JWT token management and localStorage integration
 * - Responsive design with error handling and user feedback
 * 
 * Component Props:
 * - onAuthSuccess(function): Callback after successful authentication
 * 
 * Component State:
 * - mode: Current auth mode ('login' or 'register')
 * - form: Form field values and validation state
 * - loading: Loading state during API calls
 * - error: Error message display
 * 
 * API Integration:
 * - POST /api/clients/register: User registration
 * - POST /api/clients/login: User authentication
 * 
 * Dependencies: React, useState, apiService, styled-components
 */

import React, { useState } from 'react';
import apiService from '../services/api';

const AuthForm = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear general error when user makes changes
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const errors = {};

    if (mode === 'register') {
      // Username validation
      if (!form.username.trim()) {
        errors.username = 'Username is required';
      } else if (form.username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
        errors.username = 'Username can only contain letters, numbers, and underscores';
      }

      // Password validation
      if (!form.password) {
        errors.password = 'Password is required';
      } else if (form.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
        errors.password = 'Password must contain uppercase, lowercase, and number';
      }

      // Confirm password validation
      if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    // Email validation
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Login mode password validation
    if (mode === 'login' && !form.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setValidationErrors({});
    setForm({ username: '', email: '', password: '', confirmPassword: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        // Register new user
        const registerData = {
          username: form.username,
          email: form.email,
          password: form.password
        };

        const registerResponse = await apiService.register(registerData);
        
        if (registerResponse.data.success) {
          // Auto-login after successful registration
          const loginResponse = await apiService.login({
            email: form.email,
            password: form.password
          });

          if (loginResponse.data.success) {
            const { token, user } = loginResponse.data.data;
            apiService.setToken(token);
            localStorage.setItem('user', JSON.stringify(user));
            onAuthSuccess && onAuthSuccess(user);
          }
        }
      } else {
        // Login existing user
        const loginData = {
          email: form.email,
          password: form.password
        };

        const loginResponse = await apiService.login(loginData);
        
        if (loginResponse.data.success) {
          const { token, user } = loginResponse.data.data;
          apiService.setToken(token);
          localStorage.setItem('user', JSON.stringify(user));
          onAuthSuccess && onAuthSuccess(user);
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Handle validation errors from server
        const serverErrors = {};
        err.response.data.errors.forEach(error => {
          serverErrors[error.path] = error.msg;
        });
        setValidationErrors(serverErrors);
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (fieldName) => {
    return validationErrors[fieldName] || '';
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-wrapper">
        <div className="auth-header">
          <h1>Raasel Chat</h1>
          <p>Welcome to the secure chat platform</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
          
          {mode === 'register' && (
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className={getFieldError('username') ? 'error' : ''}
              />
              {getFieldError('username') && (
                <span className="error-message">{getFieldError('username')}</span>
              )}
            </div>
          )}
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={getFieldError('email') ? 'error' : ''}
            />
            {getFieldError('email') && (
              <span className="error-message">{getFieldError('email')}</span>
            )}
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={getFieldError('password') ? 'error' : ''}
            />
            {getFieldError('password') && (
              <span className="error-message">{getFieldError('password')}</span>
            )}
          </div>
          
          {mode === 'register' && (
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={getFieldError('confirmPassword') ? 'error' : ''}
              />
              {getFieldError('confirmPassword') && (
                <span className="error-message">{getFieldError('confirmPassword')}</span>
              )}
            </div>
          )}
          
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
          
          <div className="auth-toggle">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button type="button" onClick={toggleMode} className="link-btn">
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button type="button" onClick={toggleMode} className="link-btn">
                  Sign In
                </button>
              </span>
            )}
          </div>
          
          {error && <div className="auth-error">{error}</div>}
        </form>
      </div>
      
      <style>{`
        .auth-form-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        
        .auth-form-wrapper {
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          padding: 2rem;
          min-width: 400px;
          max-width: 500px;
          width: 100%;
        }
        
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .auth-header h1 {
          color: #333;
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          font-weight: 700;
        }
        
        .auth-header p {
          color: #666;
          margin: 0;
          font-size: 1rem;
        }
        
        .auth-form h2 {
          margin: 0 0 1.5rem 0;
          color: #333;
          text-align: center;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .auth-form input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }
        
        .auth-form input:focus {
          outline: none;
          border-color: #667eea;
        }
        
        .auth-form input.error {
          border-color: #e74c3c;
        }
        
        .error-message {
          color: #e74c3c;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          display: block;
        }
        
        .submit-btn {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          margin-top: 1rem;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .auth-toggle {
          margin-top: 1.5rem;
          text-align: center;
          color: #666;
        }
        
        .link-btn {
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          text-decoration: underline;
          font-size: 1rem;
          font-weight: 500;
        }
        
        .link-btn:hover {
          color: #5a6fd8;
        }
        
        .auth-error {
          color: #e74c3c;
          margin-top: 1rem;
          text-align: center;
          padding: 0.75rem;
          background: #fdf2f2;
          border-radius: 6px;
          border: 1px solid #fecaca;
        }
        
        @media (max-width: 480px) {
          .auth-form-wrapper {
            min-width: auto;
            margin: 0 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthForm; 
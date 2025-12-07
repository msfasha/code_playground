/**
 * Raasel Chat Platform - Socket.IO Service
 * 
 * Provides a centralized WebSocket client for real-time chat using Socket.IO.
 * Handles connection management, event registration, and secure communication.
 * 
 * Main Methods:
 *   - connect(organizationId, sessionId, userId): Connects to the server and returns the socket instance.
 *   - disconnect(): Gracefully disconnects from the server.
 *   - getSocket(): Returns the current socket instance (or null if not connected).
 * 
 * Usage:
 *   import socketService from './services/socket';
 *   const socket = socketService.connect(orgId, sessionId, userId);
 *   socket.on('new_message', (msg) => { ... });
 *   socketService.disconnect();
 * 
 * Server URL is set via environment variable (APP_SERVER_URL).
 */

import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(organizationId, sessionId, userId) {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      secure: true,
      rejectUnauthorized: false, // Only for development
      query: {
        organization_id: organizationId,
        session_id: sessionId,
        user_id: userId
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to server via HTTPS');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService(); 
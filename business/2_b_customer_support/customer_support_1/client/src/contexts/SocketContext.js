import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return socket;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000', {
      auth: {
        token: user.id
      }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext; 
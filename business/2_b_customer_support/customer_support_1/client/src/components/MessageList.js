import React, { useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import {
  Box,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import { format } from 'date-fns';

const MessageList = ({ chatId }) => {
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const socket = useSocket();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!socket || !chatId) return;

    // Load initial messages
    socket.emit('get_messages', { chatId }, (response) => {
      if (response.success) {
        setMessages(response.messages);
      }
      setLoading(false);
    });

    // Listen for new messages
    socket.on('new_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('new_message');
    };
  }, [socket, chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {messages.map((message) => (
        <Box
          key={message.id}
          sx={{
            display: 'flex',
            justifyContent: message.isCustomer ? 'flex-end' : 'flex-start'
          }}
        >
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              maxWidth: '80%',
              backgroundColor: message.isCustomer ? 'primary.main' : 'grey.100',
              color: message.isCustomer ? 'white' : 'text.primary',
              borderRadius: 2
            }}
          >
            {message.type === 'text' && (
              <Typography variant="body1">{message.content}</Typography>
            )}
            {message.type === 'image' && (
              <Box
                component="img"
                src={message.content}
                alt="Shared image"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  borderRadius: 1
                }}
              />
            )}
            {message.type === 'file' && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography variant="body2">
                  {message.fileData.fileName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({Math.round(message.fileData.fileSize / 1024)} KB)
                </Typography>
              </Box>
            )}
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 0.5,
                opacity: 0.7
              }}
            >
              {format(new Date(message.timestamp), 'HH:mm')}
            </Typography>
          </Paper>
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList; 
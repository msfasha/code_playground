import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Avatar, Divider } from '@mui/material';
import { Send as SendIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { useSocket } from '../contexts/SocketContext';
import MessageList from './MessageList';
import TypingIndicator from './TypingIndicator';

const ChatWindow = ({ chat, onClose }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const socket = useSocket();
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!socket || !chat) return;

    // Join chat room
    socket.emit('join_chat', { chatId: chat.id });

    // Listen for typing indicators
    socket.on('typing_status', ({ typingUsers }) => {
      setTypingUsers(typingUsers);
    });

    return () => {
      socket.emit('leave_chat', { chatId: chat.id });
      socket.off('typing_status');
    };
  }, [socket, chat]);

  const handleSendMessage = () => {
    if (!message.trim() || !socket || !chat) return;

    socket.emit('send_message', {
      chatId: chat.id,
      content: message,
      type: 'text'
    });

    setMessage('');
    setIsTyping(false);
  };

  const handleTyping = () => {
    if (!socket || !chat) return;

    setIsTyping(true);
    socket.emit('typing', { chatId: chat.id, isTyping: true });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing', { chatId: chat.id, isTyping: false });
    }, 3000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !socket || !chat) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      socket.emit('send_message', {
        chatId: chat.id,
        content: e.target.result,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        fileData: {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        }
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '600px',
        width: '100%',
        maxWidth: '400px'
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Avatar
          src={chat.customer.avatar}
          alt={chat.customer.name}
          sx={{ mr: 2 }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1">{chat.customer.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {chat.customer.email}
          </Typography>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <MessageList chatId={chat.id} />
      </Box>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <Box sx={{ px: 2, py: 1 }}>
          <TypingIndicator users={typingUsers} />
        </Box>
      )}

      <Divider />

      {/* Message Input */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          sx={{ mr: 1 }}
        >
          <AttachFileIcon />
        </IconButton>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          onKeyDown={handleTyping}
          size="small"
          sx={{ mr: 1 }}
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatWindow; 
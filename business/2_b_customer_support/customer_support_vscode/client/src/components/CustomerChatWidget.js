import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  TextField,
  Fab,
  Zoom,
  Collapse
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material';
import MessageList from './MessageList';
import TypingIndicator from './TypingIndicator';

const CustomerChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatId, setChatId] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const socket = useSocket();
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('chat_started', ({ chatId }) => {
      setChatId(chatId);
    });

    socket.on('typing_status', ({ typingUsers }) => {
      setTypingUsers(typingUsers);
    });

    return () => {
      socket.off('chat_started');
      socket.off('typing_status');
    };
  }, [socket]);

  const handleStartChat = () => {
    if (!socket) return;
    socket.emit('start_chat', {
      metadata: {
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    });
    setIsOpen(true);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !socket || !chatId) return;

    socket.emit('send_message', {
      chatId,
      content: message,
      type: 'text'
    });

    setMessage('');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !socket || !chatId) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      socket.emit('send_message', {
        chatId,
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
    <>
      <Zoom in={!isOpen}>
        <Fab
          color="primary"
          onClick={handleStartChat}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000
          }}
        >
          <ChatIcon />
        </Fab>
      </Zoom>

      <Collapse in={isOpen}>
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 350,
            height: 500,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6">Customer Support</Typography>
            <IconButton onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {chatId ? (
              <MessageList chatId={chatId} />
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                Connecting to an agent...
              </Typography>
            )}
          </Box>

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <Box sx={{ px: 2, py: 1 }}>
              <TypingIndicator users={typingUsers} />
            </Box>
          )}

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
              size="small"
              sx={{ mr: 1 }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!message.trim() || !chatId}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default CustomerChatWidget; 